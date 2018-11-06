/* Sample data only for testing or dev tasks */
import crypto from 'crypto';
import { Constants } from '../common.js';

const anitaImage = "data:image/jpeg;base64,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";

export const sample_webids = {
  "safe://webid.anita#me": {
      nick: "anita",
      image: anitaImage,
      wallet: null
    },
  "safe://webid.bochaco#me": {
      nick: "bochaco",
      image: "",
      wallet: null
    }
};

export const getXorName = (id) => {
  return crypto.createHash('sha256').update(id).digest('base64');
}

const SampleKeyPairs = {
  Me: {
    pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
    sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
  },
  Alice: {
    pk: "15iJ91Px9ng5E7r5xPv8x3QpPMUu8q1JAR",
    sk: "L19ZnKjrZNLHCXWTGzvpfJrA8yXTFJHf4mwVzGukobBJR2giCjsx",
  },
  Bob: {
    pk: "1Kt7eE4y7D2ciidW6ANiGVnKQaYmWgeZnc",
    sk: "KxAMW2EVA3qVDHdJWw5vH71Ene1Ji9xYN6ncwfsXdje8wzJ6CqMK",
  },
  Chris: {
    pk: "1Eup55KofQRtBk1xS48LZs4RPYW2x8bgg5",
    sk: "L25RDnqL2yYc1iUZqz5vUJhQ7aDFQQZbGwSunzkt7FtybcWvFL5V",
  },
  Mike: {
    pk: "1MAEoWiLC5Aq38aRPHG8zR8fPYHYTSESKe",
    sk: "L5QrF13Dts1FVQYkmfqagLoqKbf1nu5D2KhQv9vd751X7yiWzbSD",
  },
};

const ME_PK_XOR_NAME = getXorName(SampleKeyPairs.Me.pk);
const ALTCOIN_1_XOR_NAME = getXorName("altcoin1");
const ALTCOIN_2_XOR_NAME = getXorName("altcoin2");
const ALTCOIN_3_XOR_NAME = getXorName("altcoin3");

export const sample_tx_inboxes = {};

export const sample_wallets = {};
// wallet of Me.pk
sample_wallets[ME_PK_XOR_NAME] = [
  ALTCOIN_1_XOR_NAME,
  ALTCOIN_2_XOR_NAME,
  ALTCOIN_3_XOR_NAME,
];

export const sample_coins = {};
// altcoin1
sample_coins[ALTCOIN_1_XOR_NAME] = {
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Alice.pk,
}

// altcoin2
sample_coins[ALTCOIN_2_XOR_NAME] = {
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Alice.pk,
}

// altcoin3
sample_coins[ALTCOIN_3_XOR_NAME] = {
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Bob.pk,
}

export const sample_wallet_data = {
  '28': {
    id: 28,
    version: 0,
    content: {
      type: Constants.TYPE_ALTCOIN, lastUpdate: "Sun, 01 Jan 2017 00:01:30 GMT",
      metadata: {
        label: "ThanksCoins from faucet",
        color: "blue",
        pin: "",
        keepTxs: true,
      },
      data: {
        webid_linked: "safe://webid.anita#me",
        wallet: sample_wallets[ME_PK_XOR_NAME],
        tx_inbox_pk: SampleKeyPairs.Me.pk,
        tx_inbox_sk: SampleKeyPairs.Me.sk,
        pk: SampleKeyPairs.Me.pk,
        sk: SampleKeyPairs.Me.sk,
        history: [ // this could be part of the coin wallet
          {
            amount: 3,
            direction: "in",
            date: "Sun, 01 Jan 2017 00:01:30 GMT",
            from: SampleKeyPairs.Alice.pk,
            msg: "ThanksCoin miner",
          },
          {
            amount: 2,
            direction: "out",
            date: "Sun, 01 Jan 2017 10:12:04 GMT",
            to: SampleKeyPairs.Alice.pk,
          },
          {
            amount: 1,
            direction: "in",
            date: "Sun, 01 Jan 2017 19:25:19 GMT",
            from: SampleKeyPairs.Bob.pk,
            msg: "ThanksCoin miner",
          },
          {
            amount: 1,
            direction: "out",
            date: "Mon, 02 Jan 2017 14:48:01 GMT",
            to: SampleKeyPairs.Bob.pk,
            msg: "Thank you for the loan!",
          },
          {
            amount: 2,
            direction: "in",
            date: "Tue, 03 Jan 2017 15:34:33 GMT",
            from: SampleKeyPairs.Alice.pk,
            msg: "In exchange of your feedback about SAFE Wallet!",
          },
        ]
      }
    }
  },
  '30': {
    id: 30,
    version: 0,
    content: {
      type: Constants.TYPE_ALTCOIN,
      metadata: {
        label: "ThanksCoins for daily usage",
        pin: "",
        keepTxs: true,
      },
      data: {
        webid_linked: null,
        wallet: [],
        tx_inbox_pk: SampleKeyPairs.Bob.pk,
        tx_inbox_sk: SampleKeyPairs.Bob.sk,
        pk: SampleKeyPairs.Bob.pk,
        sk: SampleKeyPairs.Bob.sk,
        history: [] // this could be part of the coin wallet
      }
    }
  },
  '10': {
    id: 10,
    version: 0,
    content: {
      type: Constants.TYPE_CREDIT_CARD, lastUpdate: "Sun, 01 Jan 2017 00:01:30 GMT",
      metadata: {
        label: "My prepaid VISA card from Bank 'A'",
        color: "brown",
      },
      data: {
        cvv: "987",
        pin: "1234",
        number: "1234567812345678",
        name: "CARDHOLDER NAME",
        expiry_month: 3,
        expiry_year: 2020,
        issuer: "BSBC",
        network: "VISA",
      }
    }
  },
  '20': {
    id: 20,
    version: 0,
    content: {
      type: Constants.TYPE_PASSWORD, lastUpdate: "Sun, 01 Jan 2017 00:01:30 GMT",
      metadata: {
        label: "Bank 'A' Homebanking",
        color: "red",
      },
      data: {
        username: "bankusername",
        password: "password1234",
        questions: [
          {q: "What is your favorite city?", a: "London"},
          {q: "What is the name of your first school?", a: "Public School"},
          {q: "Who are you?", a: "A random guy"},
          {q: "Name of your great grand father?", a: "Dunno"},
          {q: "Name of your street?", a: "Alley"}
        ]
      }
    }
  },
  '12': {
    id: 12,
    version: 0,
    content: {
      type: Constants.TYPE_PRIV_PUB_KEY, lastUpdate: "Sun, 01 Jan 2017 00:01:30 GMT",
      metadata: {
        label: "Bitcoin savings",
        color: "yellow",
      },
      data: {
        pk: SampleKeyPairs.Me.pk,
        sk: SampleKeyPairs.Me.sk,
        notes: "balance as of 12/15/2016 = $50.50"
      }
    }
  },
  '17': {
    id: 17,
    version: 0,
    content: {
      type: Constants.TYPE_PRIV_PUB_KEY,
      metadata: {
        label: "Ethereum keys",
        color: "yellow",
      },
      data: {
        pk: SampleKeyPairs.Me.pk,
        sk: SampleKeyPairs.Me.sk,
        notes: "current balance 10 eth, received all from donations"
      }
    }
  },
  '4': {
    id: 4,
    version: 0,
    content: {
      type: Constants.TYPE_SAFECOIN,
      metadata: {
        label: "Safecoin wallet for trip",
        color: "blue",
      },
      data: {}
    }
  },
  '14': {
    id: 14,
    version: 0,
    content: {
      type: Constants.TYPE_2FA_CODES,
      metadata: {
        label: "Bank 'A' 2FA emergency codes",
        color: "violet",
      },
      data: [
        123456, 287654, 323456, 487654, 523456, 687654, 723456, 887654, 923456, 107654
      ]
    }
  },
  '23': {
    id: 23,
    version: 0,
    content: {
      type: Constants.TYPE_PASSWORD,
      metadata: {
        label: "myusername@gmail.com",
        color: "red",
      },
      data: {
        username: "myusername",
        password: "password9876",
        questions: [
          {q: "What is your favorite car?", a: "None"},
          {q: "What is the name of your pet?", a: "Never had"}
        ]
      }
    }
  },
};

/*
{id: 27, type: Constants.TYPE_JCARD,
  metadata: {
    label: "My profile for friends",
    color: "blue",
  },
  data: [
    "BubaGump",
    // The jcard attribute shoud not be here since it's a SD/MD
    [
      "vcard",
      [
        ["version", {}, "text", "4.0"],
        ["fn", {}, "text", "Forrest Gump"],
        ["email", {}, "text", "forrestgump@example.com"],
        ["x-wallet-addr", {
            "type": [ "SAFE-ALTCOIN1" ]
          }, "text", SampleKeyPairs.Me.pk
        ],
        ["rev", {}, "timestamp", "2008-04-24T19:52:43Z"]
      ]
    ]
  ]
},
*/
