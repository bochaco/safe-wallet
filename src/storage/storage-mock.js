/*
  Helper functions to store data in memory needed for demos and dev tasks
*/
import { genAppItemId } from '../common.js';
import { sample_wallet_data, sample_webids } from './sample-data.js';

export const readConfigData = () => Promise.resolve('en');

export const getWebIds = () => {
  // format the WebIDs in the same was as how it's returned by the DOM API
  const formatted = Object.entries(sample_webids).map((entry) => ({
    "#me": {
      "@id": entry[0],
      "nick": entry[1].nick,
      "image": entry[1].image
    }
  }));
  return Promise.resolve(formatted);
};

export const authoriseApp = (app, permissions) => {
  console.log("Authorising app...");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({safeApp: '', authUri: ''})
    }, 1500)
  })
}

export const connectApp = (authUri) => {
  console.log("Connecing to the network...");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })
}

export const disconnectApp = () => console.log("Disconnecting...");

export const loadAppData = () => {
  console.log("Reading the app data from memory...");
  return Promise.resolve(sample_wallet_data);
}

export const saveAppItem = (item) => {
  console.log("Saving app data into memory...");
  if (!item.id) {
    item.id = genAppItemId();
  }

  sample_wallet_data[item.id] = item;
  return Promise.resolve(item);
}

export const deleteAppItem = (item) => {
  console.log("Removing item from memory...");
  delete sample_wallet_data[item.id];
  return Promise.resolve();
}
