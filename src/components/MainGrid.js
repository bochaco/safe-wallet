// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

import React from 'react'
import { Container } from 'semantic-ui-react';
import ItemCards from './ItemCard.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import CardView from './CardView.js';
import CardEdit from './CardEdit.js';
import CardAdd from './CardAdd.js';
import CardDelete from './CardDelete.js';
import AppMenu from './AppMenu.js';
import AboutView from './AboutView.js';
import { MessageNotAuthorised, MessageAwatingAuth, MessageNoItems } from './Messages.js';
import { appInfo, appPermissions } from '../config.js';
import { ContentApi } from '../i18n/read-content.js';
import { storage, altcoinWallet } from '../storage/safe-net.js';
import { Constants } from '../common.js';

const NET_STATE_CONNECTED = 'Connected';

const LOCALE_LANG = ContentApi.validateLang(window.navigator.language.substring(0,2));

const initialState = {
  safeApp: null,
  appState: Constants.APP_STATE_INIT,
  data: {},
  webIds: [],
  view_modal: false,
  edit_modal: false,
  add_modal: false,
  delete_modal: false,
  about_modal: false,
  snackbar: false,
  snackbar_message: '',
  selected_item: null,
  selected_type: null,
  lang: LOCALE_LANG,
  content: ContentApi.getContent(LOCALE_LANG).page,
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

    this.updateTxHistory = this.updateTxHistory.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.connectApplication();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  networkStateUpdate(state) {
    console.log("Network connection state changed to:", state)
    if (this.state.appState && state !== NET_STATE_CONNECTED) {
      let newState = initialState;
      newState.lang = this.state.lang;
      newState.content = this.state.content;
      this.setState(newState);
      this.handleOpenSnack(this.state.content.snackbar.fail_auth_revoked)
    }
  }

  handlePower() {
    if (this.state.appState === Constants.APP_STATE_INIT) {
      this.connectApplication();
    } else if (this.state.appState === Constants.APP_STATE_CONNECTED) {
      storage.disconnectApp();
      this.setState({safeApp: null, appState: Constants.APP_STATE_INIT});
    }
  }

  connectApplication() {
    this.setState({appState: Constants.APP_STATE_AUTHORISING});
    let safeApp;//, preferredLang;
    storage.authoriseApp(appInfo, appPermissions, this.networkStateUpdate)
      .then((authInfo) => {
        safeApp = authInfo.safeApp;
        this.setState({appState: Constants.APP_STATE_CONNECTING});
        return storage.connectApp(authInfo.authUri);
      })
      .then(() => storage.readConfigData())
      //.then((lang) => preferredLang = ContentApi.validateLang(lang))
      .then(() => storage.loadAppData())
      .then((parsedData) => {
        this.setState({
          safeApp,
          appState: Constants.APP_STATE_CONNECTED,
          data: parsedData,
          //lang: preferredLang,
          //content: ContentApi.getContent(preferredLang).page
        });
      })
      .then(() => storage.getWebIds())
      .then((webIds) => {
        this.setState({ webIds });
      })
      .catch((err) => {
        this.setState({appState: Constants.APP_STATE_INIT, data: {}});
        console.log("Authorisation or connection failed:", err);
      })
  }

  handleRefresh() {
    storage.loadAppData()
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

    return storage.saveAppItem(item2save)
      .then((savedItem) => {
        let updatedData = this.state.data;
        updatedData[savedItem.id] = savedItem;
        this.setState({data: updatedData});
      }, (err) => {
        throw Error("Failed storing data:", err);
      })
  }

  deleteData(item) {
    return storage.deleteAppItem(item)
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
        content: ContentApi.getContent(lang).page
      });
    }
  }

  handleOpenSnack(message) {
    this.setState({snackbar: true, snackbar_message: message});
  };

  handleCloseSnack() {
    this.setState({snackbar: false});
  };

  updateTxHistory(historyTxs) {
    let updatedItem = this.state.data[this.state.selected_item].content
    updatedItem.data.history = historyTxs;
    return this.storeData(updatedItem);
  }

  render() {
    let selectedItemContent;
    if (this.state.selected_item) {
      selectedItemContent = this.state.data[this.state.selected_item].content;
    }

    const muiThemeOpts = {
      typography: { useNextVariants: true },
    };

    return (
      <MuiThemeProvider theme={ createMuiTheme(muiThemeOpts) }>
        <Container fluid id='mainContainer'>
          {/* Top menu bar */}
          {(this.state.appState === Constants.APP_STATE_INIT
            || this.state.appState === Constants.APP_STATE_CONNECTED) &&
            <AppMenu
              handleOpenAboutModal={this.handleOpenAboutModal}
              handleOpenAddModal={this.handleOpenAddModal}
              handleRefresh={this.handleRefresh}
              handleChangeLang={this.handleChangeLang}
              appState={this.state.appState}
              handlePower={this.handlePower}
              lang={this.state.lang}
            />
          }

          {/* Warning message when the app is not authorised yet */}
          {(this.state.appState === Constants.APP_STATE_AUTHORISING
            || this.state.appState === Constants.APP_STATE_CONNECTING) &&
            <MessageAwatingAuth
              i18nStrings={this.state.content.messages}
              appState={this.state.appState}
            />
          }

          {/* Warning message when the app authorisation has been revoked */}
          {this.state.appState === Constants.APP_STATE_INIT &&
            <MessageNotAuthorised i18nStrings={this.state.content.messages} />
          }

          {/* List of items */}
          {this.state.appState === Constants.APP_STATE_CONNECTED &&
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
            updateTxHistory={this.updateTxHistory}
            safeApp={this.state.safeApp}
            altcoinWallet={altcoinWallet}
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
            selected_item_id={this.state.selected_item}
            selected_type={this.state.selected_type}
            handleClose={this.handleCloseEditModal}
            handleSubmit={this.handleSubmitEditModal}
            i18nStrings={this.state.content.items}
            safeApp={this.state.safeApp}
            altcoinWallet={altcoinWallet}
            webIds={this.state.webIds}
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
            onClose={this.handleCloseSnack}
          />

        </Container>
      </MuiThemeProvider>
    );
  }
}
