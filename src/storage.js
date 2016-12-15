/*
  Helper functions to store data in the SAFEnet
*/

if (process.env.NODE_ENV !== 'production') {
  require('safe-js/dist/polyfill')
}

let AUTH_TOKEN = null;
let CYPHER_OPTS_SYMMETRIC = null;
let CONFIG_FILENAME = "safe-wallet-config.json";
let DATA_ID = "walletApp3"; // this value is by default, it will be overwritten
                             // with the value read from the config file

const _getHandleId = (res) => {
  return res.hasOwnProperty('handleId') ? res.handleId : res.__parsedResponseBody__.handleId;
}

const _readConfigData = () => {
  // TODO: change this to rivate to app with containers
  let isSharedFile = true; /* true == DRIVE, false == APP */
  console.log("Fetching config data from SAFE...");

  return window.safeNFS.getFile(AUTH_TOKEN, CONFIG_FILENAME, 'json', isSharedFile)
    .then( (res) => {
      console.log("Obtained config file content:", res);
      return res;
    }, (err) => {
      console.log("Failed fetching config file");
      let data = JSON.stringify( {'dataId': DATA_ID} );
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
    .then( (res) => (
      console.log("Auth Token received:", res.token),
      AUTH_TOKEN = res.token,
      window.safeCipherOpts.getHandle(res.token, window.safeCipherOpts.getEncryptionTypes().SYMMETRIC) ))
        .then(_getHandleId)
        .then(handleId => (
          CYPHER_OPTS_SYMMETRIC = handleId,
          _readConfigData() ))
            .then(configData => DATA_ID = configData.dataId)
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
    .then(handleId => (console.log("Fetched dataIdHandle:", handleId), dataIdHandle = handleId))
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
      return _createSData(id, {})
        .then( (handleId) => {
          console.log("SD just created:", handleId);
          return handleId;
        })
    })
}

export const loadData = () => {
  return _fetchSDataHandle(DATA_ID)
    .then((handleId) => {
      // let's try to read the data now!
      console.log("Reading the data...");
      return window.safeStructuredData.readData(AUTH_TOKEN, handleId, '')
        .then((res) => res.json ? res.json() : JSON.parse(new Buffer(res).toString()))
        .then((parsedData) => {
          console.log("Data read:", parsedData);
          return parsedData;
        }, (err) => {
          console.log("Error reading data:", err);
        })

    }, (err) => {
      console.log("Failed loading data:", err);
    })
}

export const saveData = (data) => {
  const payload = new Buffer(JSON.stringify(data)).toString('base64');

  console.log("Saving data in the network:", data);

  return _fetchSDataHandle(DATA_ID)
    .then((handleId) => {
      // let's try to save the data now!
      return window.safeStructuredData.updateData(AUTH_TOKEN, handleId, payload, CYPHER_OPTS_SYMMETRIC)
        .then(() => window.safeStructuredData.post(AUTH_TOKEN, handleId))
        .then(() => {
          console.log("Data updated in the network successfully");
          return data;
        }, (err) => {
          console.log("Error when updating data:", err);
        })

    }, (err) => {
      console.log("Failed loading data:", err);
    })
}
