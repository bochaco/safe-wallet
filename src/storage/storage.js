/*
  Layer which takes care of storing data on the SAFEnet
*/
import { genTxId, genAppItemId } from '../common.js';

const TAG_TYPE_DATA = 17112016;
const TAG_TYPE_WALLET = 1012017;
const TAG_TYPE_WALLET_TX_INBOX = 20082018;
const TAG_TYPE_THANKS_COIN = 21082018;

const CONFIG_ENTRY_KEY_APP_DATA = 'app_data_md';
const CONFIG_ENTRY_KEY_VERSION = 'version';
const CONFIG_ENTRY_KEY_PREFERRED_LANG = 'lang';

const COIN_ENTRY_KEY_DATA = 'coin-data';

const TX_INBOX_ENTRY_KEY_PK = '__tx_enc_pk';
const TX_INBOX_METADATA_NAME = 'ThanksCoins inbox';
const TX_INBOX_METADATA_DESC = 'Container to receive notifications of ThanksCoins transactions';

const WALLET_ENTRY_KEY_COINS = '__coins';
const WALLET_METADATA_NAME = 'ThanksCoins Wallet';
const WALLET_METADATA_DESC = 'Container to store the list of ThanksCoins addresses owned';

const ERR_NO_SUCH_ENTRY = -106;
const ENTRY_KEY_MD_METADATA = '_metadata';

let APP_HANDLE = null;
let DATA_HANDLE = null;

const _readEncryptedEntry = (md, key) => {
  return window.safeMutableData.encryptKey(md, key)
    .then((encKey) => window.safeMutableData.get(md, encKey))
    .then((encValue) => window.safeMutableData.decrypt(md, encValue.buf));
}

const _readEncryptedEntries = (md) => {
  let keys = [CONFIG_ENTRY_KEY_APP_DATA, CONFIG_ENTRY_KEY_PREFERRED_LANG];
  let retData = {};
  return Promise.all(keys.map((key) => {
      return _readEncryptedEntry(md, key)
        .then((value) => {
          retData[key] = value;
        });
    }))
    .then(() => retData)
}

const _insertEntriesEncrypted = (md, data) => {
  return window.safeMutableData.newMutation(APP_HANDLE)
    .then((mutHandle) => Promise.all(Object.keys(data).map((key) => {
        return window.safeMutableData.encryptKey(md, key)
          .then((encKey) => window.safeMutableData.encryptValue(md, data[key])
            .then((encValue) => window.safeMutableDataMutation.insert(mutHandle, encKey, encValue))
          )
      }))
      .then(() => window.safeMutableData.applyEntriesMutation(md, mutHandle))
      .then(() => window.safeMutableDataMutation.free(mutHandle))
    );
}

const _generateConfigData = (md) => {
  console.log("Generating config data...");
  return window.safeMutableData.newRandomPrivate(APP_HANDLE, TAG_TYPE_DATA)
    .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, {}))
    .then((mdHandle) => window.safeMutableData.serialise(mdHandle)
      .then((serialised) => {
        window.safeMutableData.free(mdHandle);
        let configToStore = {
          [CONFIG_ENTRY_KEY_VERSION]: '0.0.10',
          [CONFIG_ENTRY_KEY_PREFERRED_LANG]: 'en',
          [CONFIG_ENTRY_KEY_APP_DATA]: new Uint8Array(serialised)
        };
        return _insertEntriesEncrypted(md, configToStore)
          .then(() => {
            console.log("Config data stored in app's own container: ", configToStore)
            return _readEncryptedEntries(md); // TODO: try to avoid reaing them again
          });
      }, (err) => {
        throw Error("Failed generating config data: ", err.code, err.message);
      })
    );
}

const _fromArrayBuffer = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export const readConfigData = () => {
  console.log("Fetching config data from app's home container...");
  let ownContainerHandle;
  return window.safeApp.getOwnContainer(APP_HANDLE).then((handle) => {
    ownContainerHandle = handle;
    return _readEncryptedEntries(ownContainerHandle)
      .catch((err) => {
        if (err.code !== ERR_NO_SUCH_ENTRY) {
          console.log("Failed fetching config data: ", err.code, err.message);
          throw err;
        }
        return _generateConfigData(ownContainerHandle)
      });
  })
  .then((storedConfig) => window.safeMutableData.fromSerial(APP_HANDLE, storedConfig[CONFIG_ENTRY_KEY_APP_DATA])
    .then((dataMdHandle) => {
      window.safeMutableData.free(ownContainerHandle);
      DATA_HANDLE = dataMdHandle;
      let lang = _fromArrayBuffer(storedConfig[CONFIG_ENTRY_KEY_PREFERRED_LANG]);
      console.log('Finished reading config');
      return lang;
    })
  )
}

// Auth & connection functions
export const connectApp = (app, perms, networkStateCb) => {
  console.log("Authorising app...");
  return window.safeApp.initialise(app, networkStateCb)
    .then((res) => (APP_HANDLE = res) )
    .then(() => (console.log("App handle retrieved ", APP_HANDLE) ))
    .then(() => window.safeApp.authorise(APP_HANDLE, perms.containers, perms.options))
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
  console.log("App disconnected by the user");
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
            id: _fromArrayBuffer(decKey),
            version: entry.value.version,
            content: JSON.parse(_fromArrayBuffer(decValue))
          }
          data[item.id] = item;
        }));
  }))
  .then(() => data);
}

// App data management functions
export const loadAppData = () => {
  console.log('Loading data...');
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
      console.log('Finished reading data');
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
            console.log("...updating item...");
            return window.safeMutableDataMutation.update(mutHandle, encKey, encValue, version);
          } else {
            console.log("...inserting item...");
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
  console.log("Removing item from the network...");
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

export const createWallet = (pk) => {
  console.log("Creating the coin wallet...");
  const emptyCoins = {
    [WALLET_ENTRY_KEY_COINS]: JSON.stringify([])
  }
  return window.safeCrypto.generateEncKeyPair(APP_HANDLE)
    .then((keyPairHandle) => window.safeCryptoKeyPair.getSecEncKey(keyPairHandle)
      .then((secEncKeyHandle) =>  window.safeCryptoSecEncKey.getRaw(secEncKeyHandle)
        .then((secEncKey) => window.safeCrypto.generateNonce(APP_HANDLE)
          .then((nonce) => _genXorName(pk)
            .then((xorName) => window.safeMutableData.newPrivate(APP_HANDLE, xorName, TAG_TYPE_WALLET, secEncKey.buffer, nonce.buffer))
            .then((inboxHandle) => window.safeMutableData.quickSetup(inboxHandle, {}, WALLET_METADATA_NAME, WALLET_METADATA_DESC)) //TODO: support the case that it exists already
            .then((inboxHandle) => _insertEntriesEncrypted(inboxHandle, emptyCoins)
              .then(() => window.safeMutableData.serialise(inboxHandle))
              .then((serialisedWallet) => {
                window.safeCryptoKeyPair.free(keyPairHandle)
                window.safeCryptoSecEncKey.free(secEncKeyHandle);
                let walletArr = new Uint8Array(serialisedWallet);
                return walletArr.toString();
              })
            )
          )
        )
      )
    );
}

const _deserialiseArray = (strOrBuffer) => {
  let arrItems = strOrBuffer.split(',');
  return Uint8Array.from(arrItems);
}

export const loadWalletData = (wallet) => {
  // We store the wallet inbox at the sha3 hash value of its PublicKey
  // so it's easy to find by other wallet apps to transfer coins.
  console.log("Reading the coin wallet info...");
  return window.safeMutableData.fromSerial(APP_HANDLE, _deserialiseArray(wallet))
    .then((walletHandle) => _readEncryptedEntry(walletHandle, WALLET_ENTRY_KEY_COINS))
    .then((coins) => JSON.parse(_fromArrayBuffer(coins)));
}

export const storeCoinsToWallet = (wallet, coins) => {
  console.log("Saving coins in the wallet on the network...");
  return window.safeMutableData.fromSerial(APP_HANDLE, _deserialiseArray(wallet))
    .then((walletHandle) => window.safeMutableData.encryptKey(walletHandle, WALLET_ENTRY_KEY_COINS)
      .then((encKey) => window.safeMutableData.get(walletHandle, encKey)
        .then((currentCoins) => window.safeMutableData.newMutation(APP_HANDLE)
          .then((mutHandle) => window.safeMutableData.encryptValue(walletHandle, JSON.stringify(coins))
            .then((encValue) => window.safeMutableDataMutation.update(mutHandle, encKey, encValue, currentCoins.version + 1)
              .then(() => window.safeMutableData.applyEntriesMutation(walletHandle, mutHandle))
              .then(() => window.safeMutableDataMutation.free(mutHandle))
            )
          )
        )
      )
    );
}

// Tx Inbox management functions
const _genKeyPair = () => {
  let rawKeyPair = {};
  return window.safeCrypto.generateEncKeyPair(APP_HANDLE)
    .then((keyPairHandle) => window.safeCryptoKeyPair.getPubEncKey(keyPairHandle)
      .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.getRaw(pubEncKeyHandle)
        .then((rawPubEncKey) => {
          window.safeCryptoPubEncKey.free(pubEncKeyHandle);
          rawKeyPair.pk = rawPubEncKey.buffer.toString('hex');
          return;
        })
      )
      .then(() => window.safeCryptoKeyPair.getSecEncKey(keyPairHandle))
      .then((secEncKeyHandle) => window.safeCryptoSecEncKey.getRaw(secEncKeyHandle)
        .then(rawSecEncKey => {
          window.safeCryptoSecEncKey.free(secEncKeyHandle);
          window.safeCryptoKeyPair.free(keyPairHandle);
          rawKeyPair.sk = rawSecEncKey.buffer.toString('hex');
          return rawKeyPair;
        })
      )
    )
}

export const createTxInbox = (pk) => {
  console.log("Creating TX inbox...", pk);
  let baseInbox;
  let encKeys;
  let inboxHandle;
  let permSetHandle;
  return _genKeyPair()
    .then((keys) => {
      encKeys = keys;
      baseInbox = {
        [TX_INBOX_ENTRY_KEY_PK]: encKeys.pk
      };
      return _genXorName(pk);
    })
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
    .then((mdHandle) => window.safeMutableData.quickSetup(mdHandle, baseInbox, TX_INBOX_METADATA_NAME, TX_INBOX_METADATA_DESC))
    .then((mdHandle) => inboxHandle = mdHandle)
    .then(() => window.safeMutableData.newPermissionSet(APP_HANDLE))
    .then((pmSetHandle) => permSetHandle = pmSetHandle)
    .then(() => window.safeMutableDataPermissionsSet.setAllow(permSetHandle, 'Insert'))
    .then(() => window.safeMutableData.setUserPermissions(inboxHandle, null, permSetHandle, 1))
    .then(() => window.safeMutableDataPermissionsSet.free(permSetHandle))
    .then(() => {
      window.safeMutableData.free(inboxHandle);
      return encKeys;
    });
}

const _encrypt = (input, pk) => {
  if(Array.isArray(input)) {
    input = input.toString();
  }

  return window.safeCrypto.pubEncKeyKeyFromRaw(APP_HANDLE, Buffer.from(pk, 'hex'))
    .then((pubEncKeyHandle) => window.safeCryptoPubEncKey.encryptSealed(pubEncKeyHandle, input)
      .then((encrypted) => {
        window.safeCryptoPubEncKey.free(pubEncKeyHandle);
        return encrypted;
      })
    );
};

const _decryptTxs = (encryptedTxs, encPk, encSk) => {
  return Promise.all(encryptedTxs.map((encTx) => {
    const rawPk = Buffer.from(encPk, 'hex');
    const rawSk = Buffer.from(encSk, 'hex');
    return window.safeCrypto.generateEncKeyPairFromRaw(APP_HANDLE, rawPk, rawSk)
      .then((keyPairHandle) => window.safeCryptoKeyPair.decryptSealed(keyPairHandle, encTx.txInfo)
        .then((decrypted) => {
          window.safeCryptoKeyPair.free(keyPairHandle);
          const parsedTxInfo = JSON.parse(_fromArrayBuffer(decrypted));
          return Object.assign({ id: encTx.id }, parsedTxInfo);
        })
      );
  }));
}

export const readTxInboxData = (pk, encPk, encSk) => {
  let encryptedTxs = [];
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
    .then((inboxHandle) => window.safeMutableData.getEntries(inboxHandle)
      .then((entriesHandle) => window.safeMutableDataEntries.forEach(entriesHandle, (key, value) => {
          const id = _fromArrayBuffer(key);
          const txInfo = value.buf;
          // Ignore soft-deleted items, metadata entry and the Public encryption key entry
          if (id !== TX_INBOX_ENTRY_KEY_PK && id !== ENTRY_KEY_MD_METADATA
              && txInfo.length > 0) {
            encryptedTxs.push({ id, txInfo });
          }
        })
        .then(() => _decryptTxs(encryptedTxs, encPk, encSk))
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

export const sendTxNotif = (pk, coinIds, msg) => {
  let txId = genTxId();
  let tx = {
    coinIds: coinIds,
    msg: msg,
    date: (new Date()).toUTCString()
  }
  const txNotif = JSON.stringify(tx);

  console.log("Sending TX notification to recipient. TX id: ", txId);
  return _genXorName(pk)
    .then((xorName) => window.safeMutableData.newPublic(APP_HANDLE, xorName, TAG_TYPE_WALLET_TX_INBOX))
    .then((txInboxHandle) => window.safeMutableData.get(txInboxHandle, TX_INBOX_ENTRY_KEY_PK)
      .then((encPk) => _encrypt(txNotif, encPk.buf.toString()))
      .then((encryptedTx) => window.safeMutableData.newMutation(APP_HANDLE)
        .then((mutHandle) => window.safeMutableDataMutation.insert(mutHandle, txId, encryptedTx)
          .then(() => window.safeMutableData.applyEntriesMutation(txInboxHandle, mutHandle)
            .then(() => window.safeMutableData.free(txInboxHandle))
          )
          .then(() => window.safeMutableDataMutation.free(mutHandle))
        )
      )
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
