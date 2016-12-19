/*
  Helper functions to store data in memory needed for demos and dev tasks
*/
import {file_content} from '../misc/sample-data.js';
var data = file_content;

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
