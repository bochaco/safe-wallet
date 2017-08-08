import React from 'react'
import { Grid, Message, Icon, List } from 'semantic-ui-react';
import { appInfo, appPermissions } from '../config.js';

export class MessageNoItems extends React.Component {
  render() {
    return (
      <Grid centered columns={1}>
        <Grid.Column width={10} textAlign='center'>
          <Message visible >
            <Message.Content>
              {this.props.i18nStrings.no_items[0]}<Icon name='add circle'/>{this.props.i18nStrings.no_items[1]}
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
              <Message.Header>{this.props.i18nStrings.not_auth[0]}</Message.Header>
              {this.props.i18nStrings.not_auth[1]}
              <br/><br />{this.props.i18nStrings.not_auth[2]}<Icon name='power'/>{this.props.i18nStrings.not_auth[3]}
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
        <Grid.Column width={8}>
          <Message info compact>
            <Message.Content>
              <Message.Header>{this.props.i18nStrings.authorising[0]}</Message.Header>
              {this.props.i18nStrings.authorising[1]}
            </Message.Content>
            <List as='ul'>
              <List.Item as='li'>{this.props.i18nStrings.authorising[2]}{appInfo.name}</List.Item>
              <List.Item as='li'>{this.props.i18nStrings.authorising[3]}{appInfo.vendor}</List.Item>
              <List.Item as='li'>{this.props.i18nStrings.authorising[4]}{appInfo.id}</List.Item>
              <List.Item as='li'>{this.props.i18nStrings.authorising[5]}
                <List.Item as='ul'>
                  {Object.keys(appPermissions).map((key) => (
                    <List.Item key={key}>- {key} {this.props.i18nStrings.permissions[appPermissions[key]]}</List.Item>
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
