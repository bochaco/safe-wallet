// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

/*
 * Helper functions to store data in memory needed for demos and dev tasks
 */
import { genAppItemId } from '../common.js';
import { sample_wallet_data, sample_webids } from './sample-data.js';

/* The SAFE Browser sets this to true when the user
 * enbables the experimental APIs, we set it to true
 * so we have the functionality for WebIDs working
 */
window.safeExperimentsEnabled = true;

export const readConfigData = async () => 'en';

export const getWebIds = async () => {
  // format the WebIDs in the same was as how it's returned by the DOM API
  const formatted = Object.entries(sample_webids).map((entry) => ({
    "#me": {
      "@id": entry[0],
      "nick": entry[1].nick,
      "image": entry[1].image
    }
  }));
  return formatted;
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
  console.log("Connecting to the network...");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })
}

export const disconnectApp = () => console.log("Disconnecting...");

export const loadAppData = async () => {
  console.log("Reading the app data from memory...");
  return sample_wallet_data;
}

export const saveAppItem = async (item) => {
  console.log("Saving app data into memory...");
  if (!item.id) {
    item.id = genAppItemId();
  }

  sample_wallet_data[item.id] = item;
  return item;
}

export const deleteAppItem = async (item) => {
  console.log("Removing item from memory...");
  delete sample_wallet_data[item.id];
}
