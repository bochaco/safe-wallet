import React from 'react';
import TextField from 'material-ui/TextField';
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

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PRIV_PUB_KEY,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.input.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
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
    if (this.refs.colorAndLabelInput) {
      this.refs.colorAndLabelInput.refs.labelInput.input.focus();
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
                floatingLabelText={this.props.i18nStrings.item_pk}
                defaultValue={this.props.selected_item.data.pk}
                ref='pkInput'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                floatingLabelText={this.props.i18nStrings.item_sk}
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
                floatingLabelText={this.props.i18nStrings.item_tx_notes}
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
