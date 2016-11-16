import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Segment, Image, Header, Icon } from 'semantic-ui-react'

import img_credit_card_view from './img/credit_card3.jpg';
import img_pubkey from './img/qr_pubkey.png';
import img_privkey from './img/qr_privkey.png';


export default class CardView extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Close"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
    ];

    var content = "";
    switch (this.props.selected_item.type) {
      case 0:
        content = <CreditCardView />;
        break;
      case 1:
        content = <PasswordView />;
        break;
      case 2:
        content = <PrivPubKeysView />;
        break;
      case 3:
        content = <TwoFAView />;
        break;
      default:
        break;
    }

    return (
      <div>
        <Dialog
          title={this.props.selected_item.label}
          actions={actions}
          modal={false}
          contentStyle={{textAlign: 'center'}}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          {content}
        </Dialog>
      </div>
    );
  }
}

class PasswordView extends React.Component {
  render() {
    return (
      <Grid columns='equal' divided='vertically'>
      <Grid.Row>
        <Grid.Column>
          <Header>
            <Icon name='user' color="teal" />
            <Header.Content>
              myusername
              <Header.Subheader>
                Username
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header>
            <Icon name='privacy' color="teal" />
            <Header.Content>
              password1234
              <Header.Subheader>
                Password
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <div>
            <Header sub>What is your favorite city?</Header>
            <span>London</span>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div>
            <Header sub>What is the name of your first school?</Header>
            <span>Public School</span>
          </div>
        </Grid.Column>
      </Grid.Row>
      </Grid>
    );
  }
}

class PrivPubKeysView extends React.Component {
  render() {
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column width={4}>
            <Header as='h4'>Public Key</Header>
          </Grid.Column>
          <Grid.Column width={9}>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as='h4'>Private Key</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={4}>
            <Image src={img_pubkey} />
          </Grid.Column>
          <Grid.Column width={9}>
            <Header as='h5' color='green'>
              1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4
              <Header.Subheader>
                L3t2ompeWyP28EvPdjfpGAqnnk3N8zRWUmAVzgZKKubSVDcCAqav
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src={img_privkey} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class CreditCardView extends React.Component {
  render() {
    return (
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Image src={img_credit_card_view} />
          </Grid.Column>
          <Grid.Column>
            <br/>
            <Header>
              <Icon name='protect' color="brown" />
              <Header.Content>
                Security Code: 987
              </Header.Content>
            </Header>
            <Header>
              <Icon name='payment' color="brown" />
              <Header.Content>
                PIN: 1234
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class TwoFAView extends React.Component {
  render() {
    return (
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
