/* Sample data only for testing or dev tasks */
import { Constants } from '../common.js';

export const sample_wallet_data =
[
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
      pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
      sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
      notes: "balance as of 12/15/2016 = $50.50"
    }
  },
  {id: 17, type: Constants.TYPE_PRIV_PUB_KEY,
    metadata: {
      label: "Ethereum keys",
      color: "yellow",
    },
    data: {
      pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
      sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
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
  {id: 27, type: Constants.TYPE_JCARD,
    metadata: {
      label: "My profile for friends",
      color: "blue",
    },
    data: [
      "BubaGump",
      /* The jcard attribute shoud not be here since it's a SD/MD */
      [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", "Forrest Gump"],
          ["email", {}, "text", "forrestgump@example.com"],
          ["x-wallet-addr", {
              "type": [ "SAFE-ALTCOIN1" ]
            }, "text", "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4"
          ],
          ["rev", {}, "timestamp", "2008-04-24T19:52:43Z"]
        ]
      ]
    ]
  },
  {id: 28, type: Constants.TYPE_ALTCOIN,
    metadata: {
      label: "My mined AltCoins",
      color: "blue",
    },
    data: {
      pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
      sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
      coins: [
        "OWNmNGI3Mjk5M2E1ZGI4NGI4OTIwZDk0ZThmZWFhMzk0NWUzNzJjMTdjM2E0ZWIxNDlmYmQzZmE2NzJmYzcxZA==", // "altcoin1"
        "NTIzNDFhOTUwMjVlNDgyNzAyNWE2N2NjMTU2ODdlMjQ2MmEyNTM1MGRiZWZmNDhkYjczNzFkMWUyZDEyN2I5OA==", // "altcoin2"
        "ODU5ZTc3MWE4Yjk5OGEyYTBkNDAwMGZlYjNjMzQ1ZmRmOGQwOTI4NjdjNDIyNmFiNDUwZmFlMTdiYzAyYWEzZg==", // "altcoin3"
      ],
      history: [
        {
          amount: 0.95055028,
          direction: "in",
          date: "2 days ago",
          from: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
        },
        {
          amount: 0.68274068,
          direction: "in",
          date: "8 days ago",
          from: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
        },
        {
          amount: 0.97274604,
          direction: "out",
          date: "14 days ago",
          from: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
        },
        {
          amount: 0.18462538,
          direction: "in",
          date: "25 days ago",
          from: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
        },
        {
          amount: 0.35725250,
          direction: "out",
          date: "60 days ago",
          from: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
        }
      ]
    }
  },
];
