import React from 'react'
import { Card, Container, Segment, Message, Icon } from 'semantic-ui-react';
import ItemCard from './ItemCard.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CardView from './CardView.js';
import EditDialog from './CardEdit.js';
import CardDelete from './CardDelete.js';
import AppMenu from './AppMenu.js';
import AboutView from './AboutView.js';
import {authoriseApp, loadData, saveData} from '../storage.js';
import {file_content} from '../../misc/sample-data.js';

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
      isAuthorised: false,
      data: {},
      view_modal: false,
      edit_modal: false,
      delete_modal: false,
      about_modal: false,
      selected_item: null,
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

    this.handleOpenAboutModal = this.handleOpenAboutModal.bind(this);
    this.handleCloseAboutModal = this.handleCloseAboutModal.bind(this);

    this.authoriseApp = authoriseApp.bind(this);
    this.storeData = this.storeData.bind(this);
  }

  componentWillMount() {
/*    this.authoriseApp(app)
      .then(loadData)
      .then((parsedData) => {
        this.setState({isAuthorised: true, data: parsedData});
//        this.storeData(file_content);
      }, (err) => {
        this.setState({isAuthorised: false});
        throw Error("Authentication Failed:", err);
      })
*/
    this.setState({isAuthorised: true, data: file_content});
  }

  handleRefresh() {
    loadData()
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        throw Error("Failed refreshing data:", err);
      })
//    this.storeData(file_content);
  }

  storeData(data) {
    return saveData(data)
      .then((parsedData) => {
        this.setState({data: parsedData});
      }, (err) => {
        console.log("Failed storing data:", err);
      })
  }

  handleOpenViewModal(index) {
    this.setState({view_modal: true, selected_item: index});
  };

  handleCloseViewModal() {
    this.setState({view_modal: false, selected_item: null});
  };

  handleOpenEditModal(index) {
    this.setState({edit_modal: true, selected_item: index});
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
    }
    this.setState({edit_modal: false, selected_item: null});
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
      .then(() => {console.log("Item deleted")})
    this.setState({delete_modal: false, selected_item: null});
  };

  handleOpenAboutModal() {
    this.setState({about_modal: true});
  };

  handleCloseAboutModal() {
    this.setState({about_modal: false});
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
      cards = <Message floating>You have no items stored in your wallet</Message>;
    }

    return (
      <MuiThemeProvider>
        <Container>
          {/* Top menu bar */}
          <AppMenu
            handleOpenAboutModal={this.handleOpenAboutModal}
            handleOpenEditModal={this.handleOpenEditModal}
            handleRefresh={this.handleRefresh}
            isAuthorised={this.state.isAuthorised}
          />

          {/* Warning message when the app is not authorised yet */}
          {!this.state.isAuthorised &&
            <Message warning icon>
              <Icon name='circle notched' loading />
              <Message.Content>
                <Message.Header>Application not authorised</Message.Header>
                Please authorise the 'SAFE Wallet' application in your SAFE Authenticator in order to access your content on the SAFE network.
              </Message.Content>
            </Message>
          }

          {/* List of items */}
          {this.state.isAuthorised && cards}

          {/* Dialog box for viewing the selected item */}
          <CardView
            open={this.state.view_modal}
            selected_item={this.state.data[this.state.selected_item]}
            handleClose={this.handleCloseViewModal}
          />

          {/* Dialog box for editing the selected item, or adding a new one */}
          <EditDialog
            open={this.state.edit_modal}
            selected_item={(this.state.selected_item == null) ? null : this.state.data[this.state.selected_item]}
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

        </Container>
      </MuiThemeProvider>
    );
  }
}
