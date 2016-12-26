import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Image, Header, Modal } from 'semantic-ui-react'
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
                <Image size='mini' src={ItemTypes[this.props.selected_item.type].icon} />
                {" " + this.props.selected_item.metadata.label}
              </Header>)
          }
        </Modal.Header>
        <Modal.Content style={this.props.style}>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <RaisedButton
            label="Close"
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
              <Image size='mini' src={ItemTypes[this.props.type].icon} />
              {ItemTypes[this.props.type].title}
            </Header>
          }
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <RaisedButton
            label="Cancel"
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label={this.props.selected_item ? "Save" : "Add"}
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
          Are you sure you want to delete this item?
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <RaisedButton
            label="Cancel"
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label="Delete"
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
          Please confirm the transaction
        </Modal.Header>
        <Modal.Content>
          {this.props.children}
        </Modal.Content>
        <Modal.Actions>
          <RaisedButton
            label="Cancel"
            primary={false}
            icon={<NavigationClose />}
            onTouchTap={this.props.handleClose}
          />
          <RaisedButton
            label="Confirm"
            primary={true}
            icon={<NavigationCheck />}
            onTouchTap={this.props.handleSubmit}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
