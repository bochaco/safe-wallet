import React from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Dropdown, Label } from 'semantic-ui-react'
import { Constants } from '../common.js';

const colorOptions = [
  { value: 'brown', text: 'Brown', label:{ color: 'brown', empty: true, circular: true } },
  { value: 'red', text: 'Red', label:{ color: 'red', empty: true, circular: true } },
  { value: 'yellow', text: 'Yellow', label:{ color: 'yellow', empty: true, circular: true } },
  { value: 'violet', text: 'Violet', label:{ color: 'violet', empty: true, circular: true } },
  { value: 'blue', text: 'Blue', label:{ color: 'blue', empty: true, circular: true } },
]

export class ColorAndLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: this.props.selected_item.metadata.color,
    }
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
        Color
      </Label>
    )

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <TextField
              fullWidth={true}
              floatingLabelText="Label / Wallet ID"
              defaultValue={this.props.selected_item.metadata.label}
              ref='labelInput'
            />
          </Grid.Column>
          <Grid.Column width={4} verticalAlign='bottom' style={{paddingBottom: 8}}>
            <Dropdown
              placeholder='Color'
              scrolling
              options={colorOptions}
              onChange={this.handleChange}
              trigger={trigger}
              ref='colorInput'
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
