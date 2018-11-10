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
import { Grid, Image, Header } from 'semantic-ui-react';
import { ItemTypes } from '../common.js';
import { DeleteDialogBox } from './DialogBox.js';

export default class CardDelete extends React.Component {
  render() {
    if (!this.props.open || this.props.selected_item == null) {
      return null;
    }

    let item = ItemTypes[this.props.selected_item.type];

    return (
      <DeleteDialogBox {...this.props} >
        <Grid centered columns={3}>
          <Grid.Column width={13}>
            <Header as='h3'>
              <Image floated='left' size='tiny' src={item.icon} />
              <Header.Content>
                <Header.Subheader>
                  {this.props.i18nStrings[item.title]}
                </Header.Subheader>
                {this.props.selected_item.metadata.label}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>

      </DeleteDialogBox>
    );
  }
}
