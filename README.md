# Stellar TSS Boilerplate

## Getting Started

```bash
cd stellar-tss-boilerplate
cp config.json.example config.json
cd src
```

### 1. Create 3 accounts on testnet
```bash
nodejs createAccount.js
```
This will set three accounts in the config file to use throughout the tutorial.

### 2. Make a payment and upload the contract
```bash
nodejs uploadContract.js
```
Using the funding account, we make a payment and then we upload the contract `contract.js`.
This example contract will take a single input `source` which is the public key we would like to send a payment to. In the contract, the source account will be the user account which will send 1 lumen to the issuer. In return, the issuer will send 100 lumens. Great deal! Both of these operations are done within a single transaction.
Remember our turret must be able to sign for the transaction that involves the issuer, we will do set this in the next step.

** Be sure to change the issuer account to match the issuer account public key generated in the config file. This will be hard-coded into the contract.

### 3. Set the multisignature options for the issuer account to use the turret signer account as a signer
```bash
nodejs multisignature.js
```
This will add a new signer for the issuer account, namely the turret signer.

### 4. Top-up the balance for your public key to run the contract
```bash
nodejs topUp.js
```
Here we top-up the balance for our funding account to run the contract.

### 5. Generate an XDR access token
```bash
nodejs generateXDRToken.js
```
We will need this token to run our smart contract.

### 6. Run the smart contract
```bash
nodejs runFunc.js
```
This will return the XDR that our contract returns. We need to then apply the signature of the turret to this XDR.

### 7. Apply the turret signature to the XDR
```bash
nodejs turretSignTxn.js
```

### 8. Send it off!
```bash
nodejs sendResult.js
```
Submit the transaction after signing with the user account.