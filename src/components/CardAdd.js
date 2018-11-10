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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { List, Image } from 'semantic-ui-react'
import { ItemTypes } from '../common.js';

const styles = {
  primButtonStyle: {
    backgroundColor: '#00bcd4',
  }
};

export default class CardAdd extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          scroll='paper'
        >
          <DialogTitle>{this.props.i18nStrings.item_to_add}</DialogTitle>
          <DialogContent style={{ textAlign: 'center' }}>
            <List selection size='large' animated verticalAlign='middle'>
              {Object.keys(ItemTypes).map((index) => (
                  <List.Item key={index}
                    onClick={() => {this.props.handleSubmit(ItemTypes[index].type)}}>
                    <Image size='mini' src={ItemTypes[index].icon} />
                    <List.Content>
                      <List.Header>{this.props.i18nStrings[ItemTypes[index].title]}</List.Header>
                    </List.Content>
                  </List.Item>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              variant='contained'
              style={styles.primButtonStyle}
              onClick={this.props.handleClose}
            >
              <Close />
              {this.props.i18nStrings.btn_cancel}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
