const { Transaction, Networks, Keypair, Server } = require('stellar-sdk')
const config = require('../config.json');

const sendTxn = async (secret) => {

    const server = new Server('https://horizon-testnet.stellar.org')

    var transaction = new Transaction(config.result.signedTxn, Networks.TESTNET)

    transaction.sign(Keypair.fromSecret(secret))

    await server.submitTransaction(transaction)

}

sendTxn(config.userAcct.secret)