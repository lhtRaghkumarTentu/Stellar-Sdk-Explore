const prompt = require('prompt-sync')();
const { Keypair } = require('stellar-sdk');

console.log("list Of Methods: ", {
    "1":"random",
    "2":"master",
    "3":"publicKey",
    "4":"rawPublicKey",
    "5":"secret",
    "6":"rawSecretKey",
    "7":"fromPublicKey",
    "8":"fromSecret",
    "9":"fromRawEd25519Seed",
    "10":"canSign",
    "11":"sign",
    "12":"signPayloadDecorated",
    "13":"verify",
    "14":"xdrMuxedAccount"
  
  });
// Random
const keyPairObject = Keypair.random();
const data = "<Buffer 7a c3 39 97 54 4e 31 75 d2 66 bd 02 24 39 b2 2c db 16 50 8c 01 16 3f 26 e5 cb 2a 3e 10 45 a9 79>";

/**
 * Methods Calling By SwitchCase
 */
 let methodName = prompt("Enter method name: ")
 switch(methodName) {
    case "random":
        console.log("it Creates a random Keypair object.");
        console.log("KeyPairObject: ", keyPairObject);
        break;
    case "publicKey":
        console.log("Returns public key associated with this Keypair object.");
        console.log("Public Key: ", keyPairObject.publicKey());
        break;
    case "rawPublicKey":
        console.log("Returns raw public key.");
        console.log("Raw Public Key: ", keyPairObject.rawPublicKey());
        break;
    case "secret":
        console.log("Returns secret key associated with this Keypair object.");
        console.log("Secret Key: ", keyPairObject.secret());
        break;
    case "rawSecretKey":
        console.log("Returns raw secret key.");
        console.log("Raw Secret Key: ", keyPairObject.rawSecretKey());
        break;
    case "fromPublicKey":
        console.log("Creates a new Keypair object from public key.");
        const fromPublicKey = prompt("Enter You Public Key: ")
        console.log("Keypair Object: ", Keypair.fromPublicKey(fromPublicKey));
        break;
    case "fromSecret":
        console.log("Creates a new Keypair instance from secret");
        const fromSecretKey = prompt("Enter You Secret Key: ")
        console.log("Keypair Object: ", Keypair.fromSecret(fromSecretKey));
        break;  
    case "fromRawEd25519Seed":
        console.log("Creates a new Keypair object from ed25519 secret key seed raw bytes.");
        const rawSeed = keyPairObject.rawSecretKey();
        console.log("Keypair Object: ", Keypair.fromRawEd25519Seed(rawSeed));
        break;
    case "master":
        console.log("Returns Keypair object representing network master key.");
        const networkPassPharse = prompt("Enter networkPassPharse key: ");
        console.log("Keypair Object: ", Keypair.master(networkPassPharse));
        break;
    case "canSign":
        console.log("Returns true if this Keypair object contains secret key and can sign.");
        console.log("sign: ", keyPairObject.canSign());
        break;
    case "sign":
        console.log("Signs data.");
        console.log("sign: ", keyPairObject.sign(data));
        break;
    case "signPayloadDecorated":
        console.log("Returns the signature hint for a signed payload signer. This is defined as the last 4 bytes of the signer key XORed with last 4 bytes of the payload (zero-left-padded if necessary).");
        console.log("Signature hint: ", keyPairObject.signPayloadDecorated(data));
        break;
    case "verify":
        console.log("Verifies if signature for data is valid.");
        const signatureHint = "<Buffer 10 57 b1 6b>";
        console.log("Verify Status: ", keyPairObject.verify(data, signatureHint));
        break;
    case "xdrMuxedAccount":
        console.log("Creates a xdr.MuxedAccount object from the public key.");
        console.log("xdrMuxedAccount: ", keyPairObject.xdrMuxedAccount());
        break;
    default:
        console.log("Enter Correct Method Name");
    }
