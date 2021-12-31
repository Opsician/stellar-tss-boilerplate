const Stellar = require('stellar-sdk')
const StellarBase = require('stellar-base');
const axios = require('axios');
const config = require('../config.json');

const server = new Stellar.Server('https://horizon-testnet.stellar.org');

const payment = async () => {
    const paymentToDest = {
        destination: config.turret.public,
        asset: Stellar.Asset.native(),
        amount: '10',
    }
    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: 'Test SDF Network ; September 2015',
    }
    const accountA = await server.loadAccount(config.fundingAcct.public)
    const transaction = new Stellar.TransactionBuilder(accountA, txOptions)
        .addOperation(Stellar.Operation.payment(paymentToDest))
        .setTimeout(StellarBase.TimeoutInfinite)
        .build()

    transaction.sign(Stellar.Keypair.fromSecret(config.fundingAcct.secret))

    const xdrPay = transaction.toEnvelope().toXDR().toString("base64")

    return xdrPay
}

const topUp = async(xdr) => {

    const body = {
        txFunctionFee: xdr
    }

    const response = await axios.post(config.turret.url + 'tx-fees/' + config.fundingAcct.public, body)
    console.log(response.data)
}

payment().then(topUp).catch((e) => console.error(e))
