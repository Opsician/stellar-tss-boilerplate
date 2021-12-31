//Turret: https://stellar-turrets-testnet.sdf-ecosystem.workers.dev
//Public Key: GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX
//Max Fee: 10

const Stellar = require('stellar-sdk')
const StellarBase = require('stellar-base');
const axios = require('axios');
const fs = require('fs')
const util = require("util");
const readFile = util.promisify(fs.readFile);
var FormData = require('form-data');
const config = require('../config.json');

const server = new Stellar.Server('https://horizon-testnet.stellar.org');

const payment = async () => {
    const paymentToDest = {
        destination: config.turret.public,
        asset: Stellar.Asset.native(),
        amount: '2',
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

const uploadContract = async(xdr) => {

    const form = new FormData();

    form.append('txFunctionFee', xdr);

    const file = await readFile('./contract.js')
    form.append('txFunction', file, 'contract.js');

    const fields = [
        {
            name: "source",
            type: "string",
            description: "account to receive assets", 
            rule: "Required"
        }
    ]
    const fields64 = Buffer.from(JSON.stringify(fields)).toString("base64")
    form.append('txFunctionFields', fields64);

    const response = await axios.post(config.turret.url + 'tx-functions', form, { headers: {...form.getHeaders()}})
    console.log(response.data)

    config.contract.hash = response.data.hash
    config.contract.signer = response.data.signer
    var json = JSON.stringify(config)
    fs.writeFile('../config.json', json, 'utf8', (err) => {
        if (err) throw err;
        console.log(`Saved contract info`)
    });
}

payment().then(uploadContract).catch((e) => console.error(e))
