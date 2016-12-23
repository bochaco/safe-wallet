import React from 'react';
import { ItemTypes } from '../common.js';

import ViewDialogBox from './DialogBox.js';

export default class CardView extends React.Component {
  render() {
    if (!this.props.open || this.props.selected_item == null) {
      return null;
    }

    return (
      <ViewDialogBox {...this.props} handleSubmit={this.handleSubmit} >
        {ItemTypes[this.props.selected_item.type].viewDialogFactory(this.props)}
      </ViewDialogBox>
    );
  }
}
