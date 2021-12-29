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

const account = {
    secret: 'SDJBUMOB4QWUZD5J75J6IS7HQ27C5N5XYX7SLONV2MLQC4VWG4PYEOYO',
    public: 'GCVXQCR7QCWDCQ6T324MGXDXRKNBNH2C4UGF4CLKDIQEBSH2LY4PBFWC',
}

options = {
    turretKey: 'GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX',
    turretURL: 'https://stellar-turrets-testnet.sdf-ecosystem.workers.dev/',
    fee: '2',
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

    const response = await axios.post(options.turretURL + 'tx-functions', form, { headers: {...form.getHeaders()}})
    console.log(response.data)
    const jsonContent = JSON.stringify(response.data)
    fs.writeFile("contract.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
}

payment().then(uploadContract).catch((e) => console.error(e))
