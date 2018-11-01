import React from 'react';
import { Button } from '@material-ui/core';
import { Close, Check, Add, Delete } from '@material-ui/icons';
import { Image, Header, Modal, Label } from 'semantic-ui-react'
import { ItemTypes } from '../common.js';

const styles = {
  dialogBox: {
    textAlign: 'center',
  },
  primButtonStyle: {
    backgroundColor: '#00bcd4',
  },
  secButtonStyle: {
    backgroundColor: '#ffffff',
  }
};

export default class ViewDialogBox extends React.Component {
  render() {
    return (
      <Modal
        open={this.props.open}
        size={this.props.size}
        closeOnEscape={this.props.closeOnEscape}
        onClose={this.props.handleClose}
      >
        <Modal.Header style={styles.dialogBox}>
          {this.props.title ? this.props.title :
              (<Header as='h2'>
                <Image src={ItemTypes[this.props.selected_item.type].icon} />
                {" " + this.props.selected_item.metadata.label}
              </Header>)
          }
        </Modal.Header>
        <Modal.Content style={styles.dialogBox}>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='primary'
            variant='contained'
            size='medium'
            style={styles.primButtonStyle}
            onClick={this.props.handleClose}
          >
            <Close />
            {this.props.i18nStrings.btn_close}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export class EditDialogBox extends React.Component {
  render() {
    return (
      <Modal open={this.props.open} >
        <Modal.Header style={styles.dialogBox} >
          {
            <Header as='h2'>
              <Image src={ItemTypes[this.props.type].icon} />
              {this.props.i18nStrings[ItemTypes[this.props.type].title]}
            </Header>
          }
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
          {this.props.selected_item && this.props.selected_item.lastUpdate &&
            <Label attached='bottom left' size='tiny'>
              {this.props.i18nStrings.last_update}
              <Label.Detail>
                {this.props.selected_item.lastUpdate}
              </Label.Detail>
            </Label>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant='contained'
            size='medium'
            style={styles.secButtonStyle}
            onClick={this.props.handleClose}
          >
            <Close />
            {this.props.i18nStrings.btn_cancel}
          </Button>
          <Button
            color='primary'
            variant='contained'
            size='medium'
            style={styles.primButtonStyle}
            onClick={this.props.handleSubmit}
          >
            {this.props.selected_item ? <Check /> : <Add />}
            {this.props.selected_item ? this.props.i18nStrings.btn_save : this.props.i18nStrings.btn_add}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export class DeleteDialogBox extends React.Component {
  render() {
    return (
      <Modal open={this.props.open} size={"small"} >
        <Modal.Header style={styles.dialogBox} >
          {this.props.i18nStrings.confirm_delete}
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant='contained'
            size='medium'
            style={styles.secButtonStyle}
            onClick={this.props.handleClose}
          >
            <Close />
            {this.props.i18nStrings.btn_cancel}
          </Button>
          <Button
            color='primary'
            variant='contained'
            size='medium'
            style={styles.primButtonStyle}
            onClick={this.props.handleSubmit}
          >
            <Delete />
            {this.props.i18nStrings.btn_delete}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export class ConfirmTransferDialogBox extends React.Component {
  render() {
    return (
      <Modal
        open={this.props.open}
        closeOnEscape={false}
        size={"small"}
      >
        <Modal.Header style={styles.dialogBox} >
          {this.props.i18nStrings.confirm_tx}
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant='contained'
            size='medium'
            style={styles.secButtonStyle}
            onClick={this.props.handleClose}
          >
            {this.props.i18nStrings.btn_cancel}
            <Close />
          </Button>
          <Button
            color='primary'
            variant='contained'
            size='medium'
            style={styles.primButtonStyle}
            onClick={this.props.handleSubmit}
          >
            <Check />
            {this.props.i18nStrings.btn_confirm}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
