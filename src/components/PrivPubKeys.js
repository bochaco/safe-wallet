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
import TextField from '@material-ui/core/TextField';
import { Grid, Image, Header, Container } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { getQRCode } from '../common.js';
import { ColorAndLabel } from './Common.js';

export default class PrivPubKeysView extends React.Component {
  render() {
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column width={3}>
            <Header as='h4'>{this.props.i18nStrings.item_pk}</Header>
          </Grid.Column>
          <Grid.Column width={10}>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as='h4'>{this.props.i18nStrings.item_sk}</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={3}>
            <Image src={getQRCode(this.props.selected_item.data.pk)} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as='h5' color='green'>
              {this.props.selected_item.data.pk}
              <Header.Subheader>
                {this.props.selected_item.data.sk}
              </Header.Subheader>
            </Header>
            <Container textAlign='left'>
              <Header as='h4'>{this.props.i18nStrings.item_tx_notes}:</Header>
              {this.props.selected_item.data.notes}
            </Container>
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src={getQRCode(this.props.selected_item.data.sk)} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export class PrivPubKeysEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pk: this.props.selected_item.data.pk,
      sk: this.props.selected_item.data.sk,
      notes: this.props.selected_item.data.notes,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PRIV_PUB_KEY,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.props.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: {
        pk: this.state.pk,
        sk: this.state.sk,
        notes: this.state.notes,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  handleChange = name => event => {
    this.setState( { [name]: event.target.value } );
  };

  render() {
    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_PRIV_PUB_KEY}
        handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_label}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_pk}
                value={this.state.pk}
                onChange={this.handleChange('pk')}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_sk}
                value={this.state.sk}
                onChange={this.handleChange('sk')}
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                // TODO: multiLine
                label={this.props.i18nStrings.item_tx_notes}
                value={this.state.notes}
                onChange={this.handleChange('notes')}
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </EditDialogBox>
    );
  }
}

PrivPubKeysEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
