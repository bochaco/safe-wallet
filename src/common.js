import React from 'react';
import CreditCardView, { CreditCardEdit } from './components/CreditCard.js';
import JCardView, { JCardEdit } from './components/JCard.js';
import PasswordView, { PasswordEdit } from './components/Password.js';
import PrivPubKeysView, { PrivPubKeysEdit } from './components/PrivPubKeys.js';
import TwoFACodesView, { TwoFACodesEdit } from './components/TwoFACodes.js';
import SafecoinView, { SafecoinEdit } from './components/Safecoin.js';
import AltCoinView, { AltCoinEdit } from './components/AltCoin.js';

import icon_cc from './img/credit_card.jpg';
import icon_pwd from './img/password.jpg';
import icon_qr from './img/qr_code.png';
import icon_2fa from './img/2fa.png';
import icon_safecoin from './img/safecoin.png';
import icon_altcoin from './img/altcoin.png';
import icon_jcard from './img/jcard.png';

export const Constants = {
  TYPE_CREDIT_CARD: 0,
  TYPE_PASSWORD: 1,
  TYPE_PRIV_PUB_KEY: 2,
  TYPE_2FA_CODES: 3,
  TYPE_SAFECOIN: 4,
  TYPE_NOTES: 5,
  TYPE_CONTACTS: 6,
  TYPE_ALTCOIN: 7,
  TYPE_JCARD: 8,

  MAX_NUMBER_2FA_CODES: 12,
}

export const ItemTypes = {};

ItemTypes[Constants.TYPE_CREDIT_CARD] = {
  type: Constants.TYPE_CREDIT_CARD,
  title: "Credit Card",
  icon: icon_cc,
  editDialogFactory: (props) => <CreditCardEdit {...props} />,
  viewDialogFactory: (props) => <CreditCardView {...props} />,
};

ItemTypes[Constants.TYPE_PASSWORD] = {
  type: Constants.TYPE_PASSWORD,
  title: "Password",
  icon: icon_pwd,
  editDialogFactory: (props) => <PasswordEdit {...props} />,
  viewDialogFactory: (props) => <PasswordView {...props} />,
};

ItemTypes[Constants.TYPE_PRIV_PUB_KEY] = {
  type: Constants.TYPE_PRIV_PUB_KEY,
  title: "Priv/Pub Key",
  icon: icon_qr,
  editDialogFactory: (props) => <PrivPubKeysEdit {...props} />,
  viewDialogFactory: (props) => <PrivPubKeysView {...props} />,
};

ItemTypes[Constants.TYPE_2FA_CODES] = {
  type: Constants.TYPE_2FA_CODES,
  title: "2FA Codes",
  icon: icon_2fa,
  editDialogFactory: (props) => <TwoFACodesEdit {...props} />,
  viewDialogFactory: (props) => <TwoFACodesView {...props} />,
};

ItemTypes[Constants.TYPE_SAFECOIN] = {
  type: Constants.TYPE_SAFECOIN,
  title: "Safecoin Wallet",
  icon: icon_safecoin,
  editDialogFactory: (props) => <SafecoinEdit {...props} />,
  viewDialogFactory: (props) => <SafecoinView {...props} />,
};

ItemTypes[Constants.TYPE_ALTCOIN] = {
  type: Constants.TYPE_ALTCOIN,
  title: "AltCoin Wallet",
  icon: icon_altcoin,
  editDialogFactory: (props) => <AltCoinEdit {...props} />,
  viewDialogFactory: (props) => <AltCoinView {...props} />,
};

ItemTypes[Constants.TYPE_JCARD] = {
  type: Constants.TYPE_JCARD,
  title: "Public Profile",
  icon: icon_jcard,
  editDialogFactory: (props) => <JCardEdit {...props} />,
  viewDialogFactory: (props) => <JCardView {...props} />,
};

/*
ItemTypes[Constants.TYPE_NOTES] = {type: Constants.TYPE_NOTES, title: "Private Notes"};
ItemTypes[Constants.TYPE_CONTACTS] = {type: Constants.TYPE_CONTACTS, title: "Contacts"};
*/
