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
 * Helper functions to mimic altcoin-wallet in memory
 * needed for demos and dev tasks
 */
import { genTxId } from '../common.js';
import { getXorName, sample_wallets, sample_tx_inboxes,
         sample_coins, sample_webids } from './sample-data.js';

export const loadWalletData = async (_, wallet) => {
  console.log("Reading the coin wallet into memory...");
  return sample_wallets[wallet] || [];
}

export const createWallet = async (_, pk) => {
  let xorName = getXorName(pk);
  console.log("Creating wallet in memory...", pk, xorName);
  if (!sample_wallets[xorName]) {
    sample_wallets[xorName] = [];
  }
  return sample_wallets[xorName];
}

export const storeCoinsToWallet = async (_, wallet, data) => {
  console.log("Saving coin wallet data in memory...");
  sample_wallets[wallet] = data;
}

export const createTxInbox = async (_, pk) => {
  let xorName = getXorName(pk);
  console.log("Creating TX inbox in memory...", pk, xorName);
  if (!sample_tx_inboxes[xorName]) {
    sample_tx_inboxes[xorName] = [];
  }
  return { pk, sk: null };
}

export const readTxInboxData = async (_, pk, encPk, encSk) => {
  let xorName = getXorName(pk);
  console.log("Reading TX inbox in memory...", pk, xorName);
  if (!sample_tx_inboxes[xorName]) {
    sample_tx_inboxes[xorName] = [];
  }

  return sample_tx_inboxes[xorName];
}

export const removeTxInboxData = async (_, pk, txs) => {
  let xorName = getXorName(pk);
  console.log("Removing TXs from TX inbox in memory...", pk);
  if (!sample_tx_inboxes[xorName]) {
    sample_tx_inboxes[xorName] = [];
  }
  let tx_inbox = sample_tx_inboxes[xorName];
  txs.forEach((tx) => {
    const index = tx_inbox.find((elem) => elem.id === tx.id);
    tx_inbox.splice(index, 1);
  })
}

export const checkOwnership = async (_, coinId, pk) => {
  console.log("Reading coin info...", pk, coinId);
  let data = sample_coins[coinId];
  console.log("Coin data:", data);
  if (data.owner !== pk) {
      throw Error("Ownership doesn't match", pk, data);
  }

  return data;
}

const resolveWebId = (str) => {
  let wallet = str;
  // if string is a WebID resolve wallet location
  if (str.toLowerCase().startsWith('safe://')) {
    console.log("Recipient is a WebID, resolving wallet for:", str);
    wallet = sample_webids[str].wallet;
  }
  return wallet;
}

export const sendTxNotif = async (_, recipient, coinIds, msg) => {
  let recipientInbox = getXorName(resolveWebId(recipient));
  let id = genTxId();
  let tx = {
    id,
    coinIds: coinIds,
    msg: msg,
    date: (new Date()).toUTCString()
  }

  if (sample_tx_inboxes[recipientInbox]) {
    sample_tx_inboxes[recipientInbox].push(tx);
  } else {
    sample_tx_inboxes[recipientInbox] = [tx];
  }
}

export const transferCoin = async (_, coinId, pk, sk, recipient) => {
  console.log("Transfering coin's ownership in memory...", coinId, recipient);
  let wallet = sample_wallets[getXorName(pk)];
  // let's check if the coinId is found in the wallet
  let index = wallet.indexOf(coinId);
  if (index >= 0) {
    return checkOwnership(_, coinId, pk)
      .then(() => {
        // ok, let's make the transfer now
        // change ownership
        sample_coins[coinId].owner = resolveWebId(recipient);
        sample_coins[coinId].prev_owner = pk;
        return sample_coins[coinId].owner;
      })
  }
  throw Error("Error: coin is not owned");
}

export const updateLinkInWebId = async (_, webId, txInboxPk) => {
  console.log("Updating link in WebID in memory...", webId, txInboxPk);
  sample_webids[webId].wallet = txInboxPk;
}
