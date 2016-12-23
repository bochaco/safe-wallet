import React from 'react';
import { ItemTypes } from '../common.js';

export default class CardEdit extends React.Component {
  render() {
    if (!this.props.open) {
      return null;
    }

    const type = this.props.selected_item ? this.props.selected_item.type : this.props.selected_type;
    if (type == null) {
      return null;
    }

    return ItemTypes[type].editDialogFactory(this.props);
  }
}
