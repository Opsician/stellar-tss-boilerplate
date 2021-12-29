const { Server, Networks, TransactionBuilder, Operation, Asset } = require('stellar-sdk')
const server = new Server("https://horizon-testnet.stellar.org")
module.exports = async (body) => {
    const { source: userPK } = body
    const fee = await server.fetchBaseFee();

    const issuerPK = 'GCOYSJ5QSKX4RXKYIMMAGZ4RPE2EZQPPE7OYQPKT5FMIUDYGXUBAA424'

    const paymentToDest = {
        destination: userPK,
        asset: Asset.native(),
        amount: '100',
    }
    const paymentToSrc = {
        destination: issuerPK,
        asset: Asset.native(),
        amount: '10',
        source: userPK
    }

    return server.loadAccount(issuerPK).then(async (account) => {
        let transaction = new TransactionBuilder(account, {
            fee: fee,
            networkPassphrase: Networks.TESTNET
        })
        .addOperation(Operation.payment(paymentToDest))
        .addOperation(Operation.payment(paymentToSrc))

        transaction = transaction.setTimeout(0).build()
        return transaction.toXDR()
    })
};