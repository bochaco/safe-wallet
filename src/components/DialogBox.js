import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Image, Header } from 'semantic-ui-react'
import { ItemTypes } from '../common.js';

const styles = {
  dialogBox: {
    textAlign: 'center',
  },
  deleteDialogBox: {
    textAlign: 'center',
    width: '50%',
    maxWidth: 'none',
  },
};

export default class ViewDialogBox extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Close"
        primary={true}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
    ];

    return (
      <Dialog
        title={this.props.title ? this.props.title :
            (<Header as='h2'>
              <Image size='mini' src={ItemTypes[this.props.selected_item.type].icon} />
              {" " + this.props.selected_item.metadata.label}
            </Header>)
        }
        actions={actions}
        modal={false}
        contentStyle={this.props.style}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        {this.props.children}
      </Dialog>
    )
  }
}

ViewDialogBox.defaultProps = {
  style: styles.dialogBox
}

export class EditDialogBox extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={true}
        icon={this.props.selected_item ? <NavigationCheck /> : <ContentAdd />}
        onTouchTap={this.props.handleSubmit}
      />
    ];

    return (
      <Dialog
        title={
          <Header as='h2'>
            <Image size='mini' src={ItemTypes[this.props.type].icon} />
            {ItemTypes[this.props.type].title}
          </Header>
        }
        actions={actions}
        modal={true}
        contentStyle={styles.dialogBox}
        open={this.props.open}
      >
        {this.props.children}
      </Dialog>
    )
  }
}

export class DeleteDialogBox extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        icon={<ActionDelete />}
        onTouchTap={this.props.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Are you sure you want to delete this item?"
        actions={actions}
        modal={true}
        contentStyle={styles.deleteDialogBox}
        open={this.props.open}
      >
        {this.props.children}
      </Dialog>
    )
  }
}
