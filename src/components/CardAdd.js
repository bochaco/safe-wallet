import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { List, Image } from 'semantic-ui-react'
import { ItemTypes } from '../common.js';

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
