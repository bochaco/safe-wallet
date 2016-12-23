import React from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Image, Header, Container } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

import img_pubkey from '../img/qr_pubkey.png';
import img_privkey from '../img/qr_privkey.png';

export default class PrivPubKeysView extends React.Component {
  render() {
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column width={3}>
            <Header as='h4'>Public Key</Header>
          </Grid.Column>
          <Grid.Column width={10}>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as='h4'>Private Key</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={3}>
            <Image src={img_pubkey} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as='h5' color='green'>
              {this.props.selected_item.data.pk}
              <Header.Subheader>
                {this.props.selected_item.data.sk}
              </Header.Subheader>
            </Header>
            <Container textAlign='left'>
              <Header as='h4'>Balance & Transactions notes:</Header>
              {this.props.selected_item.data.notes}
            </Container>
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src={img_privkey} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export class PrivPubKeysEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PRIV_PUB_KEY,
      metadata: {
        label: this.refs.labelInput.input.value,
      },
      data: {
        pk: this.refs.pkInput.input.value,
        sk: this.refs.skInput.input.value,
        notes: this.refs.notesInput.input.value,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  componentDidMount() {
    if (this.refs.labelInput) {
      this.refs.labelInput.input.focus();
    }
  }

  render() {
    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_PRIV_PUB_KEY}
        handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item.metadata.label}
                ref='labelInput'
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                fullWidth={true}
                floatingLabelText="Public Key"
                defaultValue={this.props.selected_item.data.pk}
                ref='pkInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                floatingLabelText="Private Key"
                defaultValue={this.props.selected_item.data.sk}
                ref='skInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                multiLine={false/*TODO: true*/}
                floatingLabelText="Balance & Transactions notes"
                defaultValue={this.props.selected_item.data.notes}
                ref='notesInput'
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
