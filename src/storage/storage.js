/*
  Layer which takes care of storing data on the SAFE Network
*/
import { genAppItemId } from '../common.js';

const TAG_TYPE_DATA = 17112016;

const CONFIG_ENTRY_KEY_APP_DATA = 'app_data_md';
const CONFIG_ENTRY_KEY_VERSION = 'version';
const CONFIG_ENTRY_KEY_PREFERRED_LANG = 'lang';

const ERR_NO_SUCH_ENTRY = -106;

let walletSafeApp = null;
let walletDataMd = null;

const _readEncryptedEntry = async (md, key) => {
  const encKey = await md.encryptKey(key);
  const encValue = await md.get(encKey);
  const decryptedValue = await md.decrypt(encValue.buf);
  return decryptedValue;
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

const _insertEntriesEncrypted = async (md, data) => {
  const mutations = await walletSafeApp.mutableData.newMutation();
  await Promise.all(Object.keys(data).map(async (key) => {
    const encKey = await md.encryptKey(key);
    const encValue = await md.encryptValue(data[key]);
    await mutations.insert(encKey, encValue);
  }));
  await md.applyEntriesMutation(mutations);
}

const _generateConfigData = async (md) => {
  console.log("Generating config data...");
  const randomPrivMd = await walletSafeApp.mutableData.newRandomPrivate(TAG_TYPE_DATA);
  await randomPrivMd.quickSetup({});
  const serialised = await randomPrivMd.serialise();
  let configToStore = {
    [CONFIG_ENTRY_KEY_VERSION]: '0.0.10',
    [CONFIG_ENTRY_KEY_PREFERRED_LANG]: 'en',
    [CONFIG_ENTRY_KEY_APP_DATA]: new Uint8Array(serialised)
  };
  try {
    await _insertEntriesEncrypted(md, configToStore);
    console.log("Config data stored in app's own container: ", configToStore)
    return _readEncryptedEntries(md); // TODO: try to avoid reaing them again
  } catch (err) {
    throw Error("Failed generating config data: ", err.code, err.message);
  }
}

const _fromArrayBuffer = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export const readConfigData = async () => {
  console.log("Fetching config data from app's own container...");
  const ownContainerMd = await walletSafeApp.auth.getOwnContainer();
  let storedConfig;
  try {
    storedConfig = await _readEncryptedEntries(ownContainerMd);
  } catch(err) {
    if (err.code !== ERR_NO_SUCH_ENTRY) {
      console.log("Failed fetching config data: ", err.code, err.message);
      throw err;
    }
    storedConfig = await _generateConfigData(ownContainerMd);
  }

  walletDataMd = await walletSafeApp.mutableData.fromSerial(storedConfig[CONFIG_ENTRY_KEY_APP_DATA]);
  let lang = _fromArrayBuffer(storedConfig[CONFIG_ENTRY_KEY_PREFERRED_LANG]);
  console.log('Finished reading config');
  return lang;
}

export const getWebIds = async () => walletSafeApp.web.getWebIds();

// Auth & connection functions
export const authoriseApp = async (appInfo, perms, networkStateCb) => {
  console.log("Authorising app...");
  walletSafeApp = await window.safe.initialiseApp(appInfo, networkStateCb);
  console.log("safeApp instance initialised...");
  const authReqUri = await walletSafeApp.auth.genAuthUri(perms.containers, perms.options);
  console.log("Authorisation request URI generated: ", authReqUri);
  const authUri = await window.safe.authorise(authReqUri);
  return { safeApp: walletSafeApp, authUri };
}

export const connectApp = async (authUri) => {
  console.log("Connecting to the network...");
  await walletSafeApp.auth.loginFromUri(authUri);
  await walletSafeApp.auth.refreshContainersPermissions();
  console.log("App connected");
}

export const disconnectApp = () => {
  console.log("Disconnecting...");
  walletDataMd = null;
  walletSafeApp = null;
  console.log("App disconnected by the user");
}

const _decryptEntries = async (rawEntries) => {
  let data = {};
  await Promise.all(rawEntries.map(async (entry) => {
    // Ignore soft-deleted items
    if (entry.value.buf.length === 0) {
      return Promise.resolve();
    }

    const decKey = await walletDataMd.decrypt(entry.key);
    const decValue = await walletDataMd.decrypt(entry.value.buf);
    let item = {
      id: _fromArrayBuffer(decKey),
      version: entry.value.version,
      content: JSON.parse(_fromArrayBuffer(decValue))
    }
    data[item.id] = item;
  }));

  return data;
}

// App data management functions
export const loadAppData = async () => {
  console.log('Loading data...');
  const entries = await walletDataMd.getEntries();
  const rawEntries = await entries.listEntries();
  const data = await _decryptEntries(rawEntries);
  console.log('Finished reading data');
  return data;
}

export const saveAppItem = async (item) => {
  console.log("Saving app data in the network...");
  let version = 0;
  let id = item.id;
  if (!item.id) {
    id = genAppItemId();
  } else {
    version = item.version + 1;
  }

  const mutations = await walletSafeApp.mutableData.newMutation();
  const encKey = await walletDataMd.encryptKey(id);
  const encValue = await walletDataMd.encryptValue(JSON.stringify(item.content));
  if (item.id) {
    console.log("...updating item...");
    await mutations.update(encKey, encValue, version);
  } else {
    console.log("...inserting item...");
    await mutations.insert(encKey, encValue);
  }
  await walletDataMd.applyEntriesMutation(mutations);
  console.log("App item saved in the network successfully");
  item.id = id;
  item.version = version;
  return item;
}

export const deleteAppItem = async (item) => {
  console.log("Removing item from the network...");
  const mutations = await walletSafeApp.mutableData.newMutation();
  const encKey = await walletDataMd.encryptKey(item.id);
  await mutations.delete(encKey, item.version + 1);
  await walletDataMd.applyEntriesMutation(mutations);
  console.log("App item removed from the network successfully");
}
