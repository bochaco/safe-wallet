// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

import React from 'react';
import { Image, List, Item } from 'semantic-ui-react'
import ViewDialogBox from './DialogBox.js';

import anita from '../img/anita.png';
import branding from '../img/branding.png';
let appInfo = require('../../package.json');

const customContentStyle = {
  textAlign: "left"
};

const DONATIONS_ADDR = '1KSJhUdDGZz2mx6WBw6Lco8RaPxqzTzRLL';

export default class AboutView extends React.Component {
  render() {
    return (
      <ViewDialogBox {...this.props}
        title={<Image src={branding} size='small' />}
        size="small"
        style={customContentStyle}
      >
        <Item.Group>
          <Item>
            <Image src={anita} />

            <Item.Content>
              <Item.Header></Item.Header>
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
                  {this.props.i18nStrings.donations} <span fontFamily='Courier New'><b>{DONATIONS_ADDR}</b></span>
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
