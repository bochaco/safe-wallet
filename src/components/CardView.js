import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Grid, Image, Header, Icon, Container, Segment } from 'semantic-ui-react'

import img_credit_card_view from '../img/credit_card3.jpg';
import img_pubkey from '../img/qr_pubkey.png';
import img_privkey from '../img/qr_privkey.png';

import icon_cc from '../img/credit_card.jpg';
import icon_pwd from '../img/password.jpg';
import icon_qr from '../img/qr_code.png';
import icon_2fa from '../img/2fa.png';
import icon_safecoin from '../img/safecoin.png';
import icon_unknown from '../img/unknown.png';

export default class CardView extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Close"
        primary={true}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
    ];

    var content = "", icon="";
    if (this.props.selected_item != null) {
      switch (this.props.selected_item.type) {
        case 0:
          content = <CreditCardView data={this.props.selected_item.data} />;
          icon = <Image size='mini' src={icon_cc} />;
          break;
        case 1:
          content = <PasswordView data={this.props.selected_item.data} />;
            icon = <Image size='mini' src={icon_pwd} />;
          break;
        case 2:
          content = <PrivPubKeysView data={this.props.selected_item.data} />;
          icon = <Image size='mini' src={icon_qr} />;
          break;
        case 3:
          content = <TwoFAView data={this.props.selected_item.data} />;
          icon = <Image size='mini' src={icon_2fa} />;
          break;
        case 4:
          //content = <Safecoin data={this.props.selected_item.data} />;
          icon = <Image size='mini' src={icon_safecoin} />;
          break;
        default:
          icon = <Image size='mini' src={icon_unknown} />;
          break;
      }
    }

    return (
      <div>
        <Dialog
          title={
            <Header as='h2'>
              {icon}
              {(this.props.selected_item == null)
                ? "" : " " + this.props.selected_item.label}
            </Header>
          }
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
    let QAs = this.props.data.questions.map((qa, i) => (
      <Grid.Column key={i}>
        <div>
          <Header sub>{qa.q}</Header>
          <span>{qa.a}</span>
        </div>
      </Grid.Column>
    ));

    return (
      <Grid columns='equal' divided={QAs.length > 0 ? 'vertically' : false}>
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
          <Grid.Column width={3}>
            <Header as='h4'>Public Key</Header>
          </Grid.Column>
          <Grid.Column width={10}>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as='h4'>Private Key</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={3}>
            <Image src={img_pubkey} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as='h5' color='green'>
              {this.props.data.pk}
              <Header.Subheader>
                {this.props.data.sk}
              </Header.Subheader>
            </Header>
            <Container textAlign='left'>
              <Header as='h4'>Balance & Transactions notes:</Header>
              {this.props.data.notes}
            </Container>
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
                Security Code: {this.props.data.cvv}
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
    let twoFAcodes = [];
    if (this.props.data) {
      const numberOfCols = 4;
      let row_codes = [];
      let max = (numberOfCols * Math.ceil(this.props.data.length / numberOfCols));
      for (let i=0; i < max; i++) {
        row_codes.push(
          <Grid.Column key={2*i+1}>
            {this.props.data[i] ?
            <Segment color="violet" size="big" textAlign="center" secondary>
              {this.props.data[i]}
            </Segment>
            : ''}
          </Grid.Column>
        );

        if (i > 0 && ((i % numberOfCols === numberOfCols - 1) || i === max-1)) {
          twoFAcodes.push(
            <Grid.Row key={2*i}>
              {row_codes}
            </Grid.Row>
          );
          row_codes = [];
        }
      }
    }

    return (
      <Grid columns='equal'>
        {twoFAcodes}
      </Grid>
    );
  }
}
