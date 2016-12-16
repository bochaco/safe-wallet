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
import {authoriseApp, isTokenValid, loadData, saveData} from '../storage.js';
//import {file_content} from '../../misc/sample-data.js';

// TODO: move this to a config file
const app = {
  name: 'SAFE Wallet',
  id: 'safe-wallet.bochaco',
  version: '0.0.1',
  vendor: 'bochaco',
  permissions: ["SAFE_DRIVE_ACCESS", "LOW_LEVEL_API"]
};

export default class MainGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthorised: null,
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
    }

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
  }

  componentWillMount() {
    this.requestAuthorisation();
//    this.setState({isAuthorised: true, data: file_content});
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      2000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    if (this.state.isAuthorised) {
      isTokenValid()
        .then(() => {}, (err) => {
          this.setState({
            isAuthorised: false,
            data: {},
            view_modal: false,
            edit_modal: false,
            add_modal: false,
            delete_modal: false,
            about_modal: false,
            selected_item: null,
            selected_type: null,
          });
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
    authoriseApp(app)
      .then(loadData)
      .then((parsedData) => {
        this.setState({isAuthorised: true, data: parsedData});
//        this.storeData(file_content);
      }, (err) => {
        this.setState({isAuthorised: false, data: {}});
        console.log("Authentication Failed:", err);
      })
  }

  handleRefresh() {
    loadData()
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        console.log("Failed refreshing data:", err);
      })
    this.handleOpenSnack("List of items re-loaded from the SAFE network");
  }

  storeData(data) {
    return saveData(data)
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
    if (index != null && this.state.data[index].type === 2) { // JUST FOR DEMO
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
        newItem.type = 2; // TODO: the type shall be provided
        newItem.index = 1000; // TODO: the index needs to be calculated, or assign null and make null the last
        updatedData.push(newItem);
      } else {
        updatedData[this.state.selected_item].label = newItem.label;
        updatedData[this.state.selected_item].data = newItem.data;
      }
      this.storeData(updatedData)
        .then(() => {console.log("New item stored", newItem)})
//        this.setState({data: updatedData});
        this.handleOpenSnack("Item saved in the SAFE network");
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
    if (type === 2) { // JUST FOR DEMO
      this.setState({selected_type: type, add_modal: false, edit_modal: true});
    }
  };

  handleOpenDeleteModal(index) {
    this.setState({delete_modal: true, selected_item: index});
  };

  handleCloseDeleteModal() {
    this.setState({delete_modal: false, selected_item: null});
  };

  handleSubmitDeleteModal() {
    let updatedData = this.state.data;
    updatedData.splice(this.state.selected_item, 1);
    this.storeData(updatedData)
      .then(() => {this.handleOpenSnack("Item deleted from the SAFE network")},
      (err) => {this.handleOpenSnack("Failed to delete item")})

//    this.setState({data: updatedData});
//    this.handleOpenSnack("Item deleted");
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
                    <List.Item as='li'>App Name: SAFE Wallet</List.Item>
                    <List.Item as='li'>Vendor:   bochaco</List.Item>
                    <List.Item as='li'>Version:  0.0.1</List.Item>
                    <List.Item as='li'>Permissions:
                      <List.Item as='ul'>
                        <List.Item>- SAFE Drive Access</List.Item>
                        <List.Item>- Low Level API</List.Item>
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