import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentSend from 'material-ui/svg-icons/content/send';
import { Checkbox, Grid, Image, Header, Icon, List, Popup, Modal, Dimmer, Progress, Loader } from 'semantic-ui-react'
import { Constants, getQRCode } from '../common.js';
import { EditDialogBox, ConfirmTransferDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

import img_balance from '../img/icon-balance.png';

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
    this.props.altcoinWallet.loadWalletData(this.props.safeAppHandle, this.props.selected_item.data.wallet)
      .then((wallet) => {
        console.log("Reading wallet", this.props.selected_item.data.pk, wallet);
        this.setState({wallet: wallet, loadingWallet: false});
      });
  }

  checkOwnershipOfCoins(coins, pk) {
      if (coins.length < 1) {
        return Promise.resolve({coinsAccepted: [], prev_owner: null});
      }

      let coinsAccepted = [];
      let prevOwner;
      return Promise.all(coins.map((currentCoin) => {
        console.log("Checking coind ID:", currentCoin.toString(16));
        return this.props.altcoinWallet.checkOwnership(this.props.safeAppHandle, currentCoin, pk)
          .then((coinData) => {
            // the coin is mine, let's add it unless it's already in my wallet
            prevOwner = coinData.prev_owner;
            if (this.state.wallet.indexOf(currentCoin) < 0) {
              console.log("Coin accepted: ", currentCoin);
              coinsAccepted.push(currentCoin);
            } else {
              // somebody trying to cheat?? I had that coin in my wallet already
              throw Error("The coin already existed in my wallet, so discard TX");
            }
          }, (err) => {
            // somebody trying to cheat??
            throw Error("The coin doesn't belong to me, so ignore TX");
          })
      }))
      .then(() => ({coinsAccepted, prevOwner}));
  }

  tick() {
    const pk = this.props.selected_item.data.pk;
    const encPk = this.props.selected_item.data.tx_inbox_pk;
    const encSk = this.props.selected_item.data.tx_inbox_sk;
    let historyTxs = [];

    // Let's read new TX's, if there is any ...
    return this.props.altcoinWallet.readTxInboxData(this.props.safeAppHandle, pk, encPk, encSk)
      .then((txs) => Promise.all(txs.map((txInfo) => {
        console.log("TX notification received. TX id: ", txInfo.id);
        return this.checkOwnershipOfCoins(txInfo.coinIds, pk)
          .then(({coinsAccepted, prevOwner}) => {
            let newWallet = this.state.wallet;
            newWallet.push(...coinsAccepted);
            console.log("Updated wallet", newWallet);
            // save updated wallet in state and in SAFEnet
            return this.props.altcoinWallet.storeCoinsToWallet(this.props.safeAppHandle, this.props.selected_item.data.wallet, newWallet)
              .then(() => {
                this.setState({wallet: newWallet});
                if (this.props.selected_item.metadata.keepTxs) {
                  // save the new TX in the history
                  let tx = {
                    amount: coinsAccepted.length,
                    direction: "in",
                    date: txInfo.date,
                    from: prevOwner,
                    msg: txInfo.msg,
                  }
                  historyTxs.push(tx);
                }
              })
          });
        }))
        .then(() => {
          if (txs.length > 0) {
            return this.props.altcoinWallet.removeTxInboxData(this.props.safeAppHandle, pk, txs)
              .then(() => {
                if (historyTxs.length > 0) {
                  let updatedTxs = this.props.selected_item.data.history;
                  Array.prototype.push.apply(updatedTxs, historyTxs);
                  console.log("Storing inbound TX's in history");
                  return this.props.updateTxHistory(updatedTxs);
                }
              });
          }
        })
      );
  }

  handleRecipientChange() {
      this.setState({recipientError: ""});
  }

  handleAmountChange() {
      this.setState({amountError: ""});
  }

  handlePinChange() {
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
    let amount = this.refs.amountInput.input.value ? parseFloat(this.refs.amountInput.input.value, 10) : 0;
    if (this.refs.recipientInput.input.value.length < 1) {
      this.setState({recipientError: this.props.i18nStrings.msg_invalid_rcpt});
    } else if (amount > Math.floor(amount)) {
      this.setState({amountError: this.props.i18nStrings.msg_invalid_value});
    } else if (amount <= 0) {
      this.setState({amountError: this.props.i18nStrings.msg_invalid_value});
    } else if (amount > this.state.wallet.length) {
      this.setState({amountError: this.props.i18nStrings.msg_no_funds});
    } else if (this.refs.pinInput.input.value !== this.props.selected_item.metadata.pin) {
      this.setState({pinError: this.props.i18nStrings.msg_invalid_pin});
    } else {
      this.setState({percent: 0, showConfirm: true });
    }
  }

  makeTransfer(amount, percentStep) {
    if (amount < 1) {
      return Promise.resolve([]);
    }

    let coinId = this.state.wallet[amount-1];
    let coinIds;
    console.log("Transfering coin", coinId);

    return this.makeTransfer(amount-1, percentStep)
      .then((_coinIds) => coinIds = _coinIds)
      .then(() => this.props.altcoinWallet.transferCoin(
          this.props.safeAppHandle,
          coinId,
          this.props.selected_item.data.pk,
          this.props.selected_item.data.sk,
          this.refs.recipientInput.input.value,
      ))
      .then(() => console.log("Coin transferred"))
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => coinIds.push(coinId))
      .then(() => coinIds);
  }

  handleConfirmTransfer() {
    this.setState({isTransfering: true });

    let recipient = this.refs.recipientInput.input.value;
    let msg = this.refs.msgInput.input.value;
    let amount = parseFloat(this.refs.amountInput.input.value, 10);
    let percentStep = Math.floor(100 / (amount+2));
    let coinIds, updatedWallet = this.state.wallet;
    console.log("Transfering coins: ", amount);
    return this.makeTransfer(amount, percentStep)
      .then((_coinIds) => coinIds = _coinIds)
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => this.props.altcoinWallet.sendTxNotif(this.props.safeAppHandle, recipient, coinIds, msg))
      .then(() => updatedWallet.splice(0, amount)) // TODO: remove the coins with id in coinIds var instead
      .then(() => this.setState({percent: this.state.percent + percentStep}))
      .then(() => this.props.altcoinWallet.storeCoinsToWallet(this.props.safeAppHandle, this.props.selected_item.data.wallet, updatedWallet))
      .then(() => {
        this.setState({wallet: updatedWallet});
        if (this.props.selected_item.metadata.keepTxs) {
          // save the new TX in the history
          let historyTx = {
            amount: coinIds.length,
            direction: "out",
            date: (new Date()).toUTCString(),
            to: recipient,
            msg: msg,
          }
          console.log("Storing outbound TX's in history", historyTx);
          let updatedTxs = this.props.selected_item.data.history;
          updatedTxs.push(historyTx);
          this.props.updateTxHistory(updatedTxs);
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
                    <Image size="mini" src={img_balance} />
                    <Header.Content>
                      {this.getBalance()}
                      {this.state.loadingWallet &&
                        <Dimmer active inverted>
                          <Loader />
                        </Dimmer>
                      }
                      <Header.Subheader>
                        {this.props.i18nStrings.item_balance}
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
                    floatingLabelText={this.props.i18nStrings.item_tx_rcpt}
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
                    floatingLabelText={this.props.i18nStrings.item_tx_msg}
                    ref='msgInput'
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText={this.props.i18nStrings.item_tx_amount}
                    errorText={this.state.amountError}
                    ref='amountInput'
                    onChange={this.handleAmountChange}
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText={this.props.i18nStrings.item_pin}
                    type="password"
                    errorText={this.state.pinError}
                    ref='pinInput'
                    onChange={this.handlePinChange}
                  />
                </Grid.Column>
                <Grid.Column verticalAlign="bottom" width={7}>
                  <RaisedButton
                    label={this.props.i18nStrings.btn_transfer}
                    primary={false}
                    icon={<ContentSend />}
                    onTouchTap={this.showConfirmTransfer}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={6}>
            {this.props.i18nStrings.item_tx_history}
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
                        {h.direction === "in" ? this.props.i18nStrings.item_tx_from : this.props.i18nStrings.item_tx_to}
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
          {this.props.i18nStrings.item_pk}
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
          i18nStrings={this.props.i18nStrings}
        >
          <List>
            <List.Item>
              <List horizontal>
                <List.Item>
                  {this.state.isTransfering ? this.props.i18nStrings.item_tx_in_progress : this.props.i18nStrings.item_tx_to_start}
                </List.Item>
                <List.Item>
                  <Header as='h4' color='blue'>{this.refs.amountInput.input.value}</Header>
                </List.Item>
                <List.Item>
                  {this.refs.amountInput.input.value > 1 ? this.props.i18nStrings.item_tx_coin_plural : this.props.i18nStrings.item_tx_coin_singular}
                </List.Item>
                <List.Item>
                  <Header as='h4' color='blue'>{this.refs.recipientInput.input.value}</Header>
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              {this.state.isTransfering &&
                <Dimmer active>
                  {this.props.i18nStrings.item_tx_in_progress}...
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
    this.state = {
      pinError: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
  }

  handlePinChange() {
      this.setState({pinError: ""});
  }

  handleSubmit() {
    let newPin =  this.props.selected_item.metadata.pin ? this.props.selected_item.metadata.pin : "";
    if (this.refs.pinInput.input.value.length > 0 || this.refs.pinConfirmInput.input.value.length > 0) {
      if (this.refs.pinInput.input.value !== this.refs.pinConfirmInput.input.value) {
        this.setState({pinError: this.props.i18nStrings.msg_invalid_pin});
        return;
      } else {
        newPin = this.refs.pinInput.input.value;
      }
    }

    let history = this.props.selected_item.data.history ? this.props.selected_item.data.history : []
    let updatedItem = {
      type: Constants.TYPE_ALTCOIN,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.input.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
        pin: newPin,
        keepTxs: this.refs.historyInput.state.checked,
      },
      data: {
        wallet_id: this.refs.walletIdInput.input.value,
        wallet: this.props.selected_item.data.wallet,
        tx_inbox_pk: this.props.selected_item.data.tx_inbox_pk,
        tx_inbox_sk: this.props.selected_item.data.tx_inbox_sk,
        pk: this.refs.pkInput.input.value,
        sk: this.refs.skInput.input.value,
        history: this.refs.historyInput.state.checked ? history : [],
      }
    }

    if (this.props.selected_item_id) {
      return this.props.handleSubmit(updatedItem);
    } else {
      // Create the wallet and inbox based on the Public Key
      return this.props.altcoinWallet.createWallet(this.props.safeAppHandle, updatedItem.data.pk)
        .then((wallet) => this.props.altcoinWallet.createTxInbox(this.props.safeAppHandle, updatedItem.data.pk)
          .then((encKeys) => {
            updatedItem.data.wallet = wallet;
            updatedItem.data.tx_inbox_pk = encKeys.pk;
            updatedItem.data.tx_inbox_sk = encKeys.sk;
          })
        )
        .then(() => this.props.handleSubmit(updatedItem));
    }
  };

  componentDidMount() {
    if (this.refs.colorAndLabelInput) {
      this.refs.colorAndLabelInput.refs.labelInput.input.focus();
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
            <Grid.Column width={8}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_coin_wallet_label}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                disabled
                fullWidth={true}
                floatingLabelText={this.props.i18nStrings.item_wallet_id}
                ref='walletIdInput'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                floatingLabelText={this.props.i18nStrings.item_pk}
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
                floatingLabelText={this.props.i18nStrings.item_sk}
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
                floatingLabelText={this.props.i18nStrings.item_set_pin}
                ref='pinInput'
                type='password'
                onChange={this.handlePinChange}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                fullWidth={true}
                floatingLabelText={this.props.i18nStrings.item_confirm_pin}
                ref='pinConfirmInput'
                type='password'
                onChange={this.handlePinChange}
                errorText={this.state.pinError}
              />
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
