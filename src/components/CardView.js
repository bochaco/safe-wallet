import React from 'react';
import { ItemTypes, Constants } from '../common.js';

import ViewDialogBox from './DialogBox.js';

export default class CardView extends React.Component {
  render() {
    if (!this.props.open || this.props.selected_item == null) {
      return null;
    }

    return (
      <ViewDialogBox
        {...this.props}
        closeOnEscape={this.props.selected_item.type !== Constants.TYPE_ALTCOIN}
      >
        {ItemTypes[this.props.selected_item.type].viewDialogFactory(this.props)}
      </ViewDialogBox>
    );
  }
}
