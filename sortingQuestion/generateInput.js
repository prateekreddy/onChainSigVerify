const fs = require('fs');

const noOfRand = 100;
const input = [];

for(var i = 0; i < noOfRand; i++) {
    input.push(parseInt(Math.random()*10000000));
}

fs.writeFile("./input.json", JSON.stringify(input, null, 2), console.log);