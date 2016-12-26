/*
  Helper functions to store data in the SAFEnet
*/
import { getXorName } from '../common.js';

if (process.env.NODE_ENV !== 'production') {
  require('safe-js/dist/polyfill')
}

let AUTH_TOKEN = null;
let CYPHER_OPTS_SYMMETRIC = null;
let CONFIG_FILENAME = "safe-wallet-config.json";
let DATA_ID = "safe-wallet-app-data"; // this value is by default, it will be overwritten
                                 // with the value read from the config file

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

const _createSData = (id, data) => {
  let dataHandle = null;
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  return window.safeStructuredData.create(AUTH_TOKEN, id, 500, payload, CYPHER_OPTS_SYMMETRIC)
    .then(_getHandleId)
    .then(handleId => (dataHandle = handleId))
    .then(() => window.safeStructuredData.put(AUTH_TOKEN, dataHandle))
    .then(() => {
      console.log("New SD saved in the net", dataHandle);
      return dataHandle;
    })
}

const _getSDataHandle = (id) => {
  console.log("Fetching SD handle...");
  let dataIdHandle = null;
  return window.safeDataId.getStructuredDataHandle(AUTH_TOKEN, id, 500)
    .then(_getHandleId)
    .then(handleId => (dataIdHandle = handleId))
    .then(() => (console.log("Fetched dataIdHandle:", dataIdHandle)) )
    .then(() => window.safeStructuredData.getHandle(AUTH_TOKEN, dataIdHandle))
    .then(_getHandleId)
    .then(handleId => {
      window.safeDataId.dropHandle(AUTH_TOKEN, dataIdHandle);
      console.log("Fetched SD handle:", handleId);
      return handleId;
    })
}

const _fetchSDataHandle = (id) => {
  return _getSDataHandle(id)
    .then( (handleId) => {
      console.log("Data handle fetched:", handleId);
      return handleId;
    }, (err) => {
      // it doesn't exist yet, so let's create the SD
      console.log("SD doesn't exist yet:", err);
      return _createSData(id, [])
        .then( (handleId) => {
          console.log("SD just created:", handleId);
          return handleId;
        })
    })
}

export const loadAppData = () => {
  return _fetchSDataHandle(DATA_ID)
    .then((handleId) => {
      // let's try to read the data now!
      console.log("Reading the data...");
      return window.safeStructuredData.readData(AUTH_TOKEN, handleId, '')
        .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
        .then((parsedData) => {
          console.log("Data successfully retrieved");
          return parsedData;
        }, (err) => {
          console.log("Error reading data:", err);
        })

    }, (err) => {
      console.log("Failed loading data:", err);
    })
}

export const saveAppData = (data) => {
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  console.log("Saving data in the network...");

  return _fetchSDataHandle(DATA_ID)
    .then((handleId) => {
      // let's try to save the data now!
      return window.safeStructuredData.updateData(AUTH_TOKEN, handleId, payload, CYPHER_OPTS_SYMMETRIC)
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, handleId))
        .then(() => {
          console.log("Data saved in the network successfully");
          return data;
        }, (err) => {
          console.log("Error when updating data:", err);
        })

    }, (err) => {
      console.log("Failed loading data:", err);
    })
}

export const loadWalletData = (pk) => {
  console.log("Reading the coin wallet info...");
  return Promise.resolve(["1", "2", "3"]);
}
