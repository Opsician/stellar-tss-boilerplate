const {
    Networks,
    Server,
    TransactionBuilder,
    Operation,
    Keypair
  } = require("stellar-sdk");
  
  const server = new Server("https://horizon-testnet.stellar.org");
  
  const setMultisigOnMasterAccount = async () => {
    const extraSigner = {
      signer: {
        ed25519PublicKey: 'GCOYSJ5QSKX4RXKYIMMAGZ4RPE2EZQPPE7OYQPKT5FMIUDYGXUBAA424',
        weight: 1
      }
    };
  
    const thresholds = {
      masterWeight: 1, // master represents the issuers private key
      lowThreshold: 1, // issuer or turret can sign
      medThreshold: 1, // payments or changes of trustlines
      highThreshold: 1 // account merges and other account options
    };
  
    const txOptions = {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET
    };
  
    const masterAccount = await server.loadAccount('GCVXQCR7QCWDCQ6T324MGXDXRKNBNH2C4UGF4CLKDIQEBSH2LY4PBFWC');
  
    const multiSigTx = new TransactionBuilder(masterAccount, txOptions)
      .addOperation(Operation.setOptions(thresholds))
      .addOperation(Operation.setOptions(extraSigner))
      .setTimeout(0)
      .build();
  
    multiSigTx.sign(Keypair.fromSecret('SDJBUMOB4QWUZD5J75J6IS7HQ27C5N5XYX7SLONV2MLQC4VWG4PYEOYO'));
  
    await server.submitTransaction(multiSigTx);
  };
  
  setMultisigOnMasterAccount()
    .then(() => {
      console.log("ok");
    })
    .catch(e => {
      console.error(e);
      throw e;
    });