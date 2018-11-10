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
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

export default class SafecoinView extends React.Component {
  render() {
    return (
      <div>{this.props.i18nStrings.item_safecoin_coming_soon}</div>
    );
  }
}

export class SafecoinEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

  };

  render() {
    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_SAFECOIN}
        handleSubmit={this.props.handleClose}
      >
      <div>{this.props.i18nStrings.item_safecoin_coming_soon}</div>
      </EditDialogBox>
    );
  }
}

SafecoinEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
