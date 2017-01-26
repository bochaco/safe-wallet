import React from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Dropdown, Label } from 'semantic-ui-react'
import { Constants } from '../common.js';

export class ColorAndLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: this.props.selected_item.metadata.color,
    }

    this.colorOptions = [
      { value: 'brown', text: this.props.i18nStrings.color_brown, label:{ color: 'brown', empty: true, circular: true } },
      { value: 'red', text: this.props.i18nStrings.color_red, label:{ color: 'red', empty: true, circular: true } },
      { value: 'yellow', text: this.props.i18nStrings.color_yellow, label:{ color: 'yellow', empty: true, circular: true } },
      { value: 'orange', text: this.props.i18nStrings.color_orange, label:{ color: 'orange', empty: true, circular: true } },
      { value: 'violet', text: this.props.i18nStrings.color_violet, label:{ color: 'violet', empty: true, circular: true } },
      { value: 'blue', text: this.props.i18nStrings.color_blue, label:{ color: 'blue', empty: true, circular: true } },
    ]

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (this.props.selected_item.metadata.color == null){
      this.setState({currentColor: Constants.DEFAULT_CARD_COLOR});
    }
  }

  handleChange(e, data) {
    this.setState({currentColor: data.value})
  }

  render() {
    const trigger = (
      <Label color={this.state.currentColor} horizontal>
        {this.props.i18nStrings.item_color}
      </Label>
    )

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <TextField
              fullWidth={true}
              floatingLabelText={this.props.label}
              defaultValue={this.props.selected_item.metadata.label}
              ref='labelInput'
            />
          </Grid.Column>
          <Grid.Column width={4} verticalAlign='bottom' style={{paddingBottom: 8}}>
            <Dropdown
              scrolling
              options={this.colorOptions}
              onChange={this.handleChange}
              trigger={trigger}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
