import React from 'react';
import { Image, List, Item } from 'semantic-ui-react'
import ViewDialogBox from './DialogBox.js';

import applogo from '../img/app_logo.png';
import { appInfo } from '../config.js';

const customContentStyle = {
  textAlign: "left"
};

export default class AboutView extends React.Component {
  render() {
    return (
      <ViewDialogBox {...this.props}
        title={this.props.i18nStrings.about}
        size="small"
        style={customContentStyle}
      >
        <Item.Group>
          <Item>
            <Image avatar src={applogo} />

            <Item.Content>
              <Item.Header>SAFE Wallet</Item.Header>
              <Item.Description>{this.props.i18nStrings.description}</Item.Description>
              <Item.Meta>
                <List>
                <List.Item>
                      <List.Content>
                        <List.Header>&nbsp;</List.Header>
                        <List.Description>{this.props.i18nStrings.version} {appInfo.version}</List.Description>
                        <List.Description>{this.props.i18nStrings.by} <a href="https://safenetforum.org/users/bochaco/activity">@bochaco</a></List.Description>
                      </List.Content>
                </List.Item>
                <List.Item>
                  {this.props.i18nStrings.donations} <span fontFamily='Courier New'><b>1KSJhUdDGZz2mx6WBw6Lco8RaPxqzTzRLL</b></span>
                </List.Item>
                </List>
              </Item.Meta>
            </Item.Content>
          </Item>
        </Item.Group>
      </ViewDialogBox>
    );
  }
}
