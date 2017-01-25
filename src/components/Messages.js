import React from 'react'
import { Grid, Message, Icon, List } from 'semantic-ui-react';
import { appInfo } from '../config.js';

export class MessageNoItems extends React.Component {
  render() {
    return (
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
    )
  }
}

export class MessageNotAuthorised extends React.Component {
  render() {
    return (
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
    )
  }
}

export class MessageAwatingAuth extends React.Component {
  render() {
    return (
      <Grid centered columns={3}>
        <Grid.Column width={6}>
          <Message info compact>
            <Message.Content>
              <Message.Header>Awaiting for access authorisation</Message.Header>
              Please authorise the application from
              the SAFE Authenticator in order to access your content:
            </Message.Content>
            <List as='ul'>
              <List.Item as='li'>App Name: {appInfo.name}</List.Item>
              <List.Item as='li'>Vendor:   {appInfo.vendor}</List.Item>
              <List.Item as='li'>Version:  {appInfo.version}</List.Item>
              <List.Item as='li'>Permissions:
                <List.Item as='ul'>
                  {appInfo.permissions.map((p, i) => (
                    <List.Item key={i}>- {p}</List.Item>
                  ))}
                </List.Item>
              </List.Item>
            </List>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
