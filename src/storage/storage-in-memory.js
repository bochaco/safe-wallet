/*
  Helper functions to store data in memory needed for demos and dev tasks
*/
import { getXorName } from '../common.js';
import {sample_SD_wallets, sample_SD_tx_inboxes, sample_SD_coins, sample_wallet_data} from './sample-data.js';

const WALLET_INBOX_PREFIX = 'INBOX-';

var app_data = sample_wallet_data;
var sd_wallets = sample_SD_wallets;
var sd_tx_inboxes = sample_SD_tx_inboxes;
var sd_coins = sample_SD_coins;

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
  let dataId = getXorName(pk);
  if (!sd_wallets[dataId]) {
    sd_wallets[dataId] = [];
  }
  return Promise.resolve(sd_wallets[dataId]);
}

export const createWallet = (pk) => {
  let dataId = getXorName(pk);
  console.log("Creating wallet in memory...", pk, dataId);
  if (!sd_wallets[dataId]) {
    sd_wallets[dataId] = [];
  }
  return Promise.resolve(sd_wallets[dataId]);
}

export const saveWalletData = (pk, data) => {
  let dataId = getXorName(pk);
  console.log("Saving coin wallet data in the network...");
  sd_wallets[dataId] = data;
  return Promise.resolve(data);
}

export const createTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Creating TX inbox in memory...", pk, dataId);
  if (!sd_tx_inboxes[dataId]) {
    sd_tx_inboxes[dataId] = [];
  }
  return Promise.resolve(sd_tx_inboxes[dataId]);
}

export const readTxInboxData = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Reading TX inbox in memory...", pk, dataId);
  if (!sd_tx_inboxes[dataId]) {
    sd_tx_inboxes[dataId] = [];
  }
  return Promise.resolve(sd_tx_inboxes[dataId]);
}

export const emptyTxInbox = (pk) => {
  let dataId = getXorName(WALLET_INBOX_PREFIX + pk);
  console.log("Emptying Tx inbox in the network...");
  sd_tx_inboxes[dataId] = [];
  return Promise.resolve(sd_tx_inboxes[dataId]);
}

export const checkOwnership = (coinId, pk) => {
  console.log("Reading coin info...", pk, coinId);
  let data = sd_coins[coinId];
  console.log("Coin data:", data);
  if (data.owner !== pk) {
      throw Error ("Ownership doesn't match", pk, data);
  }

  return Promise.resolve(data);
}

export const appendTx2TxInbox = (recipient, tx) => {
  let recipientInbox = getXorName(WALLET_INBOX_PREFIX + recipient);
  if (sd_tx_inboxes[recipientInbox]) {
    sd_tx_inboxes[recipientInbox].push(tx);
  } else {
    sd_tx_inboxes[recipientInbox] = [tx];
  }
}

export const transferCoin = (coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in memory...", coinId, recipient);

  let wallet = sd_wallets[getXorName(pk)];
  // let's check if the coinId is found in the wallet
  let index = wallet.indexOf(coinId);
  if (index >= 0 && checkOwnership(coinId, pk)) {
    // ok, let's make the transfer now
    // change ownership
    sd_coins[coinId].owner = recipient;
    sd_coins[coinId].prev_owner = pk;
  } else {
    console.error("Error, coin is not owned");
  }

  return Promise.resolve(wallet);
}
