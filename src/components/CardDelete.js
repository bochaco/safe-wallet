import React from 'react';
import { Grid, Image, Header } from 'semantic-ui-react';
import { ItemTypes } from '../common';
import { DeleteDialogBox } from './DialogBox.js';

export default class CardDelete extends React.Component {
  render() {
    if (!this.props.open || this.props.selected_item == null) {
      return null;
    }

    let item = ItemTypes[this.props.selected_item.type];

    return (
      <DeleteDialogBox {...this.props} >
        <Grid centered columns={3}>
          <Grid.Column width={13}>
            <Header as='h3'>
              <Image floated='left' size='tiny' src={item.icon} />
              <Header.Content>
                <Header.Subheader>
                  {item.title}
                </Header.Subheader>
                {this.props.selected_item.metadata.label}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>

      </DeleteDialogBox>
    );
  }
}
