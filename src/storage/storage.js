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
const WALLET_INBOX_PREFIX = "WALLETINBOX-AD-";

const _getHandleId = (res) => {
  return res.hasOwnProperty('handleId') ? res.handleId : res.__parsedResponseBody__.handleId;
}

const _getNumVersions = (res) => {
  return res.hasOwnProperty('dataVersionLength') ? res.dataVersionLength : res.__parsedResponseBody__.dataVersionLength;
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

const _createSData = (id, data, cypherOpts, type_tag = 500) => {
  let dataHandle = null;
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  return window.safeStructuredData.create(AUTH_TOKEN, id, type_tag, payload, cypherOpts)
    .then(_getHandleId)
    .then(handleId => (dataHandle = handleId))
    .then(() => window.safeStructuredData.put(AUTH_TOKEN, dataHandle))
    .then(() => {
      console.log("New SD saved in the net", dataHandle);
      return dataHandle;
    })
}

const _createAData = (id) => {
  let dataHandle = null;

  return window.safeAppendableData.create(AUTH_TOKEN, id, true)
    .then(_getHandleId)
    .then(handleId => (dataHandle = handleId))
    .then(() => window.safeAppendableData.put(AUTH_TOKEN, dataHandle))
    .then(() => window.safeAppendableData.dropHandle(AUTH_TOKEN, dataHandle))
    .then(() => {
      console.log("New AD saved in the net", dataHandle);
      return id;
    })
}

const _getSDataHandle = (id, type_tag = 500) => {
  let dataIdHandle = null;
  return window.safeDataId.getStructuredDataHandle(AUTH_TOKEN, id, type_tag)
    .then(_getHandleId)
    .then(handleId => (dataIdHandle = handleId))
    .then(() => window.safeStructuredData.getHandle(AUTH_TOKEN, dataIdHandle))
    .then(_getHandleId)
    .then(handleId => {
      window.safeDataId.dropHandle(AUTH_TOKEN, dataIdHandle);
      return handleId;
    })
}

const _getADataHandle = (id) => {
  let dataIdHandle = null;
  return window.safeDataId.getAppendableDataHandle(AUTH_TOKEN, id, true)
    .then(_getHandleId)
    .then(handleId => (dataIdHandle = handleId))
    .then(() => window.safeAppendableData.getHandle(AUTH_TOKEN, dataIdHandle))
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

const _fetchADataHandle = (id) => {
  return _getADataHandle(id)
    .then( (handleId) => {
      return handleId;
    }, (err) => {
      // it doesn't exist yet, so let's create the SD
      console.log("AD doesn't exist yet:", err);
      return _createAData(id)
        .then( (handleId) => {
          console.log("AD just created:", handleId);
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

const _loadExistingData = (dataId, type_tag = 500) => {
  return _getSDataHandle(dataId, type_tag)
    .then((handleId) => {
      // let's try to read the data now!
      console.log("Reading existing SD...");
      return window.safeStructuredData.readData(AUTH_TOKEN, handleId, '')
        .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
        .then((parsedData) => {
          console.log("Data successfully retrieved", parsedData);
          return parsedData;
        }, (err) => {
          console.error("Error reading data:", err);
        })

    }, (err) => {
      console.error("Failed loading data:", err);
    })
}

const _loadAData = (dataId) => {
  return _fetchADataHandle(dataId)
    .then((handleId) => {
      // let's try to read the data now!
      return window.safeAppendableData.getMetadata(AUTH_TOKEN, handleId)
        .then((res) => {
          return res;
        }, (err) => {
          throw Error("Error reading metadata:", err);
        })

    }, (err) => {
      console.error("Failed loading AD:", err);
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
          throw Error("Error when updating coin wallet data:", err);
        })

    }, (err) => {
      throw Error("Failed loading coin wallet data:", err);
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

const _getEncryptionHandle = (handleId) => {
  let _cypherOptsAssymmetric, _encryptKey;
  return window.safeAppendableData.getEncryptKey(AUTH_TOKEN, handleId)
    .then(_getHandleId)
    .then((encryptKey) => _encryptKey = encryptKey)
    .then(() => (window.safeCipherOpts.getHandle(
        AUTH_TOKEN, window.safeCipherOpts.getEncryptionTypes().ASYMMETRIC, _encryptKey) ))
    .then(_getHandleId)
    .then(handleId => _cypherOptsAssymmetric = handleId )
    .then(() => window.safeAppendableData.dropEncryptKeyHandle(AUTH_TOKEN, _encryptKey))
    .then(() => {
      return _cypherOptsAssymmetric;
    })
}

const _transferOwnership = (coinId, pk, recipient) => {
  let recipientInboxId = getXorName(WALLET_INBOX_PREFIX + recipient);
  let _coinData, _handleId;
  let _recipientHandleId, _cypherOptsAssymmetric;
  return checkOwnership(coinId, pk)
    .then(data => _coinData = data)
    .then(() => _coinData.prev_owner = _coinData.owner)
    .then(() => _coinData.owner = recipient)
    .then(() => console.log("Updated coin:", _coinData))
    .then(() => _getSDataHandle(coinId))
    .then((handleId) => _handleId = handleId)
    .then(() => _coinData = new Buffer(JSON.stringify(_coinData)).toString('base64'))
    .then(() => _getADataHandle(recipientInboxId))
    .then((handleId) => _recipientHandleId = handleId)
    .then(() => _getEncryptionHandle(_recipientHandleId))
    .then(encryptHandle => _cypherOptsAssymmetric = encryptHandle)
    .then(() => window.safeStructuredData.updateData(AUTH_TOKEN, _handleId, _coinData, _cypherOptsAssymmetric))
    .then(() => window.safeStructuredData.post(AUTH_TOKEN, _handleId))
    .then(() => {
      console.log("Coin's ownership transferred in the network successfully");
      window.safeAppendableData.dropHandle(AUTH_TOKEN, _recipientHandleId);
      return _coinData;
    }, (err) => {
      throw Error("Error when transferring coin's ownership:", err);
    })
}

/*const _transferOwnership = (coinId, pk, recipient) => {
  let recipientInboxId = getXorName(WALLET_INBOX_PREFIX + recipient);
  let _nextVersion, _coinData, _dataIdHandle, _coinHandleId, _recipientHandleId, _cypherOptsAssymmetric;
  return checkOwnership(coinId, pk)
    .then(data => _coinData = data)
    .then(() => _coinData.prev_owner = _coinData.owner)
    .then(() => _coinData.owner = recipient)
    .then(() => console.log("Updated coin:", _coinData))
    .then(() => _coinData = new Buffer(JSON.stringify(_coinData)).toString('base64'))
    .then(() => window.safeDataId.getStructuredDataHandle(AUTH_TOKEN, coinId, 501))
    .then(_getHandleId)
    .then(handleId => (_dataIdHandle = handleId))
    .then(() => window.safeStructuredData.getHandle(AUTH_TOKEN, _dataIdHandle))
    .then(_getNumVersions)
    .then((dataVersionLength) => _nextVersion = dataVersionLength)
    .then(() => console.log("GOOD!, next version is:", _nextVersion))
    .then(() => _getADataHandle(recipientInboxId))
    .then((handleId) => _recipientHandleId = handleId)
    .then(() => _getEncryptionHandle(_recipientHandleId))
    .then(encryptHandle => _cypherOptsAssymmetric = encryptHandle)
    .then(() => _createSData(coinId, _coinData, _cypherOptsAssymmetric, _nextVersion))
    .then((handleId) => {
      console.log("Coin's ownership transferred in the network successfully");
      window.safeStructuredData.dropHandle(AUTH_TOKEN, handleId);
      window.safeDataId.dropHandle(AUTH_TOKEN, _dataIdHandle);
      window.safeAppendableData.dropHandle(AUTH_TOKEN, _recipientHandleId);
      return _coinData;
    }, (err) => {
      throw Error("Error when transferring coin's ownership:", err);
    })
}*/

// Tx Inbox management functions
export const readTxInboxData = (pk, index) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  if (index === null) {
    return _loadAData(dataId);
  } else {
    let _handleId, _txHandleId, _readerHandle, _txInfo;
    return _getADataHandle(dataId)
      .then((handleId) => _handleId = handleId)
      .then(() => window.safeAppendableData.getDataIdAt(AUTH_TOKEN, _handleId, index))
      .then(_getHandleId)
      .then((handleId) => _txHandleId = handleId)
      .then(() => window.safeImmutableData.getReaderHandle(AUTH_TOKEN, _txHandleId))
      .then(_getHandleId)
      .then((handleId) => _readerHandle = handleId)
      .then(() => window.safeImmutableData.read(AUTH_TOKEN, _readerHandle))
      .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
      .then((parsedData) => _txInfo = parsedData)
      .then(() => window.safeImmutableData.dropReader(AUTH_TOKEN, _readerHandle))
      .then(() => window.safeAppendableData.removeAt(AUTH_TOKEN, _handleId, index))
      .then(() => window.safeAppendableData.post(AUTH_TOKEN, _handleId))
      .then(() => window.safeAppendableData.dropHandle(AUTH_TOKEN, _handleId))
      .then(() => {
        return _txInfo;
      })
  }
}

export const createTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Creating TX inbox...", dataId);
  return _createAData(dataId)
    .then((id) => {
      return id
    }, (err) => {
      console.error("Failed creating TX inbox:", err);
    })
}

const _appendToTxInbox = (id, content) => {
  let _handleId, _cypherOptsAssymmetric, _immHandleId, _immToAppendHandleId;
  return _getADataHandle(id)
    .then((handleId) => _handleId = handleId)
    .then(() => _getEncryptionHandle(_handleId))
    .then(encryptHandle => _cypherOptsAssymmetric = encryptHandle)
    .then(() => window.safeImmutableData.getWriterHandle(AUTH_TOKEN))
    .then(_getHandleId)
    .then(handleId => _immHandleId = handleId)
    .then(() => window.safeImmutableData.write(AUTH_TOKEN, _immHandleId, content))
    .then(() => window.safeImmutableData.closeWriter(AUTH_TOKEN, _immHandleId, _cypherOptsAssymmetric))
    .then(_getHandleId)
    .then(handleId => _immToAppendHandleId = handleId)
    .then(() => window.safeImmutableData.dropWriter(AUTH_TOKEN, _immHandleId))
    .then(() => window.safeAppendableData.append(AUTH_TOKEN, _handleId, _immToAppendHandleId))
    .then(() => window.safeAppendableData.dropHandle(AUTH_TOKEN, _handleId))
}

export const sendTxNotif = (pk, coinIds, msg) => {
  let txInboxId = getXorName(WALLET_INBOX_PREFIX + pk);
  let data = {
    coinIds: coinIds,
    msg: msg,
    date: (new Date()).toUTCString()
  }
  const txNotif = new Uint8Array(new Buffer(JSON.stringify(data)));

  console.log("Saving TX inbox data in the network...");
  return _appendToTxInbox(txInboxId, txNotif)
    .then(() => console.log("TX notification sent"))
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
