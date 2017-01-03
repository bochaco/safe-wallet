/* Sample data only for testing or dev tasks */
import { Constants, getXorName } from '../common.js';

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

export const sample_SD_tx_inboxes = {};

export const sample_SD_wallets = {};
// wallet of Me.pk
sample_SD_wallets[ME_PK_XOR_NAME] = [
  ALTCOIN_1_XOR_NAME,
  ALTCOIN_2_XOR_NAME,
  ALTCOIN_3_XOR_NAME,
];

export const sample_SD_coins = {};
// altcoin1 SD
sample_SD_coins[ALTCOIN_1_XOR_NAME] = {
    type_tag: 15001,
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Alice.pk,
}

// altcoin2 SD
sample_SD_coins[ALTCOIN_2_XOR_NAME] = {
    type_tag: 15001,
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Alice.pk,
}

// altcoin3 SD
sample_SD_coins[ALTCOIN_3_XOR_NAME] = {
    type_tag: 15001,
    owner: SampleKeyPairs.Me.pk,
    prev_owner: SampleKeyPairs.Bob.pk,
}

export const sample_wallet_data =
[
  {id: 28, type: Constants.TYPE_ALTCOIN,
    metadata: {
      label: "My mined AltCoins",
      color: "blue",
      pin: "1234",
      keepTxs: true,
    },
    data: {
      pk: SampleKeyPairs.Me.pk,
      sk: SampleKeyPairs.Me.sk,
      history: [ // this could be part of the coin wallet
        {
          amount: 0.35725250,
          direction: "out",
          date: "60 days ago",
          from: SampleKeyPairs.Alice.pk,
        },
        {
          amount: 0.18462538,
          direction: "in",
          date: "25 days ago",
          from: SampleKeyPairs.Bob.pk,
          msg: "loan",
        },
        {
          amount: 0.97274604,
          direction: "out",
          date: "14 days ago",
          from: SampleKeyPairs.Chris.pk,
          msg: "",
        },
        {
          amount: 0.68274068,
          direction: "in",
          date: "8 days ago",
          from: SampleKeyPairs.Alice.pk,
          msg: "SAFE Farming",
        },
        {
          amount: 0.95055028,
          direction: "in",
          date: "2 days ago",
          from: SampleKeyPairs.Alice.pk,
          msg: "help with SAFEnet dlfkmdklf dlkfm sdlfmf lf ksm fsdfm lfkmsdklf sdklfm lfklsdfmlk sdkl",
        },
      ]
    }
  },
  {id: 30, type: Constants.TYPE_ALTCOIN,
    metadata: {
      label: "AltCoins for daily usage",
      color: "blue",
      pin: "1234",
      keepTxs: true,
    },
    data: {
      pk: SampleKeyPairs.Bob.pk,
      sk: SampleKeyPairs.Bob.sk,
      history: [] // this could be part of the coin wallet
    }
  },
  {id: 10, type: Constants.TYPE_CREDIT_CARD,
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
  },
  {id: 20, type: Constants.TYPE_PASSWORD,
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
  },
  {id: 12, type: Constants.TYPE_PRIV_PUB_KEY,
    metadata: {
      label: "Bitcoin savings",
      color: "yellow",
    },
    data: {
      pk: SampleKeyPairs.Me.pk,
      sk: SampleKeyPairs.Me.sk,
      notes: "balance as of 12/15/2016 = $50.50"
    }
  },
  {id: 17, type: Constants.TYPE_PRIV_PUB_KEY,
    metadata: {
      label: "Ethereum keys",
      color: "yellow",
    },
    data: {
      pk: SampleKeyPairs.Me.pk,
      sk: SampleKeyPairs.Me.sk,
      notes: "current balance 10 eth, received all from donations"
    }
  },
  {id: 4, type: Constants.TYPE_SAFECOIN,
    metadata: {
      label: "Safecoin wallet for trip",
      color: "blue",
    },
    data: {}
  },
  {id: 14, type: Constants.TYPE_2FA_CODES,
    metadata: {
      label: "Bank 'A' 2FA emergency codes",
      color: "violet",
    },
    data: [
      123456, 287654, 323456, 487654, 523456, 687654, 723456, 887654, 923456, 107654
    ]
  },
  {id: 23, type: Constants.TYPE_PASSWORD,
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
  },
];

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
