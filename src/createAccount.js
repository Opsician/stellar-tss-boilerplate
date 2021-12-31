const Stellar = require('stellar-sdk')
const axios = require('axios')
const config = require('../config.json');
const fs = require('fs');

const options = {
    network: 'https://horizon-testnet.stellar.org',
    friendbot: 'https://friendbot.stellar.org'
}

let accounts = ['fundingAcct', 'issuerAcct', 'userAcct']

accounts.forEach((acct) => {
    const pair = Stellar.Keypair.random();

    axios.get(options.friendbot, {
        params: {
            addr: pair.publicKey()
        }
    })
    .then(function (response) {
        console.log("SUCCESS! You have a new account :)\n");
        console.log('Secret Key: ' + pair.secret());
        console.log('Public Key: ' + pair.publicKey());

        config[acct].secret = pair.secret()
        config[acct].public = pair.publicKey()
        var json = JSON.stringify(config)
        fs.writeFile('../config.json', json, 'utf8', (err) => {
            if (err) throw err;
            console.log(`Saved account for ` + acct)
        });
    })
    .catch(function (error) {
        console.error("ERROR!", error);
    })
})