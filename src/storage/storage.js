/*
  Layer which takes care of storing data on the SAFEnet
*/
import { genTxId, genAppItemId } from '../common.js';

const TAG_TYPE_DATA = 17112016;
const TAG_TYPE_WALLET = 1012017;
const TAG_TYPE_WALLET_TX_INBOX = 20082018;
const TAG_TYPE_THANKS_COIN = 21082018;

const ENTRY_KEY_CONFIG = 'app_config';

const CONFIG_ENTRY_KEY_APP_DATA = 'app_data';
const CONFIG_ENTRY_KEY_VERSION = 'version';
const CONFIG_ENTRY_KEY_PREFERRED_LANG = 'lang';

const COIN_ENTRY_KEY_DATA = 'coin-data';

const TX_INBOX_ENTRY_KEY_PK = '__enc_pk';
const WALLET_ENTRY_KEY_COINS = '__coins';

const ERR_NO_SUCH_ENTRY = -106;

let APP_HANDLE = null;
let DATA_HANDLE = null;

export const readConfigData = () => {
  console.log("Fetching config data from app's home container...");
  return window.safeApp.getOwnContainer(APP_HANDLE)
    .then((ownContainerHandle) => window.safeMutableData.encryptKey(ownContainerHandle, ENTRY_KEY_CONFIG)
      .then((encKey) => window.safeMutableData.get(ownContainerHandle, encKey)
        .then((encValue) => window.safeMutableData.decrypt(ownContainerHandle, encValue.buf))
        .then((decrypted) => JSON.parse(decrypted))
      .catch((err) => {
        if (err.code !== ERR_NO_SUCH_ENTRY) {
          console.log("Failed fetching config data: ", err.code, err.message);
          throw err;
        }
        console.log("Generating config data...");
        let configToStore = {
          [CONFIG_ENTRY_KEY_VERSION]: '0.0.10',
          [CONFIG_ENTRY_KEY_PREFERRED_LANG]: 'en'
        };

        return window.safeMutableData.newRandomPrivate(APP_HANDLE, TAG_TYPE_DATA)
          .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, {}))
          .then((mdHandle) => window.safeMutableData.serialise(mdHandle)
            .then((serialised) => {
              window.safeMutableData.free(mdHandle);
              configToStore[CONFIG_ENTRY_KEY_APP_DATA] = serialised;
              return window.safeMutableData.newMutation(APP_HANDLE)
                .then((mutHandle) => window.safeMutableData.encryptKey(ownContainerHandle, ENTRY_KEY_CONFIG)
                  .then((encKey) => window.safeMutableData.encryptValue(ownContainerHandle, JSON.stringify(configToStore))
                    .then((encValue) => window.safeMutableDataMutation.insert(mutHandle, encKey, encValue))
                  )
                )
                .then(() => {
                  console.log("Config data stored in app's own container")
                  window.safeMutableData.free(ownContainerHandle);
                  return configToStore;
                })
            }, (err) => {
              throw Error("Failed generating config data");
            })
          );
      })))
    .then((storedConfig) => window.safeMutableData.fromSerial(APP_HANDLE, storedConfig[CONFIG_ENTRY_KEY_APP_DATA])
      .then((dataMdHandle) => {
        DATA_HANDLE = dataMdHandle;
        return storedConfig;
      })
    )
    .then((configData) => configData.preferredLang);
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
}

export const disconnectApp = () => {
  console.log("Disconnecting...");
  window.safeMutableData.free(DATA_HANDLE);
  DATA_HANDLE = null;
  window.safeApp.free(APP_HANDLE);
  APP_HANDLE = null;
  console.log("App disconnected by user");
}

const _decryptEntries = (rawEntries) => {
  let data = {};
  return Promise.all(rawEntries.map((entry) => {
      // Ignore soft-deleted items
      if (entry.value.buf.length === 0) {
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
    id = genAppItemId();
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

// Wallet management functions
const _genXorName = (id) => {
  return window.safeCrypto.sha3Hash(APP_HANDLE, id);
}

export const createTxInbox = (pk) => {
  console.log("Creating TX inbox...", pk);
  let baseInbox = {
    [TX_INBOX_ENTRY_KEY_PK]: pk
  };
  let inboxHandle;
  let permSetHandle;
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
    .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, baseInbox)) //TODO: set metadata
    .then((mdHandle) => inboxHandle = mdHandle)
    .then(() => window.safeMutableData.newPermissionSet(APP_HANDLE))
    .then((pmSetHandle) => permSetHandle = pmSetHandle)
    .then(() => window.safeMutableDataPermissionsSet.setAllow(permSetHandle, 'Insert'))
    .then(() => window.safeMutableData.setUserPermissions(inboxHandle, null, permSetHandle, 1))
    .then(() => window.safeMutableDataPermissionsSet.free(permSetHandle))
    .then(() => window.safeMutableData.free(inboxHandle))
}

export const createWallet = (pk) => {
  console.log("Creating the coin wallet...", pk);
  const emptyCoins = {
    [WALLET_ENTRY_KEY_COINS]: JSON.stringify([])
  }
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET)) //TODO: make it private and encrypted
    .then((inboxHandle) => window.safeMutableData.quickSetup(inboxHandle, emptyCoins)) //TODO: set metadata & support the case that it exists already
    .then((inboxHandle) => window.safeMutableData.free(inboxHandle));
}

export const loadWalletData = (pk) => {
  // We store the wallet inbox at the sha3 hash value of its PublicKey
  // so it's easy to find by other wallet apps to transfer coins.
  console.log("Reading the coin wallet info...", pk);
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET))
    .then((walletHandle) => window.safeMutableData.get(walletHandle, WALLET_ENTRY_KEY_COINS)
      .then((coins) => {
        window.safeMutableData.free(walletHandle);
        return JSON.parse(coins.buf.toString());
      })
    );
}

export const storeCoinsToWallet = (pk, coins) => {
  console.log("Saving coins in the wallet on the network...");
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET))
    .then((walletHandle) => window.safeMutableData.get(walletHandle, WALLET_ENTRY_KEY_COINS)
      .then((currentCoins) => window.safeMutableData.newMutation(APP_HANDLE)
        .then((mutHandle) => window.safeMutableDataMutation.update(mutHandle, WALLET_ENTRY_KEY_COINS, JSON.stringify(coins), currentCoins.version + 1)
          .then(() => window.safeMutableData.applyEntriesMutation(walletHandle, mutHandle))
          .then(() => window.safeMutableDataMutation.free(mutHandle))
        )
        .then(() => window.safeMutableData.free(walletHandle))
      )
    );
}

// Tx Inbox management functions
const _decryptTxs = (encryptedTxs) => {
  return encryptedTxs.map((encryptedTx) => {
    // TODO: decrypt each entry's tx
    return Object.assign({ id: encryptedTx.id }, JSON.parse(encryptedTx.tx));
  });
}

export const readTxInboxData = (pk) => {
  let encryptedTxs = [];
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
    .then((inboxHandle) => window.safeMutableData.getEntries(inboxHandle)
      .then((entriesHandle) => window.safeMutableDataEntries.forEach(entriesHandle, (id, tx) => {
          // Ignore soft-deleted items and the Public encryption key entry
          if (id.toString() !== TX_INBOX_ENTRY_KEY_PK && tx.buf.length > 0) {
            encryptedTxs.push({ id: id.toString(), tx: tx.buf.toString() });
          }
        })
        .then(() => _decryptTxs(encryptedTxs))
        .then((decryptedTxs) => {
          window.safeMutableDataEntries.free(entriesHandle);
          window.safeMutableData.free(inboxHandle);
          return decryptedTxs;
        })
      )
    );
}

export const removeTxInboxData = (pk, txs) => {
  return window.safeMutableData.newMutation(APP_HANDLE)
    .then((mutHandle) => Promise.all(txs.map((tx) => window.safeMutableDataMutation.remove(mutHandle, tx.id, 1)))
      .then(() => _genXorName(pk))
      .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
      .then((txInboxHandle) => window.safeMutableData.applyEntriesMutation(txInboxHandle, mutHandle)
        .then(() => window.safeMutableData.free(txInboxHandle))
      )
      .then(() => window.safeMutableDataMutation.free(mutHandle))
    );
}

const _checkOwnership = (coin, pk) => {
  const coinData = JSON.parse(coin);
  console.log("Coin data: ", coinData);
  if (coinData.owner !== pk) {
    throw Error ("Ownership doesn't match", pk, coinData);
  }
  return Promise.resolve(coinData);
}

export const checkOwnership = (coinId, pk) => {
  console.log("Reading coin data...", pk, coinId);
  return window.safeMutableData.newPublic(APP_HANDLE, Buffer.from(coinId, 'hex'), TAG_TYPE_THANKS_COIN)
    .then((coinHandle) => window.safeMutableData.get(coinHandle, COIN_ENTRY_KEY_DATA)
      .then((coin) => {
        window.safeMutableData.free(coinHandle);
        return _checkOwnership(coin.buf.toString(), pk);
      })
    );
}

export const sendTxNotif = (pk, coinIds, msg) => {
  let id = genTxId();
  let tx = {
    coinIds: coinIds,
    msg: msg,
    date: (new Date()).toUTCString()
  }
  const txNotif = JSON.stringify(tx);

  console.log("Saving TX inbox data in the network...");
  return window.safeMutableData.newMutation(APP_HANDLE)
    .then((mutHandle) => window.safeMutableDataMutation.insert(mutHandle, id, txNotif) // TODO: encrypt notif
      .then(() =>  _genXorName(pk))
      .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
      .then((txInboxHandle) => window.safeMutableData.applyEntriesMutation(txInboxHandle, mutHandle)
        .then(() => window.safeMutableData.free(txInboxHandle))
      )
      .then(() => window.safeMutableDataMutation.free(mutHandle))
    );
}

export const transferCoin = (coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in the network...", coinId, recipient);

  return window.safeMutableData.newPublic(APP_HANDLE, Buffer.from(coinId, 'hex'), TAG_TYPE_THANKS_COIN)
    .then((coinHandle) => window.safeMutableData.get(coinHandle, COIN_ENTRY_KEY_DATA)
      .then((coin) => _checkOwnership(coin.buf.toString(), pk)
        .then((coinData) => {
          coinData.owner = recipient;
          coinData.prev_owner = pk;
          console.log("Coin's new ownership: ", coinData);
          return window.safeMutableData.newMutation(APP_HANDLE)
            .then((mutHandle) => window.safeMutableDataMutation.update(mutHandle, COIN_ENTRY_KEY_DATA, JSON.stringify(coinData), coin.version + 1)
              .then(() => window.safeMutableData.applyEntriesMutation(coinHandle, mutHandle))
              .then(() => window.safeMutableDataMutation.free(mutHandle))
            );
        })
      )
      .then(() => window.safeMutableData.free(coinHandle))
    );
}
