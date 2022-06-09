const prompt = require('prompt-sync')();
const { Config } = require('stellar-sdk');

console.log("list Of Methods: ",{
    1:"isAllowHttp",
    2:"setAllowHttp",
    3:"getTimeOut",
    4:"setTimeOut",
    5:"setDefault"
});

/**
 * Methods Calling By SwitchCase
 */
let methodName = prompt("Enter method name: ")
switch(methodName) {
    case "isAllowHttp":
        console.log("isAllowHttp: ", Config.isAllowHttp());
        break;
    case "setAllowHttp":
        const httpStatus = prompt("Enter boolean Value: ")
        Config.setAllowHttp(httpStatus)
        console.log(`Allow Http Status Set To ${httpStatus}`);
        break;
    case "getTimeOut":
        console.log("TimeOut: ", Config.getTimeout());
        break;
    case "setTimeOut":
        const timeOut = prompt("Enter timeOut Duration: ")
        Config.setTimeout();
        console.log(`TimeOut Set To ${timeOut} seconds`);
        break;
    case "setDefault":
        Config.setDefault();
        console.log("All Values Set To Default!!");
        break;
    default:
        console.log("Enter Correct Method Name!!");
  }