/*
  Helper functions to store data in memory needed for demos and dev tasks
*/
import { getXorName } from '../common.js';
import {sample_SD_wallets, sample_wallet_data} from './sample-data.js';

var app_data = sample_wallet_data;
var sd_wallets = sample_SD_wallets;

export const authoriseApp = (app) => {
  console.log("Authenticating app...");
  return new Promise(resolve => setTimeout(resolve, 300));
}

export const isTokenValid = () => {
  return Promise.resolve(true);
}

export const loadAppData = () => {
  console.log("Reading the app data into memory...");
  return Promise.resolve(app_data);
}

export const saveAppData = (data) => {
  console.log("Saving app data in memory...");
  app_data = data.slice();
  return Promise.resolve(app_data);
}

export const loadWalletData = (pk) => {
  console.log("Reading the coin wallet into memory...");
  return Promise.resolve(sd_wallets[getXorName(pk)]);
}

export const transferCoin = (id, pk, sk, recipient) => {
  console.log("Transfering coin's ownership...", id, recipient);

  let wallet = sd_wallets[getXorName(pk)];
  // let's check if the id is found in the wallet
  let index = wallet.indexOf(id);
  if (index >= 0) {
    // ok, let's make the transfer now
    wallet.splice(index, 1);

    if (sd_wallets[getXorName(recipient)]) {
      sd_wallets[getXorName(recipient)].push(id);
    } else {
      sd_wallets[getXorName(recipient)] = [id];
    }
  } else {
    console.log("Error, coin is not owned");
  }

  return wallet;
}
