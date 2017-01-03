import React from 'react'
import { List, Grid, Card, Container, Message, Icon } from 'semantic-ui-react';
import ItemCard from './ItemCard.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import CardView from './CardView.js';
import CardEdit from './CardEdit.js';
import CardAdd from './CardAdd.js';
import CardDelete from './CardDelete.js';
import AppMenu from './AppMenu.js';
import AboutView from './AboutView.js';
import { appInfo } from '../config.js';
//import { sample_wallet_data } from '../storage/sample-data.js';

function loadStorage() {
  if (process.env.REACT_APP_SAFENET_OFF === "1") {
    console.log('SAFE_NET_OFF env var detected. Working with data in memory only');
    return require('../storage/storage-in-memory.js');
  } else {
    return require('../storage/storage.js');
  }
}

var {authoriseApp, isTokenValid, loadAppData, saveAppData, loadWalletData,
  transferCoin, createWallet, saveWalletData, /*deleteWallet,*/ checkOwnership,
  createTxInbox, readTxInboxData, /*deleteTxInbox,*/ emptyTxInbox, appendTx2TxInbox} = loadStorage();

const initialState = {
  isAuthorised: false,
  data: [],
  view_modal: false,
  edit_modal: false,
  add_modal: false,
  delete_modal: false,
  about_modal: false,
  snackbar: false,
  snackbar_message: '',
  selected_item: null,
  selected_type: null,
};

const CHECK_CONNECTION_FREQ = 2000;

export default class MainGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.handleRefresh = this.handleRefresh.bind(this);

    this.handleOpenViewModal = this.handleOpenViewModal.bind(this);
    this.handleCloseViewModal = this.handleCloseViewModal.bind(this);

    this.handleOpenEditModal = this.handleOpenEditModal.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);
    this.handleSubmitEditModal = this.handleSubmitEditModal.bind(this);

    this.handleOpenDeleteModal = this.handleOpenDeleteModal.bind(this);
    this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
    this.handleSubmitDeleteModal = this.handleSubmitDeleteModal.bind(this);

    this.handleOpenAddModal = this.handleOpenAddModal.bind(this);
    this.handleCloseAddModal = this.handleCloseAddModal.bind(this);
    this.handleSubmitAddModal = this.handleSubmitAddModal.bind(this);

    this.handleOpenAboutModal = this.handleOpenAboutModal.bind(this);
    this.handleCloseAboutModal = this.handleCloseAboutModal.bind(this);

    this.handleOpenSnack = this.handleOpenSnack.bind(this);
    this.handleCloseSnack = this.handleCloseSnack.bind(this);

    this.handlePower = this.handlePower.bind(this);
    this.requestAuthorisation = this.requestAuthorisation.bind(this);
    this.storeData = this.storeData.bind(this);

    this.appendTx2History = this.appendTx2History.bind(this);
  }

  componentWillMount() {
    this.requestAuthorisation();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      CHECK_CONNECTION_FREQ
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    if (this.state.isAuthorised) {
      isTokenValid()
        .then(() => {}, (err) => {
          this.setState(initialState);
          this.handleOpenSnack("Application authorization was revoked")
        })
    }
  }

  handlePower() {
      if (this.state.isAuthorised === false) {
        this.requestAuthorisation();
      } else if (this.state.isAuthorised) {
        // TODO!!!!: send to revoke access!!!!!!!!!!!!!!!
        this.setState({isAuthorised: false});
      }
  }

  requestAuthorisation() {
    this.setState({isAuthorised: null});
    authoriseApp(appInfo)
      .then(loadAppData)
      .then((parsedData) => {
        this.setState({isAuthorised: true, data: parsedData});
        //this.storeData(sample_wallet_data); // ONLY FOR TEST!!! this is too store the wallet_sample_data
      }, (err) => {
        this.setState({isAuthorised: false, data: {}});
        console.log("Authentication Failed:", err);
      })
  }

  handleRefresh() {
    loadAppData()
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        console.log("Failed refreshing data:", err);
      })
    this.handleOpenSnack("List of items reloaded from the SAFE network");
  }

  storeData(data) {
    return saveAppData(data)
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        throw Error("Failed storing data:", err);
      })
  }

  handleOpenViewModal(index) {
    this.setState({view_modal: true, selected_item: index});
  };

  handleCloseViewModal() {
    this.setState({view_modal: false, selected_item: null});
  };

  handleOpenEditModal(index) {
    if (index != null) {
      this.setState({edit_modal: true, selected_item: index});
    }
  };

  handleCloseEditModal() {
    this.setState({edit_modal: false, selected_item: null});
  };

  handleSubmitEditModal(newItem) {
    if (newItem != null) {
      let updatedData = this.state.data;
      if (this.state.selected_item == null) {
        // then add a new item
        newItem.id = 100; // TODO: this needs to be reviewed
        updatedData.push(newItem);
      } else {
        updatedData[this.state.selected_item].metadata = newItem.metadata;
        updatedData[this.state.selected_item].data = newItem.data;
      }
      this.storeData(updatedData)
        .then(() => {this.handleOpenSnack("Item saved in the SAFE network")})
    }
    this.setState({edit_modal: false, selected_item: null});
  };

  handleOpenAddModal() {
    this.setState({add_modal: true});
  };

  handleCloseAddModal() {
    this.setState({add_modal: false});
  };

  handleSubmitAddModal(type) {
    this.setState({selected_type: type, add_modal: false, edit_modal: true});
  };

  handleOpenDeleteModal(index) {
    this.setState({delete_modal: true, selected_item: index});
  };

  handleCloseDeleteModal() {
    this.setState({delete_modal: false, selected_item: null});
  };

  handleSubmitDeleteModal() {
    let updatedData = this.state.data;

    //TODO; not sure if this should be done in production
//    deleteTxInbox(this.state.data[this.state.selected_item].data.pk);
//    deleteWallet(this.state.data[this.state.selected_item].data.pk);

    updatedData.splice(this.state.selected_item, 1);
    this.storeData(updatedData)
      .then(() => {this.handleOpenSnack("Item deleted from the SAFE network")},
      (err) => {this.handleOpenSnack("Failed to delete item")})

    this.setState({delete_modal: false, selected_item: null});
  };

  handleOpenAboutModal() {
    this.setState({about_modal: true});
  };

  handleCloseAboutModal() {
    this.setState({about_modal: false});
  };

  handleOpenSnack(message) {
    this.setState({snackbar: true, snackbar_message: message});
  };

  handleCloseSnack() {
    this.setState({snackbar: false});
  };

  appendTx2History(tx) {
      let updatedData = this.state.data;
      if (!updatedData[this.state.selected_item].data.history) {
        updatedData[this.state.selected_item].data.history = [];
      }
      updatedData[this.state.selected_item].data.history.push(tx);
      this.storeData(updatedData);
  }

  render() {
    let cards = null;
    if (Object.keys(this.state.data).length > 0) {
      cards = <Card.Group itemsPerRow={3}>
        {this.state.data.map((item, index) => (
          <ItemCard key={index} index={index} item={item}
              handleView={this.handleOpenViewModal}
              handleEdit={this.handleOpenEditModal}
              handleDelete={this.handleOpenDeleteModal} />
          ))
        }
        </Card.Group>;
    } else {
      cards =
      <Grid centered columns={1}>
        <Grid.Column width={10} textAlign='center'>
        <Message visible >
          <Message.Content>
            You have no items stored in your wallet.
            Use the <Icon name='add circle'/>button to add an item.
          </Message.Content>
        </Message>
      </Grid.Column>
      </Grid>
    }

    return (
      <MuiThemeProvider>
        <Container>
          {/* Top menu bar */}
          <AppMenu
            handleOpenAboutModal={this.handleOpenAboutModal}
            handleOpenAddModal={this.handleOpenAddModal}
            handleRefresh={this.handleRefresh}
            isAuthorised={this.state.isAuthorised}
            handlePower={this.handlePower}
          />

          {/* Warning message when the app is not authorised yet */}
          {this.state.isAuthorised == null &&
            <Grid centered columns={3}>
              <Grid.Column width={6}>
                <Message info compact>
                  <Message.Content>
                    <Message.Header>Awaiting for access authorisation</Message.Header>
                    Please authorise the application from
                    the SAFE Authenticator in order to access your content:
                  </Message.Content>
                  <List as='ul'>
                    <List.Item as='li'>App Name: {appInfo.name}</List.Item>
                    <List.Item as='li'>Vendor:   {appInfo.vendor}</List.Item>
                    <List.Item as='li'>Version:  {appInfo.version}</List.Item>
                    <List.Item as='li'>Permissions:
                      <List.Item as='ul'>
                        {appInfo.permissions.map((p, i) => (
                          <List.Item key={i}>- {p}</List.Item>
                        ))}
                      </List.Item>
                    </List.Item>
                  </List>
                </Message>
              </Grid.Column>
            </Grid>
          }

          {/* Warning message when the app authorisation has been revoked */}
          {this.state.isAuthorised === false &&
            <Grid centered columns={3}>
              <Grid.Column width={10}>
                <Message negative compact>
                  <Message.Content>
                    <Message.Header>Application not authorised</Message.Header>
                    Access authorisation was revoked, the app was disconnected, or it lost
                    the connection to the network.
                    <br/><br />Please press the <Icon name='power'/> button to connect again.
                  </Message.Content>
                </Message>
              </Grid.Column>
            </Grid>
          }

          {/* List of items */}
          {this.state.isAuthorised && cards}

          {/* Dialog box for viewing the selected item */}
          <CardView
            open={this.state.view_modal}
            selected_item={this.state.data[this.state.selected_item]}
            handleClose={this.handleCloseViewModal}
            loadWalletData={loadWalletData}
            transferCoin={transferCoin}
            readTxInboxData={readTxInboxData}
            saveWalletData={saveWalletData}
            checkOwnership={checkOwnership}
            emptyTxInbox={emptyTxInbox}
            appendTx2History={this.appendTx2History}
            appendTx2TxInbox={appendTx2TxInbox}
          />

          {/* Dialog box for choosing the type of item to add */}
          <CardAdd
            open={this.state.add_modal}
            handleClose={this.handleCloseAddModal}
            handleSubmit={this.handleSubmitAddModal}
          />

          {/* Dialog box for editing the selected item, or adding a new one */}
          <CardEdit
            open={this.state.edit_modal}
            selected_item={this.state.data[this.state.selected_item]}
            selected_type={this.state.selected_type}
            handleClose={this.handleCloseEditModal}
            handleSubmit={this.handleSubmitEditModal}
            loadWalletData={loadWalletData}
            createWallet={createWallet}
            createTxInbox={createTxInbox}
          />

          {/* Dialog box for deleting the selected item */}
          <CardDelete
            open={this.state.delete_modal}
            selected_item={this.state.data[this.state.selected_item]}
            handleClose={this.handleCloseDeleteModal}
            handleSubmit={this.handleSubmitDeleteModal}
          />

          {/* About the app dialog box */}
          <AboutView
            open={this.state.about_modal}
            handleClose={this.handleCloseAboutModal}
          />

          {/* Confirmation alert */}
          <Snackbar
            open={this.state.snackbar}
            message={this.state.snackbar_message}
            autoHideDuration={4000}
            onRequestClose={this.handleCloseSnack}
          />

        </Container>
      </MuiThemeProvider>
    );
  }
}
