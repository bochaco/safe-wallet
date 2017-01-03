/*
  Helper functions to store data in the SAFEnet
*/
import { getXorName } from '../common.js';

if (process.env.NODE_ENV !== 'production') {
  require('safe-js/dist/polyfill')
}

let AUTH_TOKEN = null;
let CYPHER_OPTS_SYMMETRIC = null;
let CONFIG_FILENAME = "safe-wallet-config-v0.0.3.json";
let DATA_ID = "safe-wallet-app-data"; // this value is by default, it will be overwritten
                                 // with the value read from the config file
const WALLET_INBOX_PREFIX = "WALLETINBOX-";

const _getHandleId = (res) => {
  return res.hasOwnProperty('handleId') ? res.handleId : res.__parsedResponseBody__.handleId;
}

const _createRandomUserPrefix = () => {
  let randomString = '';
  for (var i = 0; i < 10; i++) {
    // and ten random ascii chars
    randomString += String.fromCharCode(Math.floor(Math.random(100) * 100));
  }
  return btoa(`${(new Date()).getTime()}-${randomString}`);
};

const _readConfigData = () => {
  // TODO: change this to rivate to app with containers
  let isSharedFile = false; /* true == DRIVE, false == APP */
  console.log("Fetching config data from SAFE (", CONFIG_FILENAME, ")...");

  return window.safeNFS.getFile(AUTH_TOKEN, CONFIG_FILENAME, 'json', isSharedFile)
    .then( (res) => {
      console.log("Obtained config file content:", res);
      return res;
    }, (err) => {
      console.log("Failed fetching config file");
      let dataId = _createRandomUserPrefix() + '-' + DATA_ID;
      console.log("Creating config file containing data ID =", dataId);
      let data = JSON.stringify( {'dataId': dataId} );
      return window.safeNFS.createFile(AUTH_TOKEN, CONFIG_FILENAME, data,
        'application/json', data.length, null, isSharedFile)
        .then(() => {
          console.log("Config file created:", data);
          return JSON.parse(data);
        }, (err) => {
          throw Error("Failed creating config file");
        })
    }
  )
}

// Auth functions
export const authoriseApp = (app) => {
  console.log("Authenticating app...");
  return window.safeAuth.authorise(app)
    .then((res) => (AUTH_TOKEN = res.token) )
    .then(() => (console.log("Auth Token retrieved") ))
    .then(() => (window.safeCipherOpts.getHandle(
        AUTH_TOKEN, window.safeCipherOpts.getEncryptionTypes().SYMMETRIC) ))
    .then(_getHandleId)
    .then(handleId => (CYPHER_OPTS_SYMMETRIC = handleId) )
    .then(() => (_readConfigData() ))
    .then(configData => DATA_ID = configData.dataId)
}

export const isTokenValid = () => {
  return window.safeAuth.isTokenValid(AUTH_TOKEN)
    .then( (isValid) => {
      if (!isValid) {
        AUTH_TOKEN = null;
        CYPHER_OPTS_SYMMETRIC = null;
        throw Error("Auth Token is no longer valid");
      }
    });
}

const _createSData = (id, data, cypherOpts) => {
  let dataHandle = null;
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  return window.safeStructuredData.create(AUTH_TOKEN, id, 500, payload, cypherOpts)
    .then(_getHandleId)
    .then(handleId => (dataHandle = handleId))
    .then(() => window.safeStructuredData.put(AUTH_TOKEN, dataHandle))
    .then(() => {
      console.log("New SD saved in the net", dataHandle);
      return dataHandle;
    })
}

const _getSDataHandle = (id) => {
  let dataIdHandle = null;
  return window.safeDataId.getStructuredDataHandle(AUTH_TOKEN, id, 500)
    .then(_getHandleId)
    .then(handleId => (dataIdHandle = handleId))
    .then(() => window.safeStructuredData.getHandle(AUTH_TOKEN, dataIdHandle))
    .then(_getHandleId)
    .then(handleId => {
      window.safeDataId.dropHandle(AUTH_TOKEN, dataIdHandle);
      return handleId;
    })
}

const _fetchSDataHandle = (id, cypherOpts) => {
  return _getSDataHandle(id)
    .then( (handleId) => {
      return handleId;
    }, (err) => {
      // it doesn't exist yet, so let's create the SD
      console.log("SD doesn't exist yet:", err);
      return _createSData(id, [], cypherOpts)
        .then( (handleId) => {
          console.log("SD just created:", handleId);
          return handleId;
        })
    })
}

const _loadData = (dataId, cypherOpts) => {
  return _fetchSDataHandle(dataId, cypherOpts)
    .then((handleId) => {
      // let's try to read the data now!
      console.log("Reading the data...");
      return window.safeStructuredData.readData(AUTH_TOKEN, handleId, '')
        .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
        .then((parsedData) => {
          console.log("Data successfully retrieved");
          return parsedData;
        }, (err) => {
          console.error("Error reading data:", err);
        })

    }, (err) => {
      console.error("Failed loading data:", err);
    })
}

const _loadExistingData = (dataId) => {
  return _getSDataHandle(dataId)
    .then((handleId) => {
      // let's try to read the data now!
      console.log("Reading existing SD...");
      return window.safeStructuredData.readData(AUTH_TOKEN, handleId, '')
        .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
        .then((parsedData) => {
          console.log("Data successfully retrieved");
          return parsedData;
        }, (err) => {
          console.error("Error reading data:", err);
        })

    }, (err) => {
      console.error("Failed loading data:", err);
    })
}

// App data management functions
export const loadAppData = () => {
  return _loadData(DATA_ID, CYPHER_OPTS_SYMMETRIC)
}

export const saveAppData = (data) => {
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  console.log("Saving app data in the network...");

  return _fetchSDataHandle(DATA_ID, CYPHER_OPTS_SYMMETRIC)
    .then((handleId) => {
      // let's try to save the data now!
      return window.safeStructuredData.updateData(AUTH_TOKEN, handleId, payload, CYPHER_OPTS_SYMMETRIC)
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, handleId))
        .then(() => {
          console.log("App data saved in the network successfully");
          return data;
        }, (err) => {
          console.error("Error when updating app data:", err);
        })

    }, (err) => {
      console.error("Failed loading app data:", err);
    })
}

// Wallet management functions
export const loadWalletData = (pk) => {
  let dataId = getXorName(pk);
  console.log("Reading the coin wallet info...", pk, dataId);
  return _loadData(dataId, CYPHER_OPTS_SYMMETRIC);
}

export const createWallet = (pk) => {
  let dataId = getXorName(pk);
  console.log("Creating the coin wallet...", pk, dataId);
  return _fetchSDataHandle(dataId, CYPHER_OPTS_SYMMETRIC)
    .then((handleId) => {
      console.log("Wallet created successfully");
      return handleId
    }, (err) => {
      console.error("Failed creating coin wallet:", err);
    })
}

export const saveWalletData = (pk, data) => {
  const payload = new Buffer(JSON.stringify(data)).toString('base64');
  let dataId = getXorName(pk);

  console.log("Saving coin wallet data in the network...");

  return _getSDataHandle(dataId)
    .then((handleId) => {
      // let's try to save the data now!
      return window.safeStructuredData.updateData(AUTH_TOKEN, handleId, payload, CYPHER_OPTS_SYMMETRIC)
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, handleId))
        .then(() => {
          console.log("Coin wallet data saved in the network successfully");
          return data;
        }, (err) => {
          console.error("Error when updating coin wallet data:", err);
        })

    }, (err) => {
      console.error("Failed loading coin wallet data:", err);
    })
}

/*export const deleteWallet = (pk) => {
  let dataId = getXorName(pk);
  console.log("Deleting coin wallet...", dataId);
  return _getSDataHandle(dataId)
    .then( (handleId) => {
      console.log("Data handle fetched:", handleId);
      window.safeStructuredData.del(AUTH_TOKEN, handleId)
        .then(res => console.log("Coin wallet deleted"));
      })
}*/

export const checkOwnership = (coinId, pk) => {
  console.log("Reading coin info...", pk, coinId);
  return _loadExistingData(coinId)
    .then(data => {
      console.log("Coin data:", data);
      if (data.owner !== pk) {
        throw Error ("Ownership doesn't match", pk, data);
      }
      return data;
    })
}

const _transferOwnership = (coinId, pk, recipient) => {
  let _coinData, _handleId;
  return checkOwnership(coinId, pk)
    .then(data => _coinData = data)
    .then(() => _coinData.owner = recipient)
    .then(() => _coinData.prev_owner = pk)
    .then(() => console.log("Updated coin:", _coinData))
    .then(() => _getSDataHandle(coinId))
    .then((handleId) => _handleId = handleId)
    .then(() => _coinData = new Buffer(JSON.stringify(_coinData)).toString('base64'))
    .then(() => window.safeStructuredData.updateData(AUTH_TOKEN, _handleId, _coinData, null))
    .then(() => window.safeStructuredData.post(AUTH_TOKEN, _handleId))
    .then(() => {
      console.log("Coin's ownership transferred in the network successfully");
      return _coinData;
    }, (err) => {
      console.error("Error when transferring coin's ownership:", err);
    })
}

export const readTxInboxData = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Reading TX inbox...", dataId);
  return _loadData(dataId, null);
}

export const emptyTxInbox = (pk) => {
  const payload = new Buffer(JSON.stringify([])).toString('base64');
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);

  console.log("Emptying Tx inbox in the network...");

  return _getSDataHandle(dataId)
    .then((handleId) => {
      // let's try to save the data now!
      return window.safeStructuredData.updateData(AUTH_TOKEN, handleId, payload, null)
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, handleId))
        .then(() => {
          console.log("Tx inbox emptied in the network successfully");
          return dataId;
        }, (err) => {
          console.error("Error when emptying the Tx inbox:", err);
        })

    }, (err) => {
      console.error("Failed loading Tx inbox:", err);
    })
}

// Tx Inbox management functions
export const createTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Creating the TX inbox...", dataId);
  return _fetchSDataHandle(dataId, null)
    .then((handleId) => {
      emptyTxInbox(pk);
      return handleId
    }, (err) => {
      console.error("Failed creating TX inbox:", err);
    })
}

export const appendTx2TxInbox = (recipient, tx) => {
  console.log("Sending TX to recipient's inbox in the network...");

  return readTxInboxData(recipient)
    .then((inbox) => {
      // let's try to save the data now!
      let recipientInbox = getXorName(WALLET_INBOX_PREFIX + recipient);
      if (inbox) {
        inbox.push(tx);
      } else {
        inbox = [tx];
      }
      const payload = new Buffer(JSON.stringify(inbox)).toString('base64');
      let _handleId;
      return _getSDataHandle(recipientInbox)
        .then((handleId) => _handleId = handleId)
        .then(() => window.safeStructuredData.updateData(AUTH_TOKEN, _handleId, payload, null))
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, _handleId))
        .then(() => {
          console.log("TX inbox updated in the network successfully");
          return tx;
        }, (err) => {
          console.error("Error when updating TX inbox:", err);
        })
    })
}

/*export const deleteTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Deleting TX inbox...", dataId);
  return _getSDataHandle(dataId)
    .then( (handleId) => {
      console.log("Data handle fetched:", handleId);
      window.safeStructuredData.del(AUTH_TOKEN, handleId)
        .then(res => console.log("Inbox deleted"));
      })
}*/

export const transferCoin = (coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in the network...", coinId, recipient);

  return _transferOwnership(coinId, pk, recipient)
      .then((coinData) => {return coinId})
}
