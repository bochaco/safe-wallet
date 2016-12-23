import React from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Segment } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

const styles = {
  twoFACodeField: {
    width: 70,
  },
};

export default class TwoFACodesView extends React.Component {
  render() {
    let twoFAcodes = [];
    if (this.props.selected_item.data) {
      const numberOfCols = 4;
      let row_codes = [];
      let max = (numberOfCols * Math.ceil(this.props.selected_item.data.length / numberOfCols));
      for (let i=0; i < max; i++) {
        row_codes.push(
          <Grid.Column key={2*i+1}>
            {this.props.selected_item.data[i] ?
            <Segment color="violet" size="big" textAlign="center" secondary>
              {this.props.selected_item.data[i]}
            </Segment>
            : ''}
          </Grid.Column>
        );

        if (i > 0 && ((i % numberOfCols === numberOfCols - 1) || i === max-1)) {
          twoFAcodes.push(
            <Grid.Row key={2*i}>
              {row_codes}
            </Grid.Row>
          );
          row_codes = [];
        }
      }
    }

    return (
      <Grid columns='equal'>
        {twoFAcodes}
      </Grid>
    );
  }
}

export class TwoFACodesEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.refs.labelInput) {
      this.refs.labelInput.input.focus();
    }
  }

  handleSubmit() {
    let codes = [];
    for (let i=0; i<Constants.MAX_NUMBER_2FA_CODES; i++) {
      codes.push(this.refs['codeInput' + i].input.value);
    }
    let updatedItem = {
      type: Constants.TYPE_2FA_CODES,
      metadata: {
        label: this.refs.labelInput.input.value,
      },
      data: codes,
    }
    this.props.handleSubmit(updatedItem);
  };

  render() {
    let twoFAcodes = [], row_codes = [];
    const numberOfCols = 6;
    for (let i=0; i < Constants.MAX_NUMBER_2FA_CODES; i++) {
      row_codes.push(
        <Grid.Column key={2*i+1}>
          <TextField style={styles.twoFACodeField}
            floatingLabelText={"Code #" + (i+1)}
            defaultValue={this.props.selected_item.data[i]}
            ref={'codeInput' + i}
          />
        </Grid.Column>
      );

      if (i > 0 && ((i % numberOfCols === numberOfCols - 1) || i === Constants.MAX_NUMBER_2FA_CODES-1)) {
        twoFAcodes.push(
          <Grid.Row key={2*i}>
            {row_codes}
          </Grid.Row>
        );
        row_codes = [];
      }
    }

    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_2FA_CODES}
        handleSubmit={this.handleSubmit}
      >
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item.metadata.label}
                ref='labelInput'
              />
            </Grid.Column>
          </Grid.Row>
          {twoFAcodes}
        </Grid>
      </EditDialogBox>
    );
  }
}

TwoFACodesEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
