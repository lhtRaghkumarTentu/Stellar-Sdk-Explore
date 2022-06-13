const stellarSdk = require('stellar-sdk');
const prompt = require('prompt-sync')();
const { Asset } = require("stellar-sdk");

/**
 * Creating Instance Of Asset Module
 */
console.log(" :For Making New Instance Of Asset Module, Enter Below Details: ");
const assetCode = prompt("Enter Asset Code: ");
const issuerKey = prompt("Enter Issuer Key: ");
const asset = new stellarSdk.Asset(assetCode,issuerKey);
console.log("Asset Instance Created  SuccessFully, You Can Call Below Functions.");

console.log("list Of Methods: ",{
    1:"getAssetType",
    2:"getCode",
    3:"getIssuer",
    4:"toChangeTrustXDRObject",
    5:"toTrustLineXDRObject",
    6:"toXDRObject",
    7:"isNative",
    8:"equals",
    9:"Compare",
    10:"fromOperation",
    11:"native",
    12:"_toXDRObject",
    13:"getRawAssetType"
  
  });
/**
 * Methods Calling By SwitchCase
 */
 let methodName = prompt("Enter method name: ")
switch(methodName) {
case "getAssetType":
    console.log("Returns the Asset Type for this asset.");
    console.log("AssetType: ", asset.getAssetType());
    break;
case "getCode":
    console.log("Returns the AssetCode for this asset.");
    console.log("Asset Code: ", asset.getCode());
    break;
case "getIssuer":
    console.log("Returns the Issuer for this asset.");
    console.log("Issuer: ", asset.getIssuer());
    break;
case "getIssuer":
    console.log("Returns the Issuer for this asset.");
    console.log("Issuer: ", asset.getIssuer());
    break;
case "toTrustLineXDRObject":
    console.log("Returns the xdr.TrustLineAsset object for this asset.");
    console.log("XDRObject: ", asset.toTrustLineXDRObject());
    break;
case "toChangeTrustXDRObject":
    console.log("Returns the xdr.ChangeTrustAsset object for this asset.");
    console.log("XDRObject: ", asset.toChangeTrustXDRObject());
    break;
case "toXDRObject":
    console.log("Returns the xdr.Asset object for this asset.");
    console.log("XDRObject: ", asset.toXDRObject());
    break;  
case "isNative":
    console.log("Returns true if this asset object is the native asset.");
    console.log("Asset Code: ", asset.isNative());
    break;
case "equals":
    console.log("Returns true if this asset equals the given asset.");
    const assetCode = prompt("Enter Asset Code: ");
    console.log("equals: ", asset.equals(assetCode));
    break;
case "compare":
    console.log("Returns -1 if assetA < assetB, 0 if assetA == assetB, 1 if assetA > assetB.");
    const assetCodeA = prompt("Enter Asset Code A: ");
    const assetCodeB = prompt("Enter Asset Code B: ");
    console.log("Compare: ", Asset.compare(assetCodeA,assetCodeB));
    break;
case "fromOperation":
    console.log("Returns an asset object from its XDR object representation.");
    const xdrAsset = asset.toXDRObject()
    console.log("asset object: ", Asset.fromOperation(xdrAsset));
    break;
case "native":
    console.log("Returns an asset object for the native asset.");
    console.log("Native Asset: ", Asset.native());
    break;
default:
    console.log("Enter Correct Method Name");
}