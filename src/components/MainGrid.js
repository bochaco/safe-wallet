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
import { appInfo, appPermissions } from '../config.js';
import { Api } from '../i18n/read-content.js';

function loadStorage() {
  if (process.env.REACT_APP_SAFENET_OFF === "1") {
    console.log('SAFE_NET_OFF env var detected. Working with data in memory only');
    return require('../storage/storage-in-memory.js');
  } else {
    return require('../storage/storage.js');
  }
}

const NET_STATE_CONNECTED = 'Connected';

var {connectApp, disconnectApp, loadAppData, saveAppItem, deleteAppItem, loadWalletData,
  transferCoin, createWallet, saveWalletData, /*deleteWallet,*/ checkOwnership,
  createTxInbox, readTxInboxData, /*deleteTxInbox,*/ emptyTxInbox, sendTxNotif} = loadStorage();

const initialState = {
  isAuthorised: false,
  data: {},
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

export default class MainGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.handleRefresh = this.handleRefresh.bind(this);
    this.networkStateUpdate = this.networkStateUpdate.bind(this);

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
    this.connectApplication = this.connectApplication.bind(this);
    this.storeData = this.storeData.bind(this);
    this.deleteData = this.deleteData.bind(this);

    this.appendTx2History = this.appendTx2History.bind(this);
  }

  componentWillMount() {
    this.setState({content: Api.getContent(this.state.lang).page});
  }

  componentDidMount() {
    this.connectApplication();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  networkStateUpdate(state) {
    console.log("NEW STATE:", this.state.isAuthorised, state)
    if (this.state.isAuthorised && state !== NET_STATE_CONNECTED) {
      let newState = initialState;
      newState.lang = this.state.lang;
      newState.content = Api.getContent(this.state.lang).page;
      this.setState(newState);
      this.handleOpenSnack(this.state.content.snackbar.fail_auth_revoked)
    }
  }

  handlePower() {
      // Note that state.isAuthorised can be null when it's in authorisation process
      if (this.state.isAuthorised === false) {
        this.connectApplication();
      } else if (this.state.isAuthorised) {
        disconnectApp();
        this.setState({isAuthorised: false});
      }
  }

  connectApplication() {
    this.setState({isAuthorised: null});
    let preferredLang;
    connectApp(appInfo, appPermissions, this.networkStateUpdate)
      .then((configData) => preferredLang = configData)
      .then(loadAppData)
      .then((parsedData) => {
        this.setState({
          isAuthorised: true,
          data: parsedData,
          lang: preferredLang,
          content: Api.getContent(preferredLang).page
        });
      })
      .catch((err) => {
        this.setState({isAuthorised: false, data: {}});
        console.log("Authorisation or connection failed:", err);
      })
  }

  handleRefresh() {
    loadAppData()
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        console.log("Failed refreshing data: ", err);
      })
    this.handleOpenSnack(this.state.content.snackbar.items_reloaded);
  }

  storeData(item) {
    let item2save = {
      id: this.state.selected_item,
      version: this.state.selected_item ? this.state.data[this.state.selected_item].version : null,
      content: item
    };

    return saveAppItem(item2save)
      .then((savedItem) => {
        let updatedData = this.state.data;
        updatedData[savedItem.id] = savedItem;
        this.setState({data: updatedData});
      }, (err) => {
        throw Error("Failed storing data:", err);
      })
  }

  deleteData(item) {
    return deleteAppItem(item)
      .then(() => {
        let updatedData = this.state.data;
        delete updatedData[item.id];
        this.setState({data: updatedData});
      }, (err) => {
        throw Error("Failed deleting data:", err);
      })
  }

  handleOpenViewModal(id) {
    this.setState({view_modal: true, selected_item: id});
  };

  handleCloseViewModal() {
    this.setState({view_modal: false, selected_item: null});
  };

  handleOpenEditModal(id) {
    if (id != null) {
      this.setState({edit_modal: true, selected_item: id});
    }
  };

  handleCloseEditModal() {
    this.setState({edit_modal: false, selected_item: null});
  };

  handleSubmitEditModal(item) {
    if (item != null) {
      item.lastUpdate = (new Date()).toUTCString();
      this.storeData(item)
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

  handleOpenDeleteModal(id) {
    this.setState({delete_modal: true, selected_item: id});
  };

  handleCloseDeleteModal() {
    this.setState({delete_modal: false, selected_item: null});
  };

  handleSubmitDeleteModal() {
    //TODO; not sure if this should be done in production
//    deleteTxInbox(this.state.data[this.state.selected_item].data.pk);
//    deleteWallet(this.state.data[this.state.selected_item].data.pk);

    this.deleteData(this.state.data[this.state.selected_item])
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
    let selectedItemContent;
    if (this.state.selected_item) {
      selectedItemContent = this.state.data[this.state.selected_item].content;
    }

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
            selected_item={selectedItemContent}
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
            selected_item={selectedItemContent}
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
            selected_item={selectedItemContent}
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
