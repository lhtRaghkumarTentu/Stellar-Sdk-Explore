const stellarSdk = require('stellar-sdk');
const prompt = require("prompt-sync")();

/**
 * Establishing connection with stellar
 * To use the live network, set the hostname to 'horizon.stellar.org'
 */
const server = new stellarSdk.Server('https://horizon-testnet.stellar.org');

/**
 * Create Stellar Account
 */
const createAccount = () => {
    const pair = stellarSdk.Keypair.random();
    let createSecretKey = pair.secret();
    let createPublicKey = pair.publicKey();
    if (!createSecretKey && !createPublicKey){
        console.log("Faile to create account");
    }else{
        console.log("Account created successfully. Find Details Below.");
        console.log("Secret-Key: ", createSecretKey);
        console.log("Public-Key: ", createPublicKey);
    }
}

/**
 * Fund Stellar Account
 */
const fundAccount = async() => {
    let publicKey = prompt("Enter Account Id: ");
    await import('node-fetch').then(`https://friendbot.stellar.org?addr=${publicKey}`).catch((err)=>{
        console.log(`Failed to fund ${publicKey} on the test network`, err.message)
    });
    console.log(`Successfully funded ${publicKey} on the test network`);
}

/**
 * Get Balance in Stellar Account
 */
const getBalance = async() =>{
    let publicKey =  prompt("Enter Account Id: ");
    const account = await server.loadAccount(publicKey).catch(()=>{
        console.log("Failed to fetch stellar account balance");
    });
    if(account){
        account.balances.forEach((balance)=> {
            console.log("Balances for account: " + publicKey);
            console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
        })
    }
}

/**
 * Issue asset
 */
const issueAsset = () =>{
    const issuerSecretKey = prompt("Enter issuer Secret Key: ");
    const recieverSecretKey = prompt("Enter reciever secret Key: ");
    let issuingKeys = stellarSdk.Keypair.fromSecret(issuerSecretKey);
    let receivingKeys = stellarSdk.Keypair.fromSecret(recieverSecretKey);
  
    // Create an object to represent the new asset
    const assetName = prompt("Enter asset name: ");
    const asset = new stellarSdk.Asset(assetName, issuingKeys.publicKey());
  
    server.loadAccount(receivingKeys.publicKey())
        // First, the receiving account must trust the asset
        .then((receiver)=> {
            let transaction = new stellarSdk.TransactionBuilder(receiver, {fee: 100, networkPassphrase: stellarSdk.Networks.TESTNET})
                .addOperation( stellarSdk.Operation.changeTrust({ asset: asset, limit: "1000"}))
                .setTimeout(100)
                .build();
            transaction.sign(receivingKeys);
            return server.submitTransaction(transaction);
        })
        .then(console.log)
  

        // Second, the issuing account actually sends a payment using the asset
        .then(()=> {
            return server.loadAccount(issuingKeys.publicKey());
        })
        .then((issuer)=> {
            let transaction = new stellarSdk.TransactionBuilder(issuer, { fee: 100, networkPassphrase: stellarSdk.Networks.TESTNET})
                .addOperation(stellarSdk.Operation.payment({ destination: receivingKeys.publicKey(), asset: asset, amount: "10"}))
                .setTimeout(100)
                .build();
            transaction.sign(issuingKeys);
            return server.submitTransaction(transaction);
        })
        .then(console.log)
        .catch((error)=> {
            console.error("Error!", error);
        });
        console.log("Asset created SuccessFully!!")
}

const transaction = async()=>{
    const senderSecretKey = prompt("Enter Sender Secret Key: ");
    const recieverPublicKey = prompt("Enter reciever Account Id: ");
    const amount = prompt("Enter Amount to Send: ");
    let senderKeys = stellarSdk.Keypair.fromSecret(senderSecretKey);
    const account = await server.loadAccount(senderKeys.publicKey());
    const transaction = new stellarSdk.TransactionBuilder(account, { fee:100, networkPassphrase: stellarSdk.Networks.TESTNET })
        .addOperation(stellarSdk.Operation.payment({ destination: recieverPublicKey, asset: stellarSdk.Asset.native(), amount: amount}))
        .setTimeout(30)
        .addMemo(stellarSdk.Memo.text('Payment For Thanks!!'))
        .build();
    transaction.sign(senderKeys);
    console.log(transaction.toEnvelope().toXDR('base64'));
    try {
        const transactionResult = await server.submitTransaction(transaction);
        console.log(JSON.stringify(transactionResult, null, 2));
        console.log('\n Success! View the transaction at: ');
        console.log(transactionResult._links.transaction.href);
    } catch (e) {
        console.log('An error has occured:', e);
    }
}

const getTransactions = async()=>{
    const accountId = prompt("Enter account id: ")
    server.transactions().forAccount(accountId).call()
        .then((page)=> {
            const count = page.records.length;
            console.log({ TotalRecords: page.records, TotalCount: count });
        })
        .catch(function (err) {
            console.log(err);
        });
}

console.log("list Of Methods: ",{
    1:"createAccount",
    2:"fundAccount",
    3:"getBalance",
    4:"issueAsset",
    5:"transaction",
    5:"getTransactions"
});

/**
 * Methods Calling By SwitchCase
 */
 let methodName = prompt("Enter method name: ")
 switch(methodName) {
     case "createAccount":
         console.log("createAccount");
         createAccount()
         break;
     case "fundAccount":
         console.log("fundAccount");
         fundAccount();
         break;
     case "getBalance":
         console.log("getBalance");
         getBalance();
         break;
     case "issueAsset":
         console.log("issueAsset");
         issueAsset();
         break;
     case "transaction":
         console.log("transaction");
         transaction();
         break;
    case "getTransactions":
        console.log("getTransactions");
        getTransactions();
        break;
    default:
         console.log("Enter Correct Method Name!!");
   }
