const stellarSdk = require('stellar-sdk');
const prompt = require("prompt-sync")();

/**
 * This Server Module handles the network connection to a [Horizon]
 * We can Establish Connection to Stellar Through Server Module
 */
console.log(" :For Making New Instance Of Server Module, Enter Below Details: ");
const horizonTestnetUrl = prompt("Enter horizonTestnetUrl: ");
// const horizonTestnetUrl = "https://horizon-testnet.stellar.org";
// const horizonPublicnetUrl = "https://horizon.stellar.org";
const options = { allowHttp: false, appName: "myApp", appVersion: 1.0 }
const server = new stellarSdk.Server(horizonTestnetUrl,options)

/**
 *  @method server.fetchBaseFee()
 *  @returns {Promise<number>} Promise that resolves to the base fee.
 *  Example Below
 */
const fetchBaseFee = async()=>{
    const fee = await server.fetchBaseFee();
    console.log(fee);
}

/**
 *  @method server.fetchTimebounds()
 *  @argument {number} seconds Number of seconds past the current time to wait.
 *  @argument {bool} [_isRetry=false] True if this is a retry. Only set this internally!
 *  @returns {Promise<Timebounds>} Promise that resolves a `timebounds` object
 *  Example Below
 */
const fetchTimeBounds = async()=>{
    const fee = await server.fetchTimebounds(20,false);
    console.log(fee);
}

/**
 *  @method server.feeStats()
 *  Fetch the fee stats endpoint.
 *  @returns {Promise<Horizon.FeeStatsResponse>} Promise that resolves to the fee stats returned by Horizon.
 *  Example Below
 */
const fetchFeeStats = async()=>{
    const feeStats = await server.feeStats()
    console.log("feeStats: ",feeStats);
}

/**
 *  @method server.submitTransaction
 *  By This Method We Can Submit Transaction
 *  @param {transaction|FeeBumpTransaction} transaction - The transaction to submit.
 *  @param {object} [opts] Options object
 *  @param {boolean} [opts.skipMemoRequiredCheck] - Allow skipping memo
 *  @returns {Promise} Promise that resolves or rejects with response from horizon.
 *  Example Below
 */
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
/**
 * @method server.accounts()
 * @returns {AccountCallBuilder} New {@link AccountCallBuilder} object configured by a current Horizon server configuration
 * Example Below
 */
const accounts = ()=>{
    const accounts = server.accounts()
    console.log(accounts);
}
/**
 * @method server.claimableBalances()
 * @returns {ClaimableBalanceCallBuilder} New {@link ClaimableBalanceCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
 const claimableBalances = ()=>{
    const claimableBalances = server.claimableBalances()
    console.log(claimableBalances);
}

/**
 * @method server.ledgers()
 * @returns {LedgerCallBuilder} New {@link LedgerCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
 const getLedgers = ()=>{
    const ledgers = server.ledgers()
    console.log(ledgers);
}

/**
 * @method server.transactions()
 * @returns {TransactionCallBuilder} New {@link TransactionCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
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

/**
 * @method server.offers()
 * @returns {OfferCallBuilder} New {@link OfferCallBuilder} object
 * Example Below
 */
 const getOffers = async()=>{
    const accountId = prompt("Enter account id: ")
    server.offers()
     .forAccount(accountId).call()
     .then((offers)=> {
      console.log(offers);
     });
}

/**
 * @method server.orderbook()
 * @param {Asset} selling Asset being sold
 * @param {Asset} buying Asset being bought
 * @returns {OrderbookCallBuilder} New {@link OrderbookCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
 const orderBook = async()=>{
    server.orderbook(
        stellarSdk.Asset.native(),
        new stellarSdk.Asset( 'USD','GCLUN2MHLQAKPY7GS7VGHUXQZYN75M4L3W5FEG3O65THBESYVV3DQ6D4')
      )
      .call()
      .then((response)=> {
        console.log(response);
      })
      .catch((err)=> {
        done(err);
      });
}

/**
 * @method server.trades()
 * @returns {TradesCallBuilder} New {@link TradesCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
 const trades = async()=>{
    server.trades()
        .call()
        .then((response)=> {
        console.log(response);
        })
        .catch((err)=> {
        done(err);
        });
}

/**
 * @method server.operations()
 * @returns {OperationCallBuilder} New {@link OperationCallBuilder} object configured by a current Horizon server configuration.
 * Example Below
 */
 const operations = async()=>{
    const accountId = prompt("Enter account id: ")
    server.operations()
        .forAccount(accountId)
        .call()
        .then((response)=> {
        console.log(response);
        })
        .catch((err)=> {
        done(err);
        });
}

/**
 * @method server.liquidityPools()
 * @returns {LiquidityPoolCallBuilder} New {@link LiquidityPoolCallBuilder} object configured to the current Horizon server settings.
 * Example Below
 */
 const liquidityPools = async()=>{
    const accountId = prompt("Enter account id: ")
    server.liquidityPools(accountId)
        .call()
        .then((response)=> {
        console.log(response);
        })
        .catch((err)=> {
        done(err);
        });
}

/**
 * @method server.strictReceivePaths()
 * @param {string|Asset[]} source The sender's account ID or a list of assets. Any returned path will use a source that the sender can hold.
 * @param {Asset} destinationAsset The destination asset.
 * @param {string} destinationAmount The amount, denominated in the destination asset, that any returned path should be able to satisfy.
 * @returns {StrictReceivePathCallBuilder} New {@link StrictReceivePathCallBuilder} object configured with the current Horizon server configuration.
 * Example Below
 */
const strictReceivePaths = async()=>{
    accountId = prompt("Enter Account id: ")
    server.strictReceivePaths(accountId, new stellarSdk.Asset( 'EUR', accountId), '20.0').call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            done(err);
          });
}

/**
 * @method server.strictSendPaths()
 * @param {Asset} sourceAsset The asset to be sent.
 * @param {string} sourceAmount The amount, denominated in the source asset, that any returned path should be able to satisfy.
 * @param {string|Asset[]} destination The destination account or the destination assets.
 * @returns {StrictSendPathCallBuilder} New {@link StrictSendPathCallBuilder} object configured with the current Horizon server configuration.
 * Example below
 */
 const strictSendPaths = async()=>{
    accountId = prompt("Enter Account id: ")
    server.strictSendPaths( new stellarSdk.Asset('EUR', accountId), '20.0', 'GAEDTJ4PPEFVW5XV2S7LUXBEHNQMX5Q2GM562RJGOQG7GVCE5H3HIB4V')
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            done(err);
          });
}

/**
 *  @method server.payments()
 *  @returns {PaymentCallBuilder} New {@link PaymentCallBuilder} instance configured with the current Horizon server configuration.
 * Example below
 */

 const payments = async()=>{
    accountId = prompt("Enter Account id: ")
    server.payments()
          .forAccount(accountId)
          .call()
          .then((response)=> {
              console.log(response);
          })
          .catch((err)=> {
            console.log(err);
          });
}

/**
 *  @method server.effects()
 *  @returns {EffectCallBuilder} New {@link EffectCallBuilder} instance configured with the current Horizon server configuration.
 *  Example below
 */

 const effects = async()=>{
    accountId = prompt("Enter Account id: ")
    server.effects().forAccount(accountId)
        .call()
        .then((response)=> {
          console.log(response);
        }).catch((err)=> {
          console.log();(err);
        });
}

/**
 *  @method server.friendbot()
 *  @param {string} address The Stellar ID that you want Friendbot to send lumens to
 *  @returns {FriendbotBuilder} New {@link FriendbotBuilder} instance configured with the current Horizon server configuration.
 *  Example below
 */

 const friendbot = async()=>{
    accountId = prompt("Enter Account id: ")
    server.friendbot(accountId)
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            console.log(err.message);
          });
}

/**
 *  @method server.assets()
 *  @returns {AssetsCallBuilder} new {@link AssetsCallBuilder} instance configured with the current Horizon server configuration.
 *  Example below
 */

 const getAssetsByIssuer = async()=>{
    accountId = prompt("Enter Account id: ")
    server.assets()
          .forIssuer(accountId)
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            console.log(err.message);
          });
}
const getAssetsByCode = async()=>{
    assetCode = prompt("Enter Asset Code: ")
    server.assets()
          .forCode(assetCode)
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            console.log(err.message);
          });
}

/**
 *  @method server.loadAccount()
 *  @param {string} accountId - The account to load.
 * @returns {Promise} Returns a promise to the {@link AccountResponse} object with populated sequence number.
 *  Example below
 */

 const loadAccount = async()=>{
    accountId = prompt("Enter Account id: ")
    server.loadAccount(accountId)
        .then((response) => {
          console.log(response);
        })
        .catch((err)=> {
          done(err);
        });
}

/**
 *  @method server.tradeAggregation()
 *  @param {Asset} base base asset
 *  @param {Asset} counter counter asset
 *  @param {long} start_time lower time boundary represented as millis since epoch
 *  @param {long} end_time upper time boundary represented as millis since epoch
 *  @param {long} resolution segment duration as millis since epoch. *Supported values are 5 minutes (300000), 15 minutes (900000), 1 hour (3600000), 1 day (86400000) and 1 week (604800000).
 *  @param {long} offset segments can be offset using this parameter. Expressed in milliseconds. *Can only be used if the resolution is greater than 1 hour. Value must be in whole hours, less than the provided resolution, and less than 24 hours.
 *  Returns new {@link TradeAggregationCallBuilder} object configured with the current Horizon server configuration.
 *  @returns {TradeAggregationCallBuilder} New TradeAggregationCallBuilder instance
 *  Example below
 */
 const tradeAggregation = async()=>{
    accountId = prompt("Enter Account id: ")
    server.tradeAggregation( new stellarSdk.Asset('BTC',"GATEMHCCKCY67ZUCKTROYN24ZYT5GK4EQZ65JJLDHKHRUZI3EUEKMTCH"),stellarSdk.Asset.native(),1512689100000,1512775500000,300000, 0)
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            console.log(err.message);
          });
}

/**
 *  @method server.checkMemoRequired()
 *  @param {Transaction} transaction - The transaction to check.
 *  @returns {Promise<void, Error>} - If any of the destination account
 *  Example below
 */
 const checkMemoRequired = async()=>{
    const transaction = prompt("Enter Account id: ")
    server.checkMemoRequired(transaction)
          .call()
          .then((response)=> {
            console.log(response);
          })
          .catch((err)=> {
            console.log(err.message);
          });
}

console.log("list Of Methods: ",{
  1:"fetchBaseFee",
  2:"fetchTimeBounds",
  3:"feeStats",
  4:"submitTransaction",
  5:"accounts",
  6:"claimableBalances",
  7:"ledgers",
  8:"transactions",
  9:"offers",
  10:"orderbook",
  11:"trades",
  12:"operations",
  13:"strictReceivePaths",
  14:"strictSendPaths",
  15:"payments",
  16:"effects",
  17:"friendbot",
  18:"assetsByIssuer",
  19:"assetsByCode",
  20:"loadAccount",
  21:"tradeAggregation",
  22:"checkMemoRequired"
});

/**
* Methods Calling By SwitchCase
*/
let methodName = prompt("Enter method name: ")
switch(methodName) {
  case "fetchBaseFee":
      console.log("---:fetchBaseFee:---");
      fetchBaseFee();
      break;
  case "fetchTimeBounds":
      console.log("---:fetchTimeBounds:---");
      fetchTimeBounds();
      break;
  case "feeStats":
      console.log("---:feeStats:---");
      feeStats();
      break;
  case "submitTransaction":
      console.log("---:submitTransaction Example Transaction:---");
      submitTransaction();
      break;
  case "accounts":
      console.log("---:accounts:---");
      accounts();
      break;
  case "claimableBalances":
      console.log("---:claimableBalances:---");
      claimableBalances();
      break;
  case "ledgers":
      console.log("---:ledgers Example getLedgers:---");
      getLedgers(); 
      break;   
  case "transactions":
      console.log("---:transactions Example getTransactions :---");
      getTransactions();
      break;
  case "offers":
      console.log("---:offers Example getOffers:---");
      getOffers();
      break;
  case "orderbook":
      console.log("---:orderbook:---");
      orderbook();
      break;
  case "trades":
      console.log("---:trades:---");
      trades();
      break;
  case "operations":
      console.log("---:operations:---");
      operations();
      break;
  case "liquidityPools":
      console.log("---:liquidityPools:---");
      liquidityPools();
      break;
  case "strictReceivePaths":
      console.log("---:strictReceivePaths:---");
      strictReceivePaths(); 
      break;   
  case "strictSendPaths":
      console.log("---:strictSendPaths:---");
      strictSendPaths();
      break;
  case "payments":
      console.log("---:payments:---");
      payments();
      break;
  case "effects":
      console.log("---:effects:---");
      effects();
      break;
  case "friendbot":
      console.log("---:friendbot:---");
      friendbot();
      break;
  case "assetsByIssuer":
      console.log("---:assets Example getAssetsByIssuer:---");
      getAssetsByIssuer();
      break;
  case "assetsByCode":
      console.log("---:assets Example getAssetsByCode:---");
      getAssetsByCode();
      break;
  case "loadAccount":
      console.log("---:loadAccount:---");
      loadAccount();
      break;
  case "tradeAggregation":
      console.log("---:tradeAggregation:---");
      tradeAggregation(); 
      break;   
  case "checkMemoRequired":
      console.log("---:checkMemoRequired:---");
      checkMemoRequired();
      break;
  default:
      console.log("Enter Correct Method Name");
}

