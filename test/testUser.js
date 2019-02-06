const Web3 = require('web3');
const config = require('../config.json');
const userMetadata = require("../build/contracts/User.json");

const web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://${config.host}:${config.port}`));
const user = new web3.eth.Contract(userMetadata.abi, config.app.user);

const privKey = "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773";
const data = {
    name: "prateek",
    id: "id1",
    address: "bangalore"
};

const encodedName = web3.utils.padRight(web3.utils.utf8ToHex(data.name), 64);
const encodedId = web3.utils.padRight(web3.utils.utf8ToHex(data.id), 64);
const encodedAddr = web3.utils.padRight(web3.utils.utf8ToHex(data.address), 64);
const personData = encodedName + encodedId.replace("0x", "") + encodedAddr.replace("0x",""); // use splice instead
const signedData = web3.eth.accounts.sign(personData, privKey);

console.log(signedData);
user.methods.setPerson(signedData.message, signedData.signature).send({
    from: config.app.owner
}).then(console.log);