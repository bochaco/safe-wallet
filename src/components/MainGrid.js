import React from 'react'
import { Container } from 'semantic-ui-react';
import ItemCards from './ItemCard.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import CardView from './CardView.js';
import CardEdit from './CardEdit.js';
import CardAdd from './CardAdd.js';
import CardDelete from './CardDelete.js';
import AppMenu from './AppMenu.js';
import AboutView from './AboutView.js';
import { MessageNotAuthorised, MessageAwatingAuth, MessageNoItems } from './Messages.js';
import { appInfo } from '../config.js';
import { Api } from '../i18n/read-content.js';

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
  createTxInbox, readTxInboxData, /*deleteTxInbox,*/ emptyTxInbox, sendTxNotif} = loadStorage();

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
  lang: 'en',
  content: null,
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

    this.handleChangeLang = this.handleChangeLang.bind(this);

    this.handleOpenSnack = this.handleOpenSnack.bind(this);
    this.handleCloseSnack = this.handleCloseSnack.bind(this);

    this.handlePower = this.handlePower.bind(this);
    this.requestAuthorisation = this.requestAuthorisation.bind(this);
    this.storeData = this.storeData.bind(this);

    this.appendTx2History = this.appendTx2History.bind(this);
  }

  componentWillMount() {
    this.setState({content: Api.getContent(this.state.lang).page});
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
          this.handleOpenSnack(this.state.content.snackbar.fail_auth_revoked)
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
    this.handleOpenSnack(this.state.content.snackbar.items_reloaded);
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
      if (this.state.selected_item == null) { // then add a new item
        newItem.id = 100; // TODO: this needs to be reviewed, perhaps is the key of the MD entry
        newItem.lastUpdate = (new Date()).toUTCString();
        updatedData.push(newItem);
      } else {
        updatedData[this.state.selected_item].lastUpdate = (new Date()).toUTCString();
        updatedData[this.state.selected_item].metadata = newItem.metadata;
        updatedData[this.state.selected_item].data = newItem.data;
      }
      this.storeData(updatedData)
        .then(() => {this.handleOpenSnack(this.state.content.snackbar.item_saved)})
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
      .then(() => {this.handleOpenSnack(this.state.content.snackbar.item_deleted)},
      (err) => {this.handleOpenSnack(this.state.content.snackbar.fail_deleting)})

    this.setState({delete_modal: false, selected_item: null});
  };

  handleOpenAboutModal() {
    this.setState({about_modal: true});
  };

  handleCloseAboutModal() {
    this.setState({about_modal: false});
  };

  handleChangeLang(lang) {
    if (lang !== this.state.lang) {
      this.setState({
        lang: lang,
        content: Api.getContent(lang).page
      });
    }
  }

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
    return (
      <MuiThemeProvider>
        <Container>
          {/* Top menu bar */}
          <AppMenu
            handleOpenAboutModal={this.handleOpenAboutModal}
            handleOpenAddModal={this.handleOpenAddModal}
            handleRefresh={this.handleRefresh}
            handleChangeLang={this.handleChangeLang}
            isAuthorised={this.state.isAuthorised}
            handlePower={this.handlePower}
            lang={this.state.lang}
          />

          {/* Warning message when the app is not authorised yet */}
          {this.state.isAuthorised == null && <MessageAwatingAuth i18nStrings={this.state.content.messages} />}

          {/* Warning message when the app authorisation has been revoked */}
          {this.state.isAuthorised === false && <MessageNotAuthorised i18nStrings={this.state.content.messages} />}

          {/* List of items */}
          {this.state.isAuthorised &&
            <ItemCards
              data={this.state.data}
              handleView={this.handleOpenViewModal}
              handleEdit={this.handleOpenEditModal}
              handleDelete={this.handleOpenDeleteModal}
              i18nStrings={this.state.content.items}
              noItemsComponent={<MessageNoItems i18nStrings={this.state.content.messages} />}
            />
          }

          {/* Dialog box for viewing the selected item */}
          <CardView
            open={this.state.view_modal}
            selected_item={this.state.data[this.state.selected_item]}
            handleClose={this.handleCloseViewModal}
            i18nStrings={this.state.content.items}
            loadWalletData={loadWalletData}
            transferCoin={transferCoin}
            readTxInboxData={readTxInboxData}
            saveWalletData={saveWalletData}
            checkOwnership={checkOwnership}
            emptyTxInbox={emptyTxInbox}
            appendTx2History={this.appendTx2History}
            sendTxNotif={sendTxNotif}
          />

          {/* Dialog box for choosing the type of item to add */}
          <CardAdd
            open={this.state.add_modal}
            handleClose={this.handleCloseAddModal}
            handleSubmit={this.handleSubmitAddModal}
            i18nStrings={this.state.content.items}
          />

          {/* Dialog box for editing the selected item, or adding a new one */}
          <CardEdit
            open={this.state.edit_modal}
            selected_item={this.state.data[this.state.selected_item]}
            selected_type={this.state.selected_type}
            handleClose={this.handleCloseEditModal}
            handleSubmit={this.handleSubmitEditModal}
            i18nStrings={this.state.content.items}
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
            i18nStrings={this.state.content.items}
          />

          {/* About the app dialog box */}
          <AboutView
            open={this.state.about_modal}
            handleClose={this.handleCloseAboutModal}
            i18nStrings={this.state.content.about}
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
