/*
  Layer which takes care of storing data on the SAFEnet
*/
import { genAppItemId } from '../common.js';

const TAG_TYPE_DATA = 17112016;

const CONFIG_ENTRY_KEY_APP_DATA = 'app_data_md';
const CONFIG_ENTRY_KEY_VERSION = 'version';
const CONFIG_ENTRY_KEY_PREFERRED_LANG = 'lang';

const ERR_NO_SUCH_ENTRY = -106;

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
    .then(() => {
      console.log("App connected");
      return APP_HANDLE;
    });
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
