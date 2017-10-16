import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Image, Header, Modal, Label } from 'semantic-ui-react'
import { ItemTypes } from '../common.js';

const styles = {
  dialogBox: {
    textAlign: 'center',
  },
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
        <Modal.Header style={this.props.style}>
          {this.props.title ? this.props.title :
              (<Header as='h2'>
                <Image src={ItemTypes[this.props.selected_item.type].icon} />
                {" " + this.props.selected_item.metadata.label}
              </Header>)
          }
        </Modal.Header>
        <Modal.Content style={this.props.style}>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <RaisedButton
            label={this.props.i18nStrings.btn_close}
            primary={true}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}

ViewDialogBox.defaultProps = {
  style: styles.dialogBox,
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
          <RaisedButton
            label={this.props.i18nStrings.btn_cancel}
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label={this.props.selected_item ? this.props.i18nStrings.btn_save : this.props.i18nStrings.btn_add}
            primary={true}
            icon={this.props.selected_item ? <NavigationCheck /> : <ContentAdd />}
            onTouchTap={this.props.handleSubmit}
          />
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
          <RaisedButton
            label={this.props.i18nStrings.btn_cancel}
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label={this.props.i18nStrings.btn_delete}
            primary={true}
            icon={<ActionDelete />}
            onTouchTap={this.props.handleSubmit}
          />
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
          <RaisedButton
            label={this.props.i18nStrings.btn_cancel}
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label={this.props.i18nStrings.btn_confirm}
            primary={true}
            icon={<NavigationCheck />}
            onTouchTap={this.props.handleSubmit}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
