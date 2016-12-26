import React from 'react';
import { Grid, Header, Icon, Button, List } from 'semantic-ui-react'
import TextField from 'material-ui/TextField';
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

const styles = {
  passwordView: {marginTop: 15},
}

export default class PasswordView extends React.Component {
  render() {
    let QAs = this.props.selected_item.data.questions.map((qa, i) => (
      <Grid.Column key={i} style={styles.passwordView}>
        <div>
          <Header sub>
            {qa.q}
            <Header.Subheader>
              {qa.a}
            </Header.Subheader>
          </Header>
        </div>
      </Grid.Column>
    ));

    return (
      <Grid columns='equal'>
      <Grid.Row>
        <Grid.Column>
          <Header>
            <Icon name='user' color="teal" />
            <Header.Content>
              {this.props.selected_item.data.username}
              <Header.Subheader>
                Username
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Header>
            <Icon name='privacy' color="teal" />
            <Header.Content>
              {this.props.selected_item.data.password}
              <Header.Subheader>
                Password
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        {QAs}
      </Grid.Row>
      </Grid>
    );
  }
}

export class PasswordEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qas: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQChange = this.handleQChange.bind(this);
    this.handleAChange = this.handleAChange.bind(this);
    this.handleAddQA = this.handleAddQA.bind(this);
    this.handleRemoveQA = this.handleRemoveQA.bind(this);
  }

  componentWillMount() {
    if (this.props.selected_item) {
      this.setState({qas: this.props.selected_item.data.questions.slice()})
    }
  }

  componentDidMount() {
    if (this.refs.labelInput) {
      this.refs.labelInput.input.focus();
    }
  }

  componentWillUpdate(newProps) {
    if (this.refs.newQInput) {
      this.refs.newQInput.input.value = "";
      this.refs.newAInput.input.value = "";
    }
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PASSWORD,
      metadata: {
        label: this.refs.labelInput.input.value,
      },
      data: {
        username: this.refs.usernameInput.input.value,
        password: this.refs.passwordInput.input.value,
        questions: this.state.qas,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  handleQChange(index, e) {
    let updatedQAs = this.state.qas.slice();
    updatedQAs[index].q = e.target.value;
    this.setState({qas: updatedQAs});
  }

  handleAChange(index, e) {
    let updatedQAs = this.state.qas.slice();
    updatedQAs[index].a = e.target.value;
    this.setState({qas: updatedQAs});
  }

  handleAddQA() {
    let updatedQAs = this.state.qas.slice();
    updatedQAs.push({
      q: this.refs.newQInput.input.value,
      a: this.refs.newAInput.input.value,
    });
    this.setState({qas: updatedQAs});
  }

  handleRemoveQA(index) {
    let updatedQAs = this.state.qas.slice();
    updatedQAs.splice(index, 1);
    this.setState({qas: updatedQAs});
  }

  render() {
    var QAs = [this.state.qas.map((qa, index) => (
        <Grid.Row key={qa.q+qa.a}>
          <Grid.Column width={1} />
          <Grid.Column width={15}>
            <List horizontal>
              <List.Item>
                <TextField
                  floatingLabelText={"Question #" + (index+1)}
                  defaultValue={qa.q}
                  onChange={(e) => {this.handleQChange(index, e)}}
                />
              </List.Item>
              <List.Item>
                <TextField
                  floatingLabelText="Answer"
                  defaultValue={qa.a}
                  onChange={(e) => {this.handleAChange(index, e)}}
                />
              </List.Item>
              <List.Item>
                <Button inverted circular size='mini' color='red' icon='remove'
                  onClick={ () => {this.handleRemoveQA(index)} } />
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      )),
      <Grid.Row key="new">
        <Grid.Column width={1} />
        <Grid.Column width={15}>
          <List horizontal>
            <List.Item>
              <TextField
                defaultValue=""
                floatingLabelText="Question"
                ref='newQInput'
              />
            </List.Item>
            <List.Item>
              <TextField
                defaultValue=""
                floatingLabelText="Answer"
                ref='newAInput'
              />
            </List.Item>
            <List.Item>
              <Button inverted circular size='mini' color='green' icon='add'
                onClick={this.handleAddQA}
              />
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    ];

    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_PASSWORD}
        handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item.metadata.label}
                ref='labelInput'
              />
            </Grid.Column>
            <Grid.Column width={9}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Username"
                defaultValue={this.props.selected_item.data.username}
                ref='usernameInput'
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Password"
                defaultValue={this.props.selected_item.data.password}
                ref='passwordInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
          </Grid.Row>
          {QAs}
        </Grid>
      </EditDialogBox>
    );
  }
}

PasswordEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: { questions: [] },
  }
}
