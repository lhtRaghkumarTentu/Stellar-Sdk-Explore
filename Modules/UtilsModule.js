const stellarSdk = require('stellar-sdk');
const prompt = require('prompt-sync')();
const { Utils, Keypair, Networks, Transaction } = require('stellar-sdk');
const crypto = require('crypto');

let serverKP = Keypair.random();
/**
 * @method.buildChallengeTx
 * @param {Keypair} serverKeypair Keypair for server's signing account.
 * @param {string} homeDomain The fully qualified domain name of the service requiring authentication
 * @param {string} clientAccountID The stellar account (G...) or muxed account (M...) that the wallet wishes to authenticate with the server.
 * @param {string} networkPassphrase The network passphrase. If you pass this argument then timeout is required.
 * @param {number} [timeout=300] Challenge duration (default to 5 minutes).
 * @param {string} [memo] The memo to attach to the challenge transaction. The memo must be of type `id`. If the `clientaccountID` is a muxed account, memos cannot be used.
 * @param {string} webAuthDomain The fully qualified domain name of the service issuing the challenge.
 * @param {string} [clientSigningKey] The public key assigned to the SIGNING_KEY attribute specified on the stellar.toml hosted on the client domain. Only necessary when the 'client_domain' parameter is passed.
 * @param {string} [clientDomain] The fully qualified domain of the client requesting the challenge. Only necessary when the the 'client_domain' parameter is passed.
 * @returns {string} A base64 encoded string of the raw TransactionEnvelope xdr struct for the transaction.
 */
const buildChallengeTx = ()=>{
    let clientPublicKey = prompt("EnterClient Public Key: ")
    const challenge = Utils.buildChallengeTx( serverKP, clientPublicKey, "SDF", 300, Networks.TESTNET, "stellartomlorg.herokuapp.com");
    return challenge;
}

/**
 * @method.readChallengeTx
 *  @param {string} challengeTx SEP0010 challenge transaction in base64.
 * @param {string} networkPassphrase The network passphrase, e.g.: 'Test SDF Network ; September 2015'.
 * @param {string} serverAccountID The server's stellar account (public key).
 * @param {string|string[]} [homeDomains] The home domain that is expected to be included in the first Manage Data operation's string key. If an array is provided, one of the domain names in the array must match.
 * @param {string} webAuthDomain The home domain that is expected to be included as the value of the Manage Data operation with the 'web_auth_domain' key. If no such operation is included, this parameter is not used.
 * @returns {Transaction|string|string|string} The actual transaction and the stellar public key (master key) used to sign the Manage Data operation, the matched home domain, and the memo attached to the transaction, which will be null if not present.
 */
const readChallengeTx = ()=>{
    const challenge = buildChallengeTx()
    const Transaction = Utils.readChallengeTx( challenge, serverKP.publicKey(), Networks.TESTNET, "SDF","stellartomlorg.herokuapp.com" )
    console.log(Transaction);
}

/**
 * @method.gatherTxSigners
 *  @param {string} challengeTx SEP0010 challenge transaction in base64.
 * @param {string} serverAccountID The server's stellar account (public key).
 * @param {string} networkPassphrase The network passphrase, e.g.: 'Test SDF Network ; September 2015'.
 * @param {number} threshold The required signatures threshold for verifying this transaction.
 * @param {ServerApi.AccountRecordSigners[]} signerSummary a map of all authorized signers to their weights. It's used to validate if the transaction signatures have met the given threshold.
 * @param {string|string[]} [homeDomains] The home domain(s) that should be included in the first Manage Data operation's string key. Required in verifyChallengeTxSigners() => readChallengeTx().
 * @param {string} webAuthDomain The home domain that is expected to be included as the value of the Manage Data operation with the 'web_auth_domain' key, if present. Used in verifyChallengeTxSigners() => readChallengeTx().
 * @returns {string[]} The list of signers public keys that have signed the transaction, excluding the server account ID, given that the threshold was met.
 */
const verifyChallengeTxThreshold = () =>{
    const clientKP1 = Keypair.random();
    const clientKP2 = Keypair.random();
    const challenge = Utils.buildChallengeTx( serverKP, clientKP1.publicKey(), "SDF", 300, Networks.TESTNET, "stellartomlorg.herokuapp.com" );
    const transaction = new stellarSdk.Transaction( challenge, Networks.TESTNET );
    transaction.sign(clientKP1, clientKP2);
    const signedChallenge = transaction.toEnvelope().toXDR("base64").toString();
    const threshold = 3;
    const signerSummary = [
     {
       key: clientKP1.publicKey(),
       weight: 1,
     },
     {
       key: clientKP2.publicKey(),
       weight: 2,
     },
   ];
   console.log(Utils.verifyChallengeTxThreshold( signedChallenge, serverKP.publicKey(), Networks.TESTNET, threshold, signerSummary, "SDF", "stellartomlorg.herokuapp.com"));
}
/**
 * @method.gatherTxSigners
 *  @param {Transaction} transaction the signed transaction.
 *  @param {string[]} signers The signers public keys.
 *  @returns {string[]} a list of signers that were found to have signed the transaction
 */
const gatherTxSigners = ()=>{
    let keypair1 = Keypair.random();
    let keypair2 = Keypair.random();
    const account = new stellarSdk.Account(keypair1.publicKey(), "-1");
    const transaction = new stellarSdk.TransactionBuilder(account, { fee: 100 }).setNetworkPassphrase(Networks.TESTNET).setTimeout(30).build();
    transaction.sign(keypair1, keypair2)
    console.log(Utils.gatherTxSigners(transaction, [keypair1.publicKey(), keypair2.publicKey()]));
}

/**
 *  @method.verifyTxSignedBy
 *  @param {Transaction} transaction
 *  @param {string} accountID
 *  @returns {boolean}.
 */
const verifyTxSignedBy = () =>{
    const account = new stellarSdk.Account(serverKP.publicKey(), "-1");
    const transaction = new stellarSdk.TransactionBuilder(account, { fee: 100 }).setNetworkPassphrase(Networks.TESTNET).setTimeout(30).build();
    transaction.sign(serverKP)
    console.log(Utils.verifyTxSignedBy(transaction, serverKP.publicKey()));   
}



/**
 * @method.verifyChallengeTxSigners
 *  @param {string} challengeTx SEP0010 challenge transaction in base64.
 * @param {string} serverAccountID The server's stellar account (public key).
 * @param {string} networkPassphrase The network passphrase, e.g.: 'Test SDF Network ; September 2015'.
 * @param {string[]} signers The signers public keys. This list should contain the public keys for all signers that have signed the transaction.
 * @param {string|string[]} [homeDomains] The home domain(s) that should be included in the first Manage Data operation's string key. Required in readChallengeTx().
 * @param {string} webAuthDomain The home domain that is expected to be included as the value of the Manage Data operation with the 'web_auth_domain' key, if present. Used in readChallengeTx().
 * @returns {string[]} The list of signers public keys that have signed the transaction, excluding the server account ID.
 */
const verifyChallengeTxSigners = () =>{
    clientKP1 = Keypair.random();
    clientKP2 = Keypair.random();
    txAccount = new stellarSdk.Account(serverKP.publicKey(), "-1");
    opAccount = new stellarSdk.Account(clientKP1.publicKey(), "0");
    operation = stellarSdk.Operation.manageData({ source: clientKP1.publicKey(), name: "SDF-test auth", value: crypto.randomBytes(48).toString("base64") });
    txBuilderOpts = { fee: 100, networkPassphrase: Networks.TESTNET };
    const challenge = Utils.buildChallengeTx( serverKP, clientKP1.publicKey(), "SDF", 300, Networks.TESTNET,"testanchor.stellar.org" );
    const transaction = new stellarSdk.Transaction( challenge, Networks.TESTNET );
    const clientSigners = [clientKP1, clientKP2];
    transaction.sign(...clientSigners);
    const clientSignersPubKey = clientSigners.map(kp => kp.publicKey());
    const signedChallenge = transaction.toEnvelope().toXDR("base64").toString();
    console.log(Utils.verifyChallengeTxSigners( signedChallenge, serverKP.publicKey(), Networks.TESTNET, clientSignersPubKey, "SDF", "testanchor.stellar.org"));
}

console.log("list Of Methods: ", {
    "1":"buildChallengeTx",
    "2":"gatherTxSigners",
    "3":"readChallengeTx",
    "4":"validateTimeBounds",
    "5":"verifyChallengeTxSigners",
    "6":"verifyChallengeTxThreshold",
    "7":"verifyTxSignedBy"
});

/**
 * Methods Calling By SwitchCase
 */
 let methodName = prompt("Enter method name: ")
switch(methodName) {
case "buildChallengeTx":
    console.log("buildChallengeTx");
    console.log("challenge: ", buildChallengeTx());
    break;
case "gatherTxSigners":
    console.log("gatherTxSigners");
    gatherTxSigners()
    break;
case "readChallengeTx":
    console.log("readChallengeTx");
    readChallengeTx()
    break;
case "verifyChallengeTxSigners":
    console.log("verifyChallengeTxSigners");
    verifyChallengeTxSigners()
    break;
case "verifyChallengeTxThreshold":
    console.log("verifyChallengeTxThreshold");
    verifyChallengeTxThreshold()
    break;
case "verifyTxSignedBy":
    console.log("verifyTxSignedBy");
    verifyTxSignedBy()
    break;  
default:
    console.log("Enter Correct Method Name");
}
