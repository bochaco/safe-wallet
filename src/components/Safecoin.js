import React from 'react';
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

export default class SafecoinView extends React.Component {
  render() {
    return (
      <div>{this.props.i18nStrings.item_safecoin_coming_soon}</div>
    );
  }
}

export class SafecoinEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

  };

  render() {
    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_SAFECOIN}
        handleSubmit={this.props.handleClose}
      >
      <div>{this.props.i18nStrings.item_safecoin_coming_soon}</div>
      </EditDialogBox>
    );
  }
}

SafecoinEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
