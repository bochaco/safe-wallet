import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentSend from 'material-ui/svg-icons/content/send';
import { Checkbox, Grid, Image, Header, Icon, List, Popup, Modal, Dimmer, Progress, Loader } from 'semantic-ui-react'
import { Constants, getQRCode } from '../common.js';
import { EditDialogBox, ConfirmTransferDialogBox } from './DialogBox.js';

import img_altcoinicon from '../img/icon_altcoin.png';

const styles = {
  popup: {
    opacity: 0.85,
  },
  qrPopup: {
    textAlign: 'center',
  },
  withPointer: {
    cursor: 'pointer'
  },
  scrollable: {
    cursor: 'pointer',
    height: 360,
    overflowY: 'auto',
    paddingRight: 10,
  },
}

const CHECK_WALLET_INBOX_FREQ = 2000;

export default class AltCoinView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQR: false,
      showConfirm: false,
      isTransfering: false,
      wallet: [],
      history: [],
      recipientError: "",
      amountError: "",
      pinError: "",
      percent: 0,
      loadingWallet: false,
    }

    this.readWalletData = this.readWalletData.bind(this);
    this.checkOwnershipOfCoins = this.checkOwnershipOfCoins.bind(this);
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
  }

  componentWillMount() {
    this.setState({loadingWallet: true});
    this.tick();
    this.readWalletData();
    this.setState({
      qrcode: getQRCode(this.props.selected_item.data.pk),
      history: this.props.selected_item.data.history.slice().reverse(),
    });
  }

  componentDidMount() {
    this.refs.recipientInput.input.focus();
    this.timerID = setInterval(
      () => this.tick(),
      CHECK_WALLET_INBOX_FREQ
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected_item.data.history !== this.state.history) {
      this.setState({history: nextProps.selected_item.data.history.slice().reverse()});
    }
  }

  readWalletData() {
    this.props.loadWalletData(this.props.selected_item.data.pk)
      .then(wallet => {
        console.log("Reading wallet", this.props.selected_item.data.pk, wallet);
        if (wallet) {
          this.setState({wallet: wallet, loadingWallet: false});
        }
      });
  }

  checkOwnershipOfCoins(coins, pk) {
      if (coins.length < 1) {
        return Promise.resolve({coinsAccepted: [], prev_owner: null});
      }

      let currentCoin = coins[0];
      console.log("Checking coind ID:", currentCoin);
      return this.props.checkOwnership(currentCoin, pk)
        .then((coinData) => {
          // the coin is mine, let's add it unless it's already in my wallet
          if (this.state.wallet.indexOf(currentCoin) < 0) {
            console.log("Coin accepted");
            coins.splice(0, 1);
            return this.checkOwnershipOfCoins(coins, pk)
              .then(({coinsAccepted, _}) => {
                coinsAccepted.push(currentCoin);
                return {coinsAccepted: coinsAccepted, prev_owner: coinData.prev_owner};
              })
          } else {
            // somebody trying to cheat?? I had that coin in my wallet already
            console.warn("The coin already existed in my wallet, so ignoring it");
          }
        }, (err) => {
          // somebody trying to cheat??
          console.warn("The coin doesn't belong to me, so ignoring it");
        })
  }

  tick() {
    let pk = this.props.selected_item.data.pk;
    this.props.readTxInboxData(pk)
      .then(txInbox => {
        //console.log("Read wallet TX inbox", pk, txInbox);
        // is there any new tx?
        if (txInbox && txInbox.length > 0) {
          // Now let's iterate thru each TX
          for (let i=0; i<txInbox.length; i++) {
            let newCoins = txInbox[i].coinIds;
            // let's iterate thru each coin found in the current TX
            this.checkOwnershipOfCoins(newCoins, pk)
              .then(({coinsAccepted, prev_owner}) => {
                let newWallet = this.state.wallet;
                newWallet.push(...coinsAccepted);
                console.log("Updated wallet", newWallet);
                // save updated wallet in state and in SAFEnet
                this.props.saveWalletData(pk, newWallet);
                this.setState({wallet: newWallet});
                if (this.props.selected_item.metadata.keepTxs) {
                  // save the new TX in the history
                  let tx = {
                    amount: coinsAccepted.length,
                    direction: "in",
                    date: txInbox[i].date,
                    from: prev_owner,
                    msg: txInbox[i].msg,
                  }
                  console.log("Storing tx in history", tx);
                  this.props.appendTx2History(tx);
                }
              })
          }

          // remove the coins from the inbox
          // TODO: we should remove only the coins that were read instead of emptying
          // TODO: also, his should be done when the promises above are done
          this.props.emptyTxInbox(pk)
            .then(() => console.log("New coins deleted from inbox"))

        }
      });
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
      this.setState({pinError:"PIN doesn't match"});
    } else {
      this.setState({percent: 0, showConfirm: true });
    }
  }

  makeTransfer(amount, percentStep) {
    if (amount < 1) {
      return Promise.resolve([]);
    }

    let coinId= this.state.wallet[amount-1];
    let _coinIds;
    console.log("Transfering coin", coinId);

    return this.props.transferCoin(
        coinId,
        this.props.selected_item.data.pk,
        this.props.selected_item.data.sk,
        this.refs.recipientInput.input.value,
    )
      .then(id => console.log("Coin transferred"))
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => this.makeTransfer(amount-1, percentStep))
      .then((coinIds) => _coinIds = coinIds)
      .then(() => _coinIds.push(coinId))
      .then(() => {
        return _coinIds;
      });
  }

  handleConfirmTransfer() {
    this.setState({isTransfering: true });

    let recipient = this.refs.recipientInput.input.value;
    let msg = this.refs.msgInput.input.value;
    let amount = parseFloat(this.refs.amountInput.input.value, 10);
    let percentStep = Math.floor(100 / (amount+2));
    let tx, updatedWallet = this.state.wallet;
    console.log("Transfering coins: ", amount);
    this.makeTransfer(amount, percentStep)
      .then((coinIds) => tx = {coinIds: coinIds, msg: msg, date: (new Date()).toUTCString()})
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => this.props.appendTx2TxInbox(recipient, tx))
      .then((tx) => updatedWallet.splice(0, amount))
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => this.props.saveWalletData(this.props.selected_item.data.pk, updatedWallet))
      .then((wallet) => {
        this.setState({wallet: wallet});
        if (this.props.selected_item.metadata.keepTxs) {
          // save the new TX in the history
          let historyTx = {
            amount: tx.coinIds.length,
            direction: "out",
            date: (new Date()).toUTCString(),
            to: recipient,
            msg: msg,
          }
          console.log("Storing tx in history", historyTx);
          this.props.appendTx2History(historyTx);
        }
        this.refs.pinInput.input.value = null;
        this.setState({showConfirm: false, isTransfering: false });
      });
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
                      {this.state.loadingWallet &&
                        <Dimmer active inverted>
                          <Loader />
                        </Dimmer>
                      }
                      <Header.Subheader>
                        Balance
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Image bordered style={styles.withPointer} size="tiny"
                    src={this.state.qrcode} onClick={this.handleShowQR} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={14}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Transfer To"
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
                <Grid.Column width={16}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Message / Subject (optional)"
                    ref='msgInput'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Amount"
                    errorText={this.state.amountError}
                    ref='amountInput'
                    onChange={this.handleAmountChange}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="PIN"
                    type="password"
                    errorText={this.state.pinError}
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
            Transactions History
            <List divided verticalAlign='middle' style={styles.scrollable}>
              <List.Item />
              {this.props.selected_item.metadata.keepTxs &&
                this.state.history.map((h,index) => (
                <Popup
                  key={h.date+h.amou+index}
                  style={styles.popup}
                  wide={true}
                  positioning='bottom left'
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
                  children={
                    <div>
                      <Header as='h4' dividing>
                        {h.direction === "in" ? "From:" : "To:"}
                        <Header.Subheader>
                          {h.direction === "in" ? h.from : h.to}
                        </Header.Subheader>
                      </Header>
                      {h.msg}
                    </div>
                  }
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
          <Image bordered centered size="medium" src={this.state.qrcode} />
          {this.props.selected_item.data.pk}
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
                  <Progress percent={this.state.percent} size="medium" indicating inverted color='green' label />
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
    let history = this.props.selected_item.data.history ? this.props.selected_item.data.history : []
    let updatedItem = {
      type: Constants.TYPE_ALTCOIN,
      metadata: {
        label: this.refs.labelInput.input.value,
        pin: this.refs.pinInput.input.value,
        keepTxs: this.refs.historyInput.state.checked,
      },
      data: {
        pk: this.refs.pkInput.input.value,
        sk: this.refs.skInput.input.value,
        history: this.refs.historyInput.state.checked ? history : [],
      }
    }
    // Create the wallet and inbox based on the label
    this.props.createWallet(updatedItem.data.pk)
      .then(data => this.props.createTxInbox(updatedItem.data.pk))
      .then(data => this.props.handleSubmit(updatedItem));
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
                floatingLabelText="Label / Wallet ID"
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
                type='password'
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                fullWidth={true}
                floatingLabelText="Confirm new PIN"
                ref='pinConfirmInput'
                type='password'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={7} verticalAlign="middle">
              <Checkbox toggle
                label="Store full transactions history in this wallet"
                defaultChecked={this.props.selected_item.metadata.keepTxs}
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
