import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Image, List, Item } from 'semantic-ui-react'

import applogo from '../img/app_logo.png';

const customContentStyle = {
  width: '45%',
  maxWidth: 'none',
};

export default class AboutView extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Close"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title="About"
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          <Item.Group>
            <Item>
              <Image avatar src={applogo} />

              <Item.Content>
                <Item.Header>SAFE Wallet</Item.Header>
                <Item.Description>A wallet to manage credit card numbers, passwords, safecoin wallet(s), and many other type of personal information.</Item.Description>
                <Item.Meta>
                  <List>
                  <List.Item>
                        <List.Content>
                          <List.Header>Version 0.0.1</List.Header>
                          <List.Description>by <a>@bochaco</a></List.Description>
                        </List.Content>
                  </List.Item>
                  <List.Item>
                    Donations greatly appreciated 0x000000000
                  </List.Item>
                  </List>
                </Item.Meta>
              </Item.Content>
            </Item>
          </Item.Group>
        </Dialog>
      </div>
    );
  }
}
