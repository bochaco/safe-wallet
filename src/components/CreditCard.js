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
import { Grid, Image, Header, Icon, List } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

import img_credit_card_view from '../img/credit_card3.jpg';

const styles = {
  customWidth: {
    width: 100,
  },
  tinyWidth: {
    width: 90,
  },
};

export default class CreditCardView extends React.Component {
  render() {
    return (
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Image src={img_credit_card_view} />
          </Grid.Column>
          <Grid.Column>
            <br/>
            <Header>
              <Icon name='protect' color="brown" />
              <Header.Content>
                {this.props.i18nStrings.item_credit_card_security_code}: {this.props.selected_item.data.cvv}
              </Header.Content>
            </Header>
            <Header>
              <Icon name='payment' color="brown" />
              <Header.Content>
                {this.props.i18nStrings.item_pin}: {this.props.selected_item.data.pin}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export class CreditCardEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      network: this.props.selected_item.data.network,
      issuer: this.props.selected_item.data.issuer,
      number: this.props.selected_item.data.number,
      month: this.props.selected_item.data.expiry_month,
      year: this.props.selected_item.data.expiry_year,
      name: this.props.selected_item.data.name,
      cvv: this.props.selected_item.data.cvv,
      pin: this.props.selected_item.data.pin,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_CREDIT_CARD,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.props.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: {
        cvv: this.state.cvv,
        pin: this.state.pin,
        number: this.state.number,
        name: this.state.name,
        expiry_month: this.state.month,
        expiry_year: this.state.year,
        issuer: this.state.issuer,
        network: this.state.network,
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
          type={Constants.TYPE_CREDIT_CARD}
          handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row columns={5}>
            <Grid.Column width={8}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_label}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <TextField
                style={styles.customWidth}
                label={this.props.i18nStrings.item_credit_card_type}
                value={this.state.network}
                onChange={this.handleChange('network')}
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={5}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_credit_card_issuer}
                value={this.state.issuer}
                onChange={this.handleChange('issuer')}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column width={6}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_credit_card_number}
                value={this.state.number}
                onChange={this.handleChange('number')}
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={6}>
              <List horizontal>
                <List.Item>
                  <List.Content>
                    <TextField
                      style={styles.tinyWidth}
                      label={this.props.i18nStrings.item_credit_card_expiry_month}
                      value={this.state.month}
                      onChange={this.handleChange('month')}
                    />
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>/</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <TextField
                      style={styles.customWidth}
                      label={this.props.i18nStrings.item_credit_card_expiry_year}
                      value={this.state.year}
                      onChange={this.handleChange('year')}
                    />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={4}>
            <Grid.Column width={6}>
              <TextField
                label={this.props.i18nStrings.item_credit_card_cardholder}
                value={this.state.name}
                onChange={this.handleChange('name')}
              />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                label={this.props.i18nStrings.item_credit_card_cvv}
                value={this.state.cvv}
                onChange={this.handleChange('cvv')}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                label={this.props.i18nStrings.item_pin}
                value={this.state.pin}
                onChange={this.handleChange('pin')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </EditDialogBox>
    );
  }
}

CreditCardEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
