import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentSend from 'material-ui/svg-icons/content/send';
import { Checkbox, Grid, Image, Header, Icon, List, Popup, Modal, Dimmer, Progress } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox, ConfirmTransferDialogBox } from './DialogBox.js';

import img_pubkey from '../img/qr_pubkey.png';
import img_altcoinicon from '../img/icon_altcoin.png';

const styles = {
  popup: {
    opacity: 0.85,
  },
  qrPopup: {
    textAlign: 'center',
  }
}

export default class AltCoinView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQR: false,
      showConfirm: false,
      isTransfering: false,
      wallet: [],
      recipientError: "",
      amountError: "",
      pinError: "",
      percent: 0,
    }

    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.makeTransfer = this.makeTransfer.bind(this);
    this.handleShowQR = this.handleShowQR.bind(this);
    this.handleHideQR = this.handleHideQR.bind(this);
    this.showConfirmTransfer = this.showConfirmTransfer.bind(this);
    this.handleConfirmTransfer = this.handleConfirmTransfer.bind(this);
    this.handleCancelTransfer = this.handleCancelTransfer.bind(this);
    this.sleepe = this.sleepe.bind(this);
  }

  componentWillMount() {
    this.props.getWallet(this.props.selected_item.data.pk)
      .then(wallet => {
        console.log("Will mount", this.props.selected_item.data.pk, wallet);
        if (wallet) {
          this.setState({wallet: wallet});
        }
      });
  }

  componentDidMount() {
    this.refs.recipientInput.input.focus();
  }

  handleRecipientChange(e) {
      this.setState({recipientError: ""});
  }

  handleAmountChange(e) {
      this.setState({amountError: ""});
  }

  handlePinChange(e) {
      this.setState({pinError: ""});
  }

  getBalance() {
    return this.state.wallet.length;
  }

  handleShowQR() {
    this.setState({showQR: true});
  }

  handleHideQR() {
    this.setState({showQR: false});
  }

  showConfirmTransfer() {
    let amount = parseFloat(this.refs.amountInput.input.value, 10);
    if (amount <= 0) {
      this.setState({amountError:"Invalid value"});
    } else if (amount > this.state.wallet.length) {
      this.setState({amountError:"Insufficient funds"});
    } else if (this.refs.pinInput.input.value !== this.props.selected_item.metadata.pin) {
      this.setState({pinError:"PIN doesn't match"+this.props.selected_item.metadata.pin+"]"});
    } else {
      this.setState({percent: 0, showConfirm: true });
    }
  }

  makeTransfer() {
    let updatedWallet = [];
    let amount = parseFloat(this.refs.amountInput.input.value, 10);

    console.log("Transfering coin", amount);
    for (let i=0; i < amount; i++) {
      console.log("Transfering coin", i);
      let p = (100 * (i+1)) / amount;
      this.setState({percent: p})
      updatedWallet = this.props.transferCoin(
          this.state.wallet[i],
          this.props.selected_item.data.pk,
          this.props.selected_item.data.sk,
          this.refs.recipientInput.input.value
      );
      console.log("Transfering coin", updatedWallet);
    }
    this.setState({wallet: updatedWallet});
    this.refs.pinInput.input.value = null;
  }

  sleepe() {
    if (this.state.percent < 100) {
      this.setState({percent: this.state.percent+10 });
      setTimeout(this.sleepe, 1000);
    }
  }

  handleConfirmTransfer() {
    this.setState({isTransfering: true });
    this.makeTransfer();
    this.setState({showConfirm: false, isTransfering: false });
  }

  handleCancelTransfer() {
    this.refs.pinInput.input.value = null;
    this.setState({showConfirm: false });
  }

  render() {
    return (
    <div>
      <Grid >
        <Grid.Row>
          <Grid.Column width={10}>
            <Grid >
              <Grid.Row>
                <Grid.Column verticalAlign="middle" width={11}>
                  <Header as='h1' color="blue">
                    <Image size="mini" src={img_altcoinicon} />
                    <Header.Content>
                      {this.getBalance()}
                      <Header.Subheader>
                        Balance
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Image style={{cursor: 'pointer'}} size="tiny"
                    src={img_pubkey} onClick={this.handleShowQR} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={14}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Transfer To"
                    defaultValue="1Kt7eE4y7D2ciidW6ANiGVnKQaYmWgeZnc"
                    errorText={this.state.recipientError}
                    ref='recipientInput'
                    onChange={this.handleRecipientChange}
                  />
                </Grid.Column>
                <Grid.Column width={2} verticalAlign="bottom">
                  {/*<Button basic icon='camera' color="grey" />*/}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Amount"
                    errorText={this.state.amountError}
                    ref='amountInput'
                    defaultValue="2"
                    onChange={this.handleAmountChange}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="PIN"
                    type="password"
                    errorText={this.state.pinError}
                    defaultValue="1234"
                    ref='pinInput'
                    onChange={this.handlePinChange}
                  />
                </Grid.Column>
                <Grid.Column verticalAlign="bottom" width={7}>
                  <RaisedButton
                    label="Transfer"
                    primary={false}
                    icon={<ContentSend />}
                    onTouchTap={this.showConfirmTransfer}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={6}>
            <List divided verticalAlign='middle'>
              {this.props.selected_item.data.history &&
                this.props.selected_item.data.history.map((h,index) => (
                <Popup
                  key={h.date+h.amount}
                  style={styles.popup}
                  trigger={
                    <List.Item color={h.direction === "in" ? "green" : "red"}>
                      <List.Content floated='right'>
                        {h.date}
                      </List.Content>
                      <Icon name={h.direction === "in" ? "plus" : "minus"} color={h.direction === "in" ? "green" : "red"} />
                      <List.Content>
                        {h.amount}
                      </List.Content>
                    </List.Item>
                  }
                  content={<Header>From:<Header.Subheader>{h.from}</Header.Subheader></Header>}
                  positioning='bottom left'
                />
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal
        open={this.state.showQR}
        size="small"
        onClose={this.handleHideQR}
      >
        <Modal.Header style={styles.qrPopup}>
          Public Key
        </Modal.Header>
        <Modal.Content style={styles.qrPopup}>
          <Image centered size="small" src={img_pubkey} />
          <Header>{this.props.selected_item.data.pk}</Header>
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal>

      {this.state.showConfirm &&
        <ConfirmTransferDialogBox
          open={this.state.showConfirm}
          handleClose={this.handleCancelTransfer}
          handleSubmit={this.handleConfirmTransfer}
        >
          <List>
            <List.Item>
              <List horizontal>
                <List.Item>
                  {this.state.isTransfering ? 'Transferring' : 'You are about to transfer'}
                </List.Item>
                <List.Item>
                  <Header as='h4' color='blue'>{this.refs.amountInput.input.value}</Header>
                </List.Item>
                <List.Item>
                  coin{this.refs.amountInput.input.value > 1 ? 's' : ''} to
                </List.Item>
                <List.Item>
                  <Header as='h4' color='blue'>{this.refs.recipientInput.input.value}</Header>
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              {this.state.isTransfering &&
                <Dimmer active>
                  Transferring...
                  <Progress percent={this.state.percent} size="mini" inverted color='green' label />
                </Dimmer>
              }
            </List.Item>
          </List>
        </ConfirmTransferDialogBox>
      }
    </div>
    );
  }
}

export class AltCoinEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_ALTCOIN,
      metadata: {
        label: this.refs.labelInput.input.value,
        pin: this.refs.pinInput.input.value,
        history: this.refs.historyInput.state.checked,
      },
      data: {
        pk: this.refs.pkInput.input.value,
        sk: this.refs.skInput.input.value,
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
        type={Constants.TYPE_ALTCOIN}
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
            <Grid.Column width={3}>
              <TextField
                fullWidth={true}
                floatingLabelText="Set new PIN"
                ref='pinInput'
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                fullWidth={true}
                floatingLabelText="Confirm new PIN"
                ref='pinConfirmInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={7} verticalAlign="middle">
              <Checkbox toggle
                label="Store transactions history in this wallet"
                defaultChecked={this.props.selected_item.metadata.history}
                ref='historyInput'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
