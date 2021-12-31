const axios = require('axios');
const config = require('../config.json');
var fs = require('fs');

const funcHash = config.contract.hash

options = {
    turretKey: config.turret.public,
    turretURL: config.turret.url,
    fee: '2',
    network: 'https://horizon-testnet.stellar.org'
}

const runFunc = async() => {

    const body = {
        source: config.userAcct.public
    }

    const headers = {
        "Authorization": "Bearer " + config.xdrToken
    }

    const response = await axios.post(options.turretURL + 'tx-functions/' + funcHash, body, {headers: headers})
    console.log(response.data)

    config.result.xdr = response.data.xdr
    config.result.signer = response.data.signer
    config.result.signature = response.data.signature
    var json = JSON.stringify(config)
    fs.writeFile('../config.json', json, 'utf8', (err) => {
        if (err) throw err;
        console.log(`Saved function result`)
    });
}

runFunc().then(console.log).catch(console.error)
