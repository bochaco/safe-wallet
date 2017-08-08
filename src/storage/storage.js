/*
  Helper functions to store data in the SAFEnet
*/
import crypto from 'crypto';
//import { getXorName } from '../common.js';

//if (process.env.NODE_ENV !== 'production') {
//  require('safe_app_web_api');
//}

const ENTRY_KEY_CONFIG = 'safe-wallet-app-config';
const TAG_TYPE_DATA = 17112016;
const CONFIG_KEY_APP_DATA = 'appData';
const CONFIG_KEY_VERSION = 'version';
const CONFIG_KEY_PREFERRED_LANG = 'preferredLang';
//const WALLET_INBOX_PREFIX = "WALLETINBOX-AD-";

let APP_HANDLE = null;
let DATA_HANDLE = null;

const _readConfigData = () => {
  console.log("Fetching config data from app's home container...");
  return window.safeApp.getHomeContainer(APP_HANDLE)
    .then((homeContainer) => window.safeMutableData.encryptKey(homeContainer, ENTRY_KEY_CONFIG)
      .then((encKey) => window.safeMutableData.get(homeContainer, encKey)
        .then((encValue) => window.safeMutableData.decrypt(homeContainer, encValue.buf))
        .then((decrypted) => { return JSON.parse(decrypted); })
      .catch((err) => {
        // FIXME: Check if ERR_NO_SUCH_ENTRY
        //if (err.code !== -106) {
        //  console.log("Failed fetching config data: ", err);
        //  throw err;
        //}
        console.log("Generating config data...");
        let storedConfig = {
          [CONFIG_KEY_VERSION]: '0.0.10',
          [CONFIG_KEY_PREFERRED_LANG]: 'en'
        };
        return window.safeMutableData.newRandomPrivate(APP_HANDLE, TAG_TYPE_DATA)
          .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, {}))
          .then((mdHandle) => window.safeMutableData.serialise(mdHandle))
          .then((serialised) => {
            storedConfig[CONFIG_KEY_APP_DATA] = serialised;
            console.log("Config data generated:", storedConfig);
            return window.safeMutableData.newMutation(APP_HANDLE)
              .then((mutHandle) => window.safeMutableData.encryptKey(homeContainer, ENTRY_KEY_CONFIG)
                .then((encKey) => window.safeMutableData.encryptValue(homeContainer, JSON.stringify(storedConfig))
                  .then((encValue) => window.safeMutableDataMutation.insert(mutHandle, encKey, encValue))
                )
                .then(() => window.safeMutableData.applyEntriesMutation(homeContainer, mutHandle))
                .then(() => window.safeMutableDataMutation.free(mutHandle))
              )
              .then(() => {
                console.log("Config data stored in app's home container")
                window.safeMutableData.free(homeContainer);
                return storedConfig;
              })
          }, (err) => {
            throw Error("Failed generating config data");
          });
      })))
    .then((storedConfig) => window.safeMutableData.fromSerial(APP_HANDLE, storedConfig[CONFIG_KEY_APP_DATA])
      .then((dataMdHandle) => {
        DATA_HANDLE = dataMdHandle;
        return storedConfig;
      }));
}

// Auth & connection functions
export const connectApp = (app, permissions, networkStateCb) => {
  console.log("Authorising app...");
  return window.safeApp.initialise(app, networkStateCb)
    .then((res) => (APP_HANDLE = res) )
    .then(() => (console.log("App handle retrieved ", APP_HANDLE) ))
    .then(() => window.safeApp.authorise(APP_HANDLE, permissions, {own_container: true}))
    .then((authUri) => window.safeApp.connectAuthorised(APP_HANDLE, authUri))
    .then(() => window.safeApp.refreshContainersPermissions(APP_HANDLE))
    .then(() => (console.log("App connected")))
    .then(() => _readConfigData())
    .then((configData) => configData.preferredLang);
}

export const disconnectApp = () => {
  console.log("Disconnecting...");
  window.safeMutableData.free(DATA_HANDLE);
  DATA_HANDLE = null;
  window.safeApp.free(APP_HANDLE);
  APP_HANDLE = null;
}

const _decryptEntries = (rawEntries) => {
  let data = {};
  return Promise.all(rawEntries.map((entry) => {
      if (entry.value.buf.length === 0) { //FIXME: this condition is a work around for a limitation in safe_core
        return Promise.resolve();
      }

      return window.safeMutableData.decrypt(DATA_HANDLE, entry.key)
        .then((decKey) => window.safeMutableData.decrypt(DATA_HANDLE, entry.value.buf)
          .then((decValue) => {
            let item = {
              id: decKey.toString(),
              version: entry.value.version,
              content: JSON.parse(decValue.toString())
            }
            console.log("ITEM READ:", item);
            data[item.id] = item;
          }));
    }))
    .then(() => data);
}

// App data management functions
export const loadAppData = () => {
  let rawEntries = [];
  return window.safeMutableData.getEntries(DATA_HANDLE)
    .then((entriesHandle) => window.safeMutableDataEntries.forEach(entriesHandle, (key, value) => {
        rawEntries.push({key, value});
      })
      .then(() => {
        window.safeMutableDataEntries.free(entriesHandle);
        return _decryptEntries(rawEntries);
      })
    )
    .then((data) => {
      console.log('Finished reading data: ', data);
      return data;
    });
}

export const saveAppItem = (item) => {
  console.log("Saving app data in the network...");
  let version = 0;
  let id = item.id;
  if (!item.id) {
    id = crypto.randomBytes(16).toString('hex');
  } else {
    version = item.version + 1;
  }

  return window.safeMutableData.newMutation(APP_HANDLE)
    .then((mutHandle) => window.safeMutableData.encryptKey(DATA_HANDLE, id)
      .then((encKey) => window.safeMutableData.encryptValue(DATA_HANDLE, JSON.stringify(item.content))
        .then((encValue) => {
          if (item.id) {
            console.log("Updating item...");
            return window.safeMutableDataMutation.update(mutHandle, encKey, encValue, version);
          } else {
            console.log("Inserting item...");
            return window.safeMutableDataMutation.insert(mutHandle, encKey, encValue);
          }
        })
      )
      .then(() => window.safeMutableData.applyEntriesMutation(DATA_HANDLE, mutHandle))
      .then(() => window.safeMutableDataMutation.free(mutHandle))
    )
    .then(() => {
      console.log("App item saved in the network successfully");
      item.id = id;
      item.version = version;
      return item;
    });
}

export const deleteAppItem = (item) => {
  console.log("Removing item in the network...");
  console.log("REMOVING:", item.version)
  return window.safeMutableData.newMutation(APP_HANDLE)
    .then((mutHandle) => window.safeMutableData.encryptKey(DATA_HANDLE, item.id)
      .then((encKey) => window.safeMutableDataMutation.remove(mutHandle, encKey, item.version + 1))
      .then(() => window.safeMutableData.applyEntriesMutation(DATA_HANDLE, mutHandle))
      .then(() => window.safeMutableDataMutation.free(mutHandle))
    )
    .then(() => {
      console.log("App item removed from the network successfully");
      return;
    });
}

/*
const _createRandomUserPrefix = () => {
  let randomString = '';
  for (var i = 0; i < 10; i++) {
    // and ten random ascii chars
    randomString += String.fromCharCode(Math.floor(Math.random(100) * 100));
  }
  return btoa(`${(new Date()).getTime()}-${randomString}`);
};

/*
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
      return window.safeStructuredData.updateData(APP_HANDLE, handleId, payload, CYPHER_OPTS_SYMMETRIC)
        .then(() => window.safeStructuredData.post(APP_HANDLE, handleId))
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
*/
/*export const deleteWallet = (pk) => {
  let dataId = getXorName(pk);
  console.log("Deleting coin wallet...", dataId);
  return _getSDataHandle(dataId)
    .then( (handleId) => {
      console.log("Data handle fetched:", handleId);
      window.safeStructuredData.del(APP_HANDLE, handleId)
        .then(res => console.log("Coin wallet deleted"));
      })
}*/
/*
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
    .then(() => window.safeStructuredData.updateData(APP_HANDLE, _handleId, _coinData, _cypherOptsAssymmetric))
    .then(() => window.safeStructuredData.post(APP_HANDLE, _handleId))
    .then(() => {
      console.log("Coin's ownership transferred in the network successfully");
      window.safeAppendableData.dropHandle(APP_HANDLE, _recipientHandleId);
      return _coinData;
    }, (err) => {
      throw Error("Error when transferring coin's ownership:", err);
    })
}
*/
/*
// Tx Inbox management functions
export const readTxInboxData = (pk, index) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  if (index === null) {
    return _loadAData(dataId);
  } else {
    let _handleId, _txHandleId, _readerHandle, _txInfo;
    return _getADataHandle(dataId)
      .then((handleId) => _handleId = handleId)
      .then(() => window.safeAppendableData.getDataIdAt(APP_HANDLE, _handleId, index))
      .then(_getHandleId)
      .then((handleId) => _txHandleId = handleId)
      .then(() => window.safeImmutableData.getReaderHandle(APP_HANDLE, _txHandleId))
      .then(_getHandleId)
      .then((handleId) => _readerHandle = handleId)
      .then(() => window.safeImmutableData.read(APP_HANDLE, _readerHandle))
      .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
      .then((parsedData) => _txInfo = parsedData)
      .then(() => window.safeImmutableData.dropReader(APP_HANDLE, _readerHandle))
      .then(() => window.safeAppendableData.removeAt(APP_HANDLE, _handleId, index))
      .then(() => window.safeAppendableData.post(APP_HANDLE, _handleId))
      .then(() => window.safeAppendableData.dropHandle(APP_HANDLE, _handleId))
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
    .then(() => window.safeImmutableData.getWriterHandle(APP_HANDLE))
    .then(_getHandleId)
    .then(handleId => _immHandleId = handleId)
    .then(() => window.safeImmutableData.write(APP_HANDLE, _immHandleId, content))
    .then(() => window.safeImmutableData.closeWriter(APP_HANDLE, _immHandleId, _cypherOptsAssymmetric))
    .then(_getHandleId)
    .then(handleId => _immToAppendHandleId = handleId)
    .then(() => window.safeImmutableData.dropWriter(APP_HANDLE, _immHandleId))
    .then(() => window.safeAppendableData.append(APP_HANDLE, _handleId, _immToAppendHandleId))
    .then(() => window.safeAppendableData.dropHandle(APP_HANDLE, _handleId))
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
*/
/*export const deleteTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Deleting TX inbox...", dataId);
  return _getSDataHandle(dataId)
    .then( (handleId) => {
      console.log("Data handle fetched:", handleId);
      window.safeStructuredData.del(APP_HANDLE, handleId)
        .then(res => console.log("Inbox deleted"));
      })
}*/
/*
export const transferCoin = (coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in the network...", coinId, recipient);

  return _transferOwnership(coinId, pk, recipient)
      .then((coinData) => {return coinId})
}
*/
