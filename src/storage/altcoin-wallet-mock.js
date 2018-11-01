/*
  Helper functions to mimic altcoin-wallet in memory needed for demos and dev tasks
*/
import { genTxId } from '../common.js';
import { getXorName, sample_wallets,
         sample_tx_inboxes, sample_coins } from './sample-data.js';

var wallets = sample_wallets;
var tx_inboxes = sample_tx_inboxes;
var coins = sample_coins;

export const loadWalletData = (_, wallet) => {
  console.log("Reading the coin wallet into memory...");
  if (!wallet) {
    wallet = [];
  }
  return Promise.resolve(wallet);
}

export const createWallet = (_, pk) => {
  let xorName = getXorName(pk);
  console.log("Creating wallet in memory...", pk, xorName);
  if (!wallets[xorName]) {
    wallets[xorName] = [];
  }
  return Promise.resolve(wallets[xorName]);
}

export const storeCoinsToWallet = (_, wallet, data) => {
  console.log("Saving coin wallet data in the network...");
  return Promise.resolve(data);
}

export const createTxInbox = (_, pk) => {
  let xorName = getXorName(pk);
  console.log("Creating TX inbox in memory...", pk, xorName);
  if (!tx_inboxes[xorName]) {
    tx_inboxes[xorName] = [];
  }
  return Promise.resolve({pk, sk: null});
}

export const readTxInboxData = (_, pk, encPk, encSk) => {
  let xorName = getXorName(pk);
  console.log("Reading TX inbox in memory...", pk, xorName);
  if (!tx_inboxes[xorName]) {
    tx_inboxes[xorName] = [];
  }

  return Promise.resolve(tx_inboxes[xorName]);
}

export const removeTxInboxData = (_, pk, txs) => {
  let xorName = getXorName(pk);
  console.log("Removing TXs from TX inbox in memory...", pk);
  if (!tx_inboxes[xorName]) {
    tx_inboxes[xorName] = [];
  }
  let tx_inbox = tx_inboxes[xorName];
  txs.forEach((tx) => {
    const index = tx_inbox.find((elem) => elem.id === tx.id);
    tx_inbox.splice(index, 1);
  })
  return Promise.resolve();
}

export const checkOwnership = (_, coinId, pk) => {
  console.log("Reading coin info...", pk, coinId);
  let data = coins[coinId];
  console.log("Coin data:", data);
  if (data.owner !== pk) {
      throw Error ("Ownership doesn't match", pk, data);
  }

  return Promise.resolve(data);
}

export const sendTxNotif = (_, pk, coinIds, msg) => {
  let recipientInbox = getXorName(pk);
  let id = genTxId();
  let tx = {
    id,
    coinIds: coinIds,
    msg: msg,
    date: (new Date()).toUTCString()
  }

  if (tx_inboxes[recipientInbox]) {
    tx_inboxes[recipientInbox].push(tx);
  } else {
    tx_inboxes[recipientInbox] = [tx];
  }
}

export const transferCoin = (_, coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in memory...", coinId, recipient);

  let wallet = sample_wallets[getXorName(pk)];
  // let's check if the coinId is found in the wallet
  let index = wallet.indexOf(coinId);
  if (index >= 0) {
    return checkOwnership(_, coinId, pk)
      .then(() => {
        // ok, let's make the transfer now
        // change ownership
        coins[coinId].owner = recipient;
        coins[coinId].prev_owner = pk;
        return Promise.resolve();
      })
  }
  return Promise.reject("Error: coin is not owned");
}
