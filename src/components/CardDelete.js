import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Grid, Image, Header } from 'semantic-ui-react';
import { ItemTypes } from '../common';

const customContentStyle = {
  width: '50%',
  maxWidth: 'none',
  textAlign: 'center',
};

export default class CardDelete extends React.Component {
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

    let img, meta, label;
    if (this.props.selected_item != null) {
      img = <Image floated='left' size='tiny' src={ItemTypes[this.props.selected_item.type].icon} />
      meta = ItemTypes[this.props.selected_item.type].title;
      label = this.props.selected_item.label;
    }

    return (
      <div>
        <Dialog
          title="Are you sure you want to delete this item?"
          actions={actions}
          modal={true}
          contentStyle={customContentStyle}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          <Grid centered columns={3}>
            <Grid.Column width={13}>
              <Header as='h3'>
                {img}
                <Header.Content>
                  <Header.Subheader>
                    {meta}
                  </Header.Subheader>
                  {label}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

        </Dialog>
      </div>
    );
  }
}
