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
import { ItemTypes, Constants } from '../common.js';

import ViewDialogBox from './DialogBox.js';

export default class CardView extends React.Component {
  render() {
    if (!this.props.open || this.props.selected_item == null) {
      return null;
    }

    return (
      <ViewDialogBox
        {...this.props}
        closeOnEscape={this.props.selected_item.type !== Constants.TYPE_ALTCOIN}
      >
        {ItemTypes[this.props.selected_item.type].viewDialogFactory(this.props)}
      </ViewDialogBox>
    );
  }
}
