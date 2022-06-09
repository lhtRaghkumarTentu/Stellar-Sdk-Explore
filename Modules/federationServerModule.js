const stellarSdk = require('stellar-sdk');
const prompt = require("prompt-sync")();

/**
 * Creating Instance Of Federation Server Module
 */
console.log(" :For Making New Instance Of Federation Server Module, Enter Below Details: ");
const serverURL = prompt("Enter server URL: ");
const domain = prompt("Enter Your Domain: ")
// const server = "https://acme.com:1337/federation";
// const domain = "stellar.org";
const options = { allowHttp: true, timeout: 10000 }
const federationServer = new stellarSdk.FederationServer(serverURL,domain,options);

/**
 *  @method federationServer.resolveAddress()
 *  @param {string} address Stellar address (ex. `bob*stellar.org`). If `FederationServer` was instantiated with `domain` param only username (ex. `bob`) can be passed.
 *  @returns {Promise} Promise that resolves to the federation record
 *  Example below
 */
 const resolveAddress = async()=>{
    const Address = prompt("Enter Address (Example like username*domain.com): ")
    await federationServer.resolveAddress(Address)
        .then((response) => {
            console.log(response);
        })
    .catch((err)=> {
      console.log(err.message);
    });
}

/**
 *  @method federationServer.resolveAccountId()
 *  @param {string} accountId Account ID (ex. `GBYNR2QJXLBCBTRN44MRORCMI4YO7FZPFBCNOKTOBCAAFC7KC3LNPRYS`)
 * @returns {Promise} A promise that resolves to the federation record
 *  Example below
 */
 const resolveAccountId = async()=>{
    const accountId = prompt("Enter Account id: ")
    await federationServer.resolveAccountId(accountId)
      .then((response) => {
        console.log(response);
      })
      .catch((err)=> {
        console.log(err.message);
      });
}

/**
 *  @method federationServer.resolveTransactionId()
 *  @param {string} accountId Account ID (ex. `GBYNR2QJXLBCBTRN44MRORCMI4YO7FZPFBCNOKTOBCAAFC7KC3LNPRYS`)
 * @returns {Promise} A promise that resolves to the federation record
 *  Example below
 */
 const resolveTransactionId = async()=>{
    const transactionId = prompt("Enter Transaction id: ")
    await federationServer.resolveTransactionId(transactionId)
      .then((response) => {
        console.log(response);
      })
      .catch((err)=> {
        console.log(err.message);
      });
}

console.log("list Of Methods: ",{
    1:"resolveAddress",
    2:"resolveAccountId",
    3:"resolveTransactionId"
});

/**
 * Methods Calling By SwitchCase
 */
let methodName = prompt("Enter method name: ")
switch(methodName) {
    case "resolveAddress":
        console.log("---:resolveAddress:---");
        resolveAddress();
      break;
    case "resolveAccountId":
        console.log("---:resolveAccountId:---");
        resolveAccountId();
      break;
    case "resolveTransactionId":
        console.log("---:resolveTransactionId:---");
        resolveTransactionId();
    default:
        console.log("Enter Correct Method Name");
  }
