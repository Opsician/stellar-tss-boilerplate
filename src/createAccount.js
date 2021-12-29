const Stellar = require('stellar-sdk')
const axios = require('axios')
const fs = require('fs')

const options = {
    network: 'https://horizon-testnet.stellar.org',
    friendbot: 'https://friendbot.stellar.org'
}

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
})
.catch(function (error) {
    console.error("ERROR!", error);
})