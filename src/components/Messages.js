import React from 'react'
import { Image, Grid, Message, Icon } from 'semantic-ui-react';
import cup_of_tea from '../img/safe-wallet-logo.gif';
import logotipo from '../img/logo-white.png';

export class MessageAwatingAuth extends React.Component {
  render() {
    return (
      <Grid id='msgAwaiting' verticalAlign='middle' centered padded>
        <Grid.Row>
          {this.props.i18nStrings.authorising[0]}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Image id='antAwaiting' src={cup_of_tea} centered />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row id='msgAwaitingFooter'>
          <Image src={logotipo} centered />
        </Grid.Row>
      </Grid>
    )
  }
}

export class MessageNotAuthorised extends React.Component {
  render() {
    return (
      <Grid centered columns={3} padded>
        <Grid.Row>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Message negative compact icon>
              <Icon name='plug' />
              <Message.Content>
                <Message.Header>{this.props.i18nStrings.not_auth[0]}</Message.Header>
                {this.props.i18nStrings.not_auth[1]}
                <br/><br />{this.props.i18nStrings.not_auth[2]}<Icon name='power'/>{this.props.i18nStrings.not_auth[3]}
              </Message.Content>
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export class MessageNoItems extends React.Component {
  render() {
    return (
      <Grid id='msgNoItems' centered columns={1} padded>
        <Grid.Row>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Message icon>
              <Icon name='hand peace' />
              <Message.Content>
                {this.props.i18nStrings.no_items[0]} <Icon name='add circle'/>{this.props.i18nStrings.no_items[1]}
              </Message.Content>
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
