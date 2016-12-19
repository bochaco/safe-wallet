/*
  Helper functions to store data in memory needed for demos and dev tasks
*/
import {sample_wallet_data} from './sample-data.js';
var data = sample_wallet_data;

export const authoriseApp = (app) => {
  console.log("Authenticating app...");
  return new Promise(resolve => setTimeout(resolve, 3000));
}

export const isTokenValid = () => {
  return Promise.resolve(true);
}

export const loadData = () => {
  console.log("Reading the data into memory...");
  return Promise.resolve(data);
}

export const saveData = (data) => {
  console.log("Saving data in memory...");
  data = data.slice();
  return Promise.resolve(data);
}
