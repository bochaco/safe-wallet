import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { List, Image } from 'semantic-ui-react'
import { ItemTypes } from '../common';

const customContentStyle = {
  width: '30%',
  maxWidth: 'none',
  textAlign: 'center',
};

export default class CardAdd extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Type of the item to add?"
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
          <List selection size='large' animated verticalAlign='middle'>
            {Object.keys(ItemTypes).map((index) => (
                <List.Item key={index}
                  onClick={() => {this.props.handleSubmit(ItemTypes[index].type)}}>
                  <Image size='mini' src={ItemTypes[index].icon} />
                  <List.Content>
                    <List.Header>{ItemTypes[index].title}</List.Header>
                  </List.Content>
                </List.Item>
            ))}
          </List>
        </Dialog>
      </div>
    );
  }
}
