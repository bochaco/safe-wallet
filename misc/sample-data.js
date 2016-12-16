/* type: 0=Credit Card, 1=Password, 2=Priv/Pub Key, 3=2FA Codes */

const file_content =
[
  {id: 10, type: 0, index: 1, label: "My prepaid VISA card from Bank 'A'",
    data: {
      ccv: "987",
      pin: "1234",
      number: "[1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]",
      name: "CARDHOLDER NAME",
      expiry_month: 7,
      expiry_year: 2020,
      issuer: "BSBC",
      network: "VISA",
    }
  },
  {id: 20, type: 1, index: 2, label: "Bank 'A' Homebanking",
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
  {id: 12, type: 2, index: 3, label: "Bitcoin savings",
    data: {
      pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
      sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
      notes: "balance as of 12/15/2016 = $50.50"
    }
  },
  {id: 17, type: 2, index: 4, label: "Ethereum keys",
    data: {
      pk: "1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4",
      sk: "L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav",
      notes: "current balance 10 eth, received all from donations"
    }
  },
  {id:  4, type: 4, index: 5, label: "Safecoin wallet for trip",
    data: {}
  },
  {id: 14, type: 3, index: 6, label: "Bank 'A' 2FA emergency codes",
    data: [
      123456, 987654, 123456, 987654, 123456, 987654, 123456, 987654, 123456, 987654
    ]
  },
  {id: 23, type: 1, index: 7, label: "myusername@gmail.com",
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

exports.file_content = file_content;
