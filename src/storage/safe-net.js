/* Conditionally load modules for SAFEnet or mock */
module.exports = (process.env.REACT_APP_SAFENET_OFF === "1")
  ? {
    storage: require('../storage/storage-mock.js'),
    altcoinWallet: require('../storage/altcoin-wallet-mock.js')
  }
  : {
    storage: require('../storage/storage.js'),
    altcoinWallet: require('safe-coins-wallet')
  };
