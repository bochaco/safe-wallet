import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Segment } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

const styles = {
  twoFACodeField: {
    width: 90,
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
            <Segment size="big" textAlign="center" secondary>
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

    let s = {};
    this.props.selected_item.data.forEach((code, i) => {
      s[`code${i}`] = code;
    })

    this.state = s;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let codes = [];
    for (let i=0; i<Constants.MAX_NUMBER_2FA_CODES; i++) {
      codes.push(this.state[`code${i}`]);
    }
    let updatedItem = {
      type: Constants.TYPE_2FA_CODES,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.props.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: codes,
    }
    this.props.handleSubmit(updatedItem);
  };

  handleChange = name => event => {
    this.setState( { [name]: event.target.value } );
  };

  render() {
    let twoFAcodes = [], row_codes = [];
    const numberOfCols = 6;
    for (let i=0; i < Constants.MAX_NUMBER_2FA_CODES; i++) {
      row_codes.push(
        <Grid.Column key={2*i+1}>
          <TextField style={styles.twoFACodeField}
            label={this.props.i18nStrings.item_2fa_code + " #" + (i+1)}
            value={this.state[`code${i}`]}
            onChange={this.handleChange(`code${i}`)}
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
            <Grid.Column width={8}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_label}
                ref='colorAndLabelInput'
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
