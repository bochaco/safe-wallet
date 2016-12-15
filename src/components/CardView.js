import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Segment, Image, Header, Icon } from 'semantic-ui-react'

import img_credit_card_view from '../img/credit_card3.jpg';
import img_pubkey from '../img/qr_pubkey.png';
import img_privkey from '../img/qr_privkey.png';


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
    if (this.props.selected_item != null) {
      switch (this.props.selected_item.type) {
        case 0:
          content = <CreditCardView data={this.props.selected_item.data} />;
          break;
        case 1:
          content = <PasswordView data={this.props.selected_item.data} />;
          break;
        case 2:
          content = <PrivPubKeysView data={this.props.selected_item.data} />;
          break;
        case 3:
          content = <TwoFAView data={this.props.selected_item.data} />;
          break;
        default:
          break;
      }
    }

    return (
      <div>
        <Dialog
          title={(this.props.selected_item == null) ? "" : this.props.selected_item.label}
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
    let QAs = this.props.data.questions.map((QA, i) => (
      <Grid.Column key={i}>
        <div>
          <Header sub>{QA.q}</Header>
          <span>{QA.a}</span>
        </div>
      </Grid.Column>
    ));

    return (
      <Grid columns='equal' divided='vertically'>
      <Grid.Row>
        <Grid.Column>
          <Header>
            <Icon name='user' color="teal" />
            <Header.Content>
              {this.props.data.username}
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
              {this.props.data.password}
              <Header.Subheader>
                Password
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        {QAs}
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
              {this.props.data.pk}
              <Header.Subheader>
                {this.props.data.sk}
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
                Security Code: {this.props.data.ccv}
              </Header.Content>
            </Header>
            <Header>
              <Icon name='payment' color="brown" />
              <Header.Content>
                PIN: {this.props.data.pin}
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
    let twoFAcodes = this.props.data.map((code, i) => (
      <Grid.Column key={i}>
        <Segment textAlign="center" compact secondary>{code}</Segment>
      </Grid.Column>
    ));

    return (
      <Grid columns='equal'>
        <Grid.Row columns={6}>
          {twoFAcodes}
        </Grid.Row>
      </Grid>
    );
  }
}
