const { Transaction, Networks } = require('stellar-sdk')
const config = require('../config.json');
var fs = require('fs');

const xdr = config.result.xdr
const signer = config.result.signer
const signature = config.result.signature
const transaction = new Transaction(xdr, Networks.TESTNET)
transaction.addSignature(signer, signature)

console.log(transaction.toXDR())

config.result.signedTxn = transaction.toXDR()
var json = JSON.stringify(config)
fs.writeFile('../config.json', json, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Saved signed XDR`)
});