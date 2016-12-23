import React from 'react';
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

export default class SafecoinView extends React.Component {
  render() {
    return null;
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
