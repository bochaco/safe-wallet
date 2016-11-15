import React from 'react'
import { Card, Container } from 'semantic-ui-react';
import {GridList, GridTile} from 'material-ui/GridList';
import ItemCard from './ItemCard.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CardView from './CardView.js';
import AppMenu from './AppMenu.js';

export default class MainGrid extends React.Component {
  constructor(props) {
     super(props);

     this.state = {
       data: [ /* type: 0=Credit Card, 1=Password, 2=Priv/Pub Key, 3=2FA Codes */
         {id: 10, type: 0, index: 1, label: "My prepaid VISA card from Bank 'A'"},
         {id: 20, type: 1, index: 2, label: "Bank 'A' Homebanking"},
         {id: 12, type: 2, index: 3, label: "Bitcoin savings"},
         {id: 17, type: 2, index: 4, label: "Ethereum keys"},
         {id:  4, type: 4, index: 5, label: "Safecoin wallet for trip"},
         {id: 14, type: 3, index: 6, label: "Bank 'A' 2FA emergency codes"},
         {id: 23, type: 1, index: 7, label: "myusername@gmail.com"},
       ],
       view_modal: false,
       selected_item: {},
     }
/*
     console.log('Authorising application');

     let app = {
       name: window.location.host,
       id: 'tutorial.maidsafe.net',
       version: '0.1.0',
       vendor: 'maidsafe',
       permissions: [
         'LOW_LEVEL_API', "SAFE_DRIVE_ACCESS"
       ]
     }

     window.safeAuth.authorise(app).then((res) => {
       console.log(res.__parsedResponseBody__);
     }, (err) => {
       console.error(err);
     });
*/
     this.handleOpenModal = this.handleOpenModal.bind(this);
     this.handleCloseModal = this.handleCloseModal.bind(this);
  };

  handleOpenModal(component, event) {
    this.setState({view_modal: true, selected_item: component.props.item});
  };

  handleCloseModal() {
    this.setState({view_modal: false});
  };

  render() {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {

        overflowY: 'auto',
      },
    };

    const cards = this.state.data.map((item, index) => (
        <ItemCard key={index} item={item} handleOpenModal={this.handleOpenModal} />
    ));

    return (
      <MuiThemeProvider>
        <Container>
          <AppMenu />
          <Card.Group itemsPerRow={3}>
            {cards}
          </Card.Group>

          {/*<div style={styles.root}>
            <GridList

              style={styles.gridList}
            >
              {this.state.data.map((item, index) => (
                <GridTile key={index}>
                  <ItemCard key={index} item={item} handleOpenModal={this.handleOpenModal} />
                </GridTile>
              ))}
            </GridList>
          </div>*/}

          <CardView
            open={this.state.view_modal}
            selected_item={this.state.selected_item}
            handleClose={this.handleCloseModal}
          />
        </Container>
      </MuiThemeProvider>
    );
  }
}
