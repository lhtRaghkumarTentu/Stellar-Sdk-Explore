const stellarSdk = require('stellar-sdk');
const prompt = require('prompt-sync')();


/**
 * Creating Instance Of Account
 */
console.log(" :For Making New Instance Of Account Module, Enter Below Details: ");
const accountId = prompt("Enter Account Id: ");
const sequenceNumber = prompt("Enter Sequence Number: ")
const account = new stellarSdk.Account(accountId,sequenceNumber);
console.log("Account Details",account);

console.log("list Of Methods: ",{
    1:"getAccountId",
    2:"getSequenceNumber",
    3:"incrementSequenceNumber"
});

/**
 * Methods Calling By SwitchCase
 */
let methodName = prompt("Enter method name: ")
switch(methodName) {
    case "getAccountId":
        console.log("AccountId: ", account.accountId());
      break;
    case "getSequenceNumber":
        console.log("Sequence Number: ", account.sequenceNumber());
      break;
    case "incrementSequenceNumber":
        account.incrementSequenceNumber();
    default:
        console.log("Account Details: ", account);
}




























































































/**
 * Methods Calling By Loop
 */
// let i = 0;
// while (i < 3) {
//     console.log("Account Details: ", account);
//     i++;
//     console.log("AccountId: ", account.accountId());
//     i++;
//     console.log("Sequence Number: ", account.sequenceNumber());
//     i++
//     account.incrementSequenceNumber();
//     i++
// }
