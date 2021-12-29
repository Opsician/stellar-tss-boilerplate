//Turret: https://stellar-turrets-testnet.sdf-ecosystem.workers.dev
//Public Key: GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX
//Max Fee: 10

const Stellar = require('stellar-sdk')
const StellarBase = require('stellar-base');
const axios = require('axios');

const account = {
    secret: 'SDJBUMOB4QWUZD5J75J6IS7HQ27C5N5XYX7SLONV2MLQC4VWG4PYEOYO',
    public: 'GCVXQCR7QCWDCQ6T324MGXDXRKNBNH2C4UGF4CLKDIQEBSH2LY4PBFWC',
}

options = {
    turretKey: 'GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX',
    turretURL: 'https://stellar-turrets-testnet.sdf-ecosystem.workers.dev/',
    fee: '10',
    network: 'https://horizon-testnet.stellar.org'
}

const server = new Stellar.Server(options.network);

const payment = async () => {
    const paymentToDest = {
        destination: options.turretKey,
        asset: Stellar.Asset.native(),
        amount: options.fee,
    }
    const txOptions = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: 'Test SDF Network ; September 2015',
    }
    const accountA = await server.loadAccount(account.public)
    const transaction = new Stellar.TransactionBuilder(accountA, txOptions)
        .addOperation(Stellar.Operation.payment(paymentToDest))
        .setTimeout(StellarBase.TimeoutInfinite)
        .build()

    transaction.sign(Stellar.Keypair.fromSecret(account.secret))

    const xdrPay = transaction.toEnvelope().toXDR().toString("base64")

    return xdrPay
}

const topUp = async(xdr) => {

    const body = {
        txFunctionFee: xdr
    }

    const response = await axios.post(options.turretURL + 'tx-fees/' + account.public, body)
    console.log(response.data)
}

payment().then(topUp).catch((e) => console.error(e))
