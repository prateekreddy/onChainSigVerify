const fs = require('fs');
const User = artifacts.require("./User.sol");
const Decoder = artifacts.require("./Decoder.sol");
const config = require("../config.json");

module.exports = function(deployer, network, accounts) {
    console.log(config)
    deployer.deploy(Decoder);
    deployer.link(Decoder, User);
    const ownerAccount = accounts[0];
    return deployer.deploy(User, ownerAccount).then(() => {
        console.log("deployed")
        config.app.user = User.address;
        // config.app.owner = ownerAccount;
        return fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
            console.log(config)
            console.log("contracts deployed and config updated");
        })
    });
};
