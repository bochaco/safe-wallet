import React from 'react';
import { Button, TextField, FormHelperText } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { Grid, Image, Header, Icon, List, Popup,
          Modal, Dimmer, Progress, Loader } from 'semantic-ui-react'
import { getQRCode } from '../common.js';
import { ConfirmTransferDialogBox } from './DialogBox.js';

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
  secButtonStyle: {
    backgroundColor: '#ffffff',
    color: '#000000'
  }
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
      recipient: '',
      recipientError: '',
      msg: '',
      amount: '',
      amountError: '',
      pin: '',
      pinError: '',
      percent: 0,
      loadingWallet: false,
      checkingTxInbox: false,
    }

    this.readWalletData = this.readWalletData.bind(this);
    this.checkOwnershipOfCoins = this.checkOwnershipOfCoins.bind(this);
    this.handleRecipientChange = this.handleRecipientChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  async readWalletData() {
    const wallet = await this.props.altcoinWallet.loadWalletData(this.props.safeApp, this.props.selected_item.data.wallet);
    console.log("Reading wallet", this.props.selected_item.data.pk, wallet);
    this.setState( { wallet: wallet, loadingWallet: false } );
  }

  async checkOwnershipOfCoins(coins, pk) {
    if (coins.length < 1) {
      return { coinsAccepted: [], prev_owner: null };
    }

    let coinsAccepted = [];
    let prevOwner = null;
    for (let i = 0; i < coins.length; i++) {
        const currentCoin = coins[i];
        console.log("Checking coind ID:", currentCoin.toString(16));
        try {
          const coinData = await this.props.altcoinWallet.checkOwnership(this.props.safeApp, currentCoin, pk);
          // the coin is mine, let's add it unless it's already in my wallet
          prevOwner = coinData.prev_owner;
          if (this.state.wallet.indexOf(currentCoin) < 0) {
            console.log("Coin accepted: ", currentCoin);
            coinsAccepted.push(currentCoin);
          } else {
            // somebody trying to cheat?? I had that coin in my wallet already
            console.error("The coin already existed in my wallet, so discard TX");
          }
        } catch(err) {
          // somebody trying to cheat??
          console.error("The coin doesn't belong to me, so ignore TX");
        }
    };

    return { coinsAccepted, prevOwner };
  }

  async tick() {
    // if there is a previous call which is still running then skip it this time
    if (this.state.checkingTxInbox) return;

    const pk = this.props.selected_item.data.pk;
    const encPk = this.props.selected_item.data.tx_inbox_pk;
    const encSk = this.props.selected_item.data.tx_inbox_sk;
    let historyTxs = [];

    this.setState( { checkingTxInbox: true } );
    // let's wrap everything in a try/catch since we need to make sure we set
    // the 'checkingTxInbox' to 'false' at the end, even if there are errors
    try {
      // Let's read new TX's, if there is any ...
      const txs = await this.props.altcoinWallet.readTxInboxData(this.props.safeApp, pk, encPk, encSk);
      for (let i = 0; i < txs.length; i++) {
          const txInfo = txs[i];
          console.log("TX notification received. TX id: ", txInfo.id);
          const { coinsAccepted, prevOwner } = await this.checkOwnershipOfCoins(txInfo.coinIds, pk);
          let newWallet = this.state.wallet.slice();
          newWallet.push(...coinsAccepted);
          console.log("Updated wallet", newWallet);
          // save updated wallet in state and in SAFE Network
          await this.props.altcoinWallet.storeCoinsToWallet(this.props.safeApp, this.props.selected_item.data.wallet, newWallet);
          this.setState( { wallet: newWallet } );
          if (this.props.selected_item.metadata.keepTxs) {
            // save the new TX in the history
            const tx = {
              amount: coinsAccepted.length,
              direction: "in",
              date: txInfo.date,
              from: prevOwner,
              msg: txInfo.msg,
            }
            historyTxs.push(tx);
          }
      };

      if (txs.length > 0) {
        await this.props.altcoinWallet.removeTxInboxData(this.props.safeApp, pk, txs);
        if (historyTxs.length > 0) {
          let updatedTxs = this.props.selected_item.data.history;
          Array.prototype.push.apply(updatedTxs, historyTxs);
          console.log("Storing inbound TX's in history");
          await this.props.updateTxHistory(updatedTxs);
        }
      }
    } catch (error) {
      console.log("Error when trying to check TX inbox:", error);
    }

    this.setState( { checkingTxInbox: false } );
  }

  handleRecipientChange(event) {
    this.setState({recipientError: '', recipient: event.target.value});
  }

  handleAmountChange(event) {
    this.setState({amountError: '', amount: event.target.value});
  }

  handlePinChange(event) {
    this.setState({pinError: '', pin: event.target.value});
  }

  handleChange = name => event => {
    this.setState( { [name]: event.target.value } );
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
    let amount = this.state.amount ? parseFloat(this.state.amount, 10) : 0;
    if (this.state.recipient.length < 1) {
      this.setState({recipientError: this.props.i18nStrings.msg_invalid_rcpt});
    } else if (amount > Math.floor(amount)) {
      this.setState({amountError: this.props.i18nStrings.msg_invalid_value});
    } else if (amount <= 0) {
      this.setState({amountError: this.props.i18nStrings.msg_invalid_value});
    } else if (amount > this.state.wallet.length) {
      this.setState({amountError: this.props.i18nStrings.msg_no_funds});
    } else if (this.state.pin !== this.props.selected_item.metadata.pin) {
      this.setState({pinError: this.props.i18nStrings.msg_invalid_pin});
    } else {
      this.setState({percent: 0, showConfirm: true });
    }
  }

  async makeTransfer(amount, percentStep) {
    if (amount < 1) {
      return { coinIds: [], recipientPk: null };
    }

    const { coinIds, recipientPk } = await this.makeTransfer(amount - 1, percentStep);

    let coinId = this.state.wallet[amount - 1];
    let pk = recipientPk || this.state.recipient;
    console.log("Transfering coin", coinId);
    try {
      pk = await this.props.altcoinWallet.transferCoin(
                                      this.props.safeApp, coinId,
                                      this.props.selected_item.data.pk,
                                      this.props.selected_item.data.sk,
                                      pk);
      console.log("Coin transferred");
      coinIds.push(coinId);
    } catch(error) {
      console.error("Error transferring coin:", error);
    }
    this.setState( { percent: this.state.percent + percentStep } );
    return { coinIds, recipientPk: pk };
  }

  async handleConfirmTransfer() {
    this.setState( { isTransfering: true } );

    let recipient = this.state.recipient;
    let msg = this.state.msg;
    let amount = parseFloat(this.state.amount, 10);
    let percentStep = Math.floor(100 / (amount+2));
    let updatedWallet = this.state.wallet;
    console.log("Transfering coins: ", amount);
    const { coinIds, recipientPk } = await this.makeTransfer(amount, percentStep);
    this.setState( { percent: this.state.percent + percentStep } );
    await this.props.altcoinWallet.sendTxNotif(this.props.safeApp, recipientPk, coinIds, msg);
    updatedWallet.splice(0, amount); // TODO: remove the coins with id in coinIds var instead
    this.setState( { percent: this.state.percent + percentStep } );
    await this.props.altcoinWallet.storeCoinsToWallet(this.props.safeApp, this.props.selected_item.data.wallet, updatedWallet);
    this.setState( { wallet: updatedWallet } );
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
      await this.props.updateTxHistory(updatedTxs);
    }
    this.setState( { pin: '', showConfirm: false, isTransfering: false } );
  }

  handleCancelTransfer() {
    this.setState( { pin: '', showConfirm: false } );
  }

  render() {
    return (
    <div>
      <Grid >
        <Grid.Row>
          <Grid.Column width={10}>
            <Grid>
              <Grid.Row>
                <Grid.Column verticalAlign="middle" width={10}>
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
                <Grid.Column width={6}>
                  <Image style={styles.withPointer} size="tiny"
                        src={this.state.qrcode} onClick={this.handleShowQR} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={14}>
                  <TextField
                    fullWidth={true}
                    label={`${this.props.i18nStrings.item_tx_rcpt} (${this.props.i18nStrings.item_pk} / WebID)`}
                    autoFocus={true}
                    onChange={this.handleRecipientChange}
                    value={this.state.recipient}
                  />
                  <FormHelperText error>{this.state.recipientError}</FormHelperText>
                </Grid.Column>
                <Grid.Column width={2} verticalAlign="top">
                  {/*<Button basic icon='camera' color="grey" />*/}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <TextField
                    fullWidth={true}
                    label={this.props.i18nStrings.item_tx_msg}
                    onChange={this.handleChange('msg')}
                    value={this.state.msg}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <TextField
                    label={this.props.i18nStrings.item_tx_amount}
                    onChange={this.handleAmountChange}
                    value={this.state.amount}
                  />
                  <FormHelperText error>{this.state.amountError}</FormHelperText>
                </Grid.Column>
                <Grid.Column width={4}>
                  <TextField
                    label={this.props.i18nStrings.item_pin}
                    onChange={this.handlePinChange}
                    value={this.state.pin}
                  />
                  <FormHelperText error>{this.state.pinError}</FormHelperText>
                </Grid.Column>
                <Grid.Column verticalAlign="middle" width={7}>
                  <Button
                    color='primary'
                    variant='contained'
                    style={styles.secButtonStyle}
                    onClick={this.showConfirmTransfer}
                  >
                    {this.props.i18nStrings.btn_transfer}
                    <Send />
                  </Button>
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
                  key={h.date+h.amount+index}
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
                  <Header as='h4' color='blue'>{this.state.amount}</Header>
                </List.Item>
                <List.Item>
                  {this.state.amount > 1 ? this.props.i18nStrings.item_tx_coin_plural : this.props.i18nStrings.item_tx_coin_singular}
                </List.Item>
                <List.Item>
                  <Header as='h4' color='blue'>{this.state.recipient}</Header>
                </List.Item>
              </List>
            </List.Item>
            <List.Item>
              {this.state.isTransfering &&
                <Dimmer active>
                  {this.props.i18nStrings.item_tx_in_progress}...
                  <Progress percent={this.state.percent} size="medium" indicating inverted color='green' />
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
