import React from 'react';
import TextField from 'material-ui/TextField';
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
                Security Code: {this.props.selected_item.data.cvv}
              </Header.Content>
            </Header>
            <Header>
              <Icon name='payment' color="brown" />
              <Header.Content>
                PIN: {this.props.selected_item.data.pin}
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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.refs.colorAndLabelInput) {
      this.refs.colorAndLabelInput.refs.labelInput.input.focus();
    }
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_CREDIT_CARD,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.input.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: {
        cvv: this.refs.cvvInput.input.value,
        pin: this.refs.pinInput.input.value,
        number: this.refs.numberInput.input.value,
        name: this.refs.nameInput.input.value,
        expiry_month: this.refs.monthInput.input.value,
        expiry_year: this.refs.yearInput.input.value,
        issuer: this.refs.issuerInput.input.value,
        network: this.refs.networkInput.input.value,
      }
    }
    this.props.handleSubmit(updatedItem);
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
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <TextField
                style={styles.customWidth}
                floatingLabelText="Network/Type"
                defaultValue={this.props.selected_item.data.network}
                ref='networkInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={5}>
              <TextField
                fullWidth={true}
                floatingLabelText="Issuer"
                defaultValue={this.props.selected_item.data.issuer}
                ref='issuerInput'
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column width={6}>
              <TextField
                fullWidth={true}
                floatingLabelText="Number"
                defaultValue={this.props.selected_item.data.number}
                ref='numberInput'
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
                      floatingLabelText="Expiry month"
                      defaultValue={this.props.selected_item.data.expiry_month}
                      ref='monthInput'
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
                      floatingLabelText="Expiry year"
                      defaultValue={this.props.selected_item.data.expiry_year}
                      ref='yearInput'
                    />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={4}>
            <Grid.Column width={6}>
              <TextField
                floatingLabelText="Cardholder's Name"
                defaultValue={this.props.selected_item.data.name}
                ref='nameInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                floatingLabelText="CVV"
                defaultValue={this.props.selected_item.data.cvv}
                ref='cvvInput'
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                floatingLabelText="PIN"
                defaultValue={this.props.selected_item.data.pin}
                ref='pinInput'
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
