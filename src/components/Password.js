// Copyright 2016-2018 Gabriel Viganotti <@bochaco>.
//
// This file is part of the SAFE Wallet application.
//
// The SAFE Wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The SAFE Wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the SAFE Wallet. If not, see <https://www.gnu.org/licenses/>.

import React from 'react';
import { Grid, Header, Icon, Button, List } from 'semantic-ui-react'
import TextField from '@material-ui/core/TextField';
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

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
                {this.props.i18nStrings.item_username}
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
                {this.props.i18nStrings.item_password}
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
      username: this.props.selected_item.data.username,
      password: this.props.selected_item.data.password,
      qas: this.props.selected_item.data.questions.slice(),
      newQ: '',
      newA: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQAChange = this.handleQAChange.bind(this);
    this.handleAddQA = this.handleAddQA.bind(this);
    this.handleRemoveQA = this.handleRemoveQA.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PASSWORD,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.props.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: {
        username: this.state.username,
        password: this.state.password,
        questions: this.state.qas,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  handleChange = name => event => {
    this.setState( { [name]: event.target.value } );
  };

  handleQAChange = (index, attr) => event => {
    // FIXME: the textfield looses focus after this
    let updatedQAs = this.state.qas.slice();
    updatedQAs[index][attr] = event.target.value;
    this.setState({qas: updatedQAs});
  }

  handleAddQA() {
    let updatedQAs = this.state.qas.slice();
    updatedQAs.push({
      q: this.state.newQ,
      a: this.state.newA,
    });
    this.setState({qas: updatedQAs, newQ: '', newA: ''});
  }

  handleRemoveQA = index => _ => {
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
                  label={this.props.i18nStrings.item_question + " #" + (index+1)}
                  value={this.state.qas[index].q}
                  onChange={this.handleQAChange(index, 'q')}
                />
              </List.Item>
              <List.Item>
                <TextField
                  label={this.props.i18nStrings.item_answer}
                  value={this.state.qas[index].a}
                  onChange={this.handleQAChange(index, 'a')}
                />
              </List.Item>
              <List.Item>
                <Button inverted circular size='mini' color='red' icon='remove'
                  onClick={this.handleRemoveQA(index)} />
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
                label={this.props.i18nStrings.item_question}
                value={this.state.newQ}
                onChange={this.handleChange('newQ')}
              />
            </List.Item>
            <List.Item>
              <TextField
                label={this.props.i18nStrings.item_answer}
                value={this.state.newA}
                onChange={this.handleChange('newA')}
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
            <Grid.Column width={10}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                i18nStrings={this.props.i18nStrings}
                label={this.props.i18nStrings.item_label}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_username}
                value={this.state.username}
                onChange={this.handleChange('username')}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                label={this.props.i18nStrings.item_password}
                value={this.state.password}
                onChange={this.handleChange('password')}
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
