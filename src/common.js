import icon_cc from './img/credit_card.jpg';
import icon_pwd from './img/password.jpg';
import icon_qr from './img/qr_code.png';
import icon_2fa from './img/2fa.png';
import icon_safecoin from './img/safecoin.png';

export const Constants = {
  TYPE_CREDIT_CARD: 0,
  TYPE_PASSWORD: 1,
  TYPE_PRIV_PUB_KEY: 2,
  TYPE_2FA_CODES: 3,
  TYPE_SAFECOIN: 4,
  TYPE_NOTES: 5,
  TYPE_CONTACTS: 6,
  MAX_NUMBER_2FA_CODES: 12,
}

export const ItemTypes = {};
ItemTypes[Constants.TYPE_CREDIT_CARD] = {type: 0, title: "Credit Card", icon: icon_cc};
ItemTypes[Constants.TYPE_PASSWORD] = {type: 1, title: "Password", icon: icon_pwd};
ItemTypes[Constants.TYPE_PRIV_PUB_KEY] = {type: 2, title: "Priv/Pub Key", icon: icon_qr};
ItemTypes[Constants.TYPE_2FA_CODES] = {type: 3, title: "2FA Codes", icon: icon_2fa};
ItemTypes[Constants.TYPE_SAFECOIN] = {type: 4, title: "Safecoin Wallet", icon: icon_safecoin};
/*
ItemTypes[Constants.TYPE_NOTES] = {type: 5, title: "Private Notes"};
ItemTypes[Constants.TYPE_CONTACTS] = {type: 6, title: "Contacts"};
*/
