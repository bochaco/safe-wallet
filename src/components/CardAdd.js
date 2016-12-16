import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { List, Image } from 'semantic-ui-react'

import icon_cc from '../img/credit_card.jpg';
import icon_pwd from '../img/password.jpg';
import icon_qr from '../img/qr_code.png';
import icon_2fa from '../img/2fa.png';
import icon_safecoin from '../img/safecoin.png';

const customContentStyle = {
  width: '30%',
  maxWidth: 'none',
  textAlign: 'center',
};

const ItemTypesEnum = {
  CreditCard: 0,
  Password: 1,
  PrivPubKey: 2,
  TwoFACodes: 3,
  SafecoinWallet: 4,
  Notes: 5,
  Contatcs: 6
};

export default class CardAdd extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
    ];

    const options = [
      {type: ItemTypesEnum.CreditCard, icon: icon_cc, text: "Credit Card"},
      {type: ItemTypesEnum.Password, icon: icon_pwd, text: "Password"},
      {type: ItemTypesEnum.PrivPubKey, icon: icon_qr, text: "Priv/Pub Key"},
      {type: ItemTypesEnum.TwoFACodes, icon: icon_2fa, text: "2FA Codes"},
      {type: ItemTypesEnum.SafecoinWallet, icon: icon_safecoin, text: "Safecoin Wallet"},
    ];

    return (
      <div>
        <Dialog
          title="Type of the item to add?"
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
          <List selection size='large' animated verticalAlign='middle'>
            {options.map((option, index) => (
                <List.Item key={index}
                  onClick={() => {this.props.handleSubmit(option.type)}}>
                  <Image size='mini' src={option.icon} />
                  <List.Content>
                    <List.Header>{option.text}</List.Header>
                  </List.Content>
                </List.Item>
            ))}
          </List>
        </Dialog>
      </div>
    );
  }
}
