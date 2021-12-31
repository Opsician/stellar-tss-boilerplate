const { Server, Networks, TransactionBuilder, Operation, Asset } = require('stellar-sdk')
const server = new Server("https://horizon-testnet.stellar.org")
module.exports = async (body) => {
    const { source: userPK } = body
    const fee = await server.fetchBaseFee();

    const issuerPK = 'GAZQMTS2SRKQ2ROF2PXZ6VZTYIJ6IBCS7LUUMH73GKN7TCUR46VX7AGQ' //change this to the issuer in config

    const paymentToDest = {
        destination: userPK,
        asset: Asset.native(),
        amount: '100',
    }
    const paymentToSrc = {
        destination: issuerPK,
        asset: Asset.native(),
        amount: '1',
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