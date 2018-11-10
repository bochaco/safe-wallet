// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

import React from 'react';
import { TextField, FormHelperText } from '@material-ui/core';
import { Checkbox, Grid, Label, Dropdown, Modal } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

export default class AltCoinEdit extends React.Component {
  constructor(props) {
    super(props);

    const noWebIdIcon = { name: 'user x', color: 'teal' };
    const unlinked = {
      value: {
        id: this.props.i18nStrings.item_wallet_no_webid,
        noWebIdIcon
      },
      text: this.props.i18nStrings.item_wallet_no_webid,
      icon: noWebIdIcon,
      selected: false
    };
    let currentWebId = unlinked.value;
    const webIdOptions = this.props.webIds.map((webId) => {
      let item = {
        value: {
          id: webId['#me']['@id'],
          image: webId['#me']['image'],
        },
        text: `${webId['#me']['@id']} (${webId['#me']['nick']})`,
        image: { avatar: true, src: `${webId['#me']['image']}` },
      };

      if (item.value.id === this.props.selected_item.data.webid_linked) {
        currentWebId = item.value;
        item.selected = true;
      }

      return item;
    });

    this.webIdOptions = [ unlinked, ...webIdOptions ];

    this.state = {
      currentWebId,
      pk: this.props.selected_item.data.pk || '',
      sk: this.props.selected_item.data.sk,
      pin: '',
      pinConfirm: '',
      pinError: '',
      showUpdatingWebIDs: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeWebId = this.handleChangeWebId.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
  }

  handlePinChange = name => event => {
    this.setState( { pinError: '' } );
    this.handleChange(name)(event);
  }

  handlePkChange = event => {
    this.setState( { pkError: '' } );
    this.handleChange('pk')(event);
  }

  handleChange = name => event => {
    this.setState( { [name]: event.target.value } );
  };

  handleChangeWebId(event, data) {
    this.setState( { currentWebId: data.value } );
  }

  async handleSubmit() {
    if (this.state.pk.length === 0) {
      this.setState( { pkError: this.props.i18nStrings.msg_invalid_value } );
      return;
    }

    let newPin =  this.props.selected_item.metadata.pin ? this.props.selected_item.metadata.pin : '';
    if (this.state.pin.length > 0 || this.state.pinConfirm.length > 0) {
      if (this.state.pin !== this.state.pinConfirm) {
        this.setState( { pinError: this.props.i18nStrings.msg_invalid_pin } );
        return;
      } else {
        newPin = this.state.pin;
      }
    }

    const webid_linked = this.state.currentWebId.id !== this.props.i18nStrings.item_wallet_no_webid ?
                            this.state.currentWebId.id : null;
    const history = this.props.selected_item.data.history ? this.props.selected_item.data.history : []
    let updatedItem = {
      type: Constants.TYPE_ALTCOIN,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.props.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
        pin: newPin,
        keepTxs: this.refs.historyInput.state.checked,
      },
      data: {
        webid_linked,
        wallet: this.props.selected_item.data.wallet,
        tx_inbox_pk: this.props.selected_item.data.tx_inbox_pk,
        tx_inbox_sk: this.props.selected_item.data.tx_inbox_sk,
        pk: this.state.pk,
        sk: this.state.sk,
        history: this.refs.historyInput.state.checked ? history : [],
      }
    }

    if (!this.props.selected_item_id) {
      // Create the wallet and inbox based on the Public Key
      const wallet = await this.props.altcoinWallet.createWallet(this.props.safeApp, updatedItem.data.pk);
      const encKeys = await this.props.altcoinWallet.createTxInbox(this.props.safeApp, updatedItem.data.pk);
      updatedItem.data.wallet = wallet;
      updatedItem.data.tx_inbox_pk = encKeys.pk;
      updatedItem.data.tx_inbox_sk = encKeys.sk;
    }

    // link to WebID
    if (this.props.selected_item.data.webid_linked !== updatedItem.data.webid_linked) {
      this.setState( { showUpdatingWebIDs: true } );
      // if it was linked from a WebID
      if (this.props.selected_item.data.webid_linked) {
        // then remove link from curren WebID
        await this.props.altcoinWallet.updateLinkInWebId(this.props.safeApp, this.props.selected_item.data.webid_linked, null);
      }
      // if it's being linked to a new WebID
      if (updatedItem.data.webid_linked !== null) {
        // then add link to the new selected WebID
        await this.props.altcoinWallet.updateLinkInWebId(this.props.safeApp, updatedItem.data.webid_linked, updatedItem.data.pk);
      }
      this.setState( { showUpdatingWebIDs: false } );
    }

    await this.props.handleSubmit(updatedItem);
  };

  render() {
    const webIdDropdown = (
      <Dropdown
        options={this.webIdOptions}
        onChange={this.handleChangeWebId}
        trigger={
          <Label
            basic
            content={this.state.currentWebId.id}
            icon={this.state.currentWebId.noWebIdIcon}
            image={{
              src: this.state.currentWebId.image,
              avatar: true,
              spaced: 'right'
            }}
          />
        }
      />
    )

    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_ALTCOIN}
        handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_coin_wallet_label}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={8} textAlign='center' verticalAlign='bottom'>
              {webIdDropdown}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                label={`${this.props.i18nStrings.item_pk} / WebID`}
                value={this.state.pk}
                onChange={this.handlePkChange}
                disabled={this.props.selected_item.data.pk ? true : false}
              />
              <FormHelperText error>{this.state.pkError}</FormHelperText>
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_sk}
                value={this.state.sk}
                onChange={this.handleChange('sk')}
                disabled={this.props.selected_item.data.pk ? true : false}
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_set_pin}
                type='password'
                value={this.state.pin}
                onChange={this.handlePinChange('pin')}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                label={this.props.i18nStrings.item_confirm_pin}
                type='password'
                value={this.state.pinConfirm}
                onChange={this.handlePinChange('pinConfirm')}
              />
              <FormHelperText error>{this.state.pinError}</FormHelperText>
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={7} verticalAlign="middle">
              <Checkbox toggle
                label={this.props.i18nStrings.item_keep_tx_history}
                defaultChecked={this.props.selected_item.metadata.keepTxs}
                ref='historyInput'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          open={this.state.showUpdatingWebIDs}
          basic
          size="small"
          closeOnEscape="false"
          closeOnDimmerClick="false"
        >
          <Modal.Header style={{textAlign: 'center'}}>
            {this.props.i18nStrings.msg_updating_webids}
          </Modal.Header>
          <Modal.Content style={{textAlign: 'center'}}>
            {this.props.i18nStrings.msg_webid_auth}
          </Modal.Content>
          <Modal.Actions>
          </Modal.Actions>
        </Modal>
      </EditDialogBox>
    );
  }
}

AltCoinEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
