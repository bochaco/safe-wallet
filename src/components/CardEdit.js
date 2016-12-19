import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Grid, Button, List, Header, Image } from 'semantic-ui-react'
import { Constants, ItemTypes } from '../common.js';

const styles = {
  qaList: {
    height: 200,
    overflowY: 'auto',
  },
  customWidth: {
    width: 100,
  },
  tinyWidth: {
    width: 90,
  },
  twoFACodeField: {
    width: 70,
  },
  dialogBox: {
    textAlign: 'center',
  },
};

class DialogBox extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={false}
        icon={<NavigationClose />}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={true}
        icon={this.props.selected_item ? <NavigationCheck /> : <ContentAdd />}
        onTouchTap={this.props.handleSubmit}
      />
    ];

    return (
      <Dialog
        title={
          <Header as='h2'>
            <Image size='mini' src={this.props.icon} />
            {this.props.title}
          </Header>
        }
        actions={actions}
        modal={true}
        contentStyle={styles.dialogBox}
        open={this.props.open}
      >
        {this.props.children}
      </Dialog>
    )
  }
}

export default class CardEdit extends React.Component {
  render() {
    let content = null;
    switch (this.props.selected_item ? this.props.selected_item.type : this.props.selected_type) {
      case Constants.TYPE_CREDIT_CARD:
        content = <CreditCardEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case Constants.TYPE_PASSWORD:
        content = <PasswordEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case Constants.TYPE_PRIV_PUB_KEY:
        content = <PrivPubKeysEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case Constants.TYPE_2FA_CODES:
        content = <TwoFAEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      default:
        break;
    }

    return (
      <div>{content}</div>
    );
  }
}

class PrivPubKeysEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PRIV_PUB_KEY,
      label: this.refs.labelInput.input.value,
      data: {
        pk: this.refs.pkInput.input.value,
        sk: this.refs.skInput.input.value,
        notes: this.refs.notesInput.input.value,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  render() {
    return (
      <DialogBox {...this.props}
          handleSubmit={this.handleSubmit}
          icon={ItemTypes[Constants.TYPE_PRIV_PUB_KEY].icon}
          title={ItemTypes[Constants.TYPE_PRIV_PUB_KEY].title}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item ? this.props.selected_item.label : ""}
                ref='labelInput'
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                fullWidth={true}
                floatingLabelText="Public Key"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.pk : ""}
                ref='pkInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                floatingLabelText="Private Key"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.sk : ""}
                ref='skInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                fullWidth={true}
                multiLine={false/*TODO: true*/}
                rows={2}
                rowsMax={2}
                floatingLabelText="Balance & Transactions notes"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.notes : ""}
                ref='notesInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DialogBox>
    );
  }
}

class PasswordEdit extends React.Component {
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

  componentWillUpdate(newProps) {
    if (this.refs.newQInput) {
      this.refs.newQInput.input.value = "";
      this.refs.newAInput.input.value = "";
    }
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_PASSWORD,
      label: this.refs.labelInput.input.value,
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
    const QAs =
      <List style={styles.qaList}>
      {this.state.qas.map((qa, index) => (
        <List.Item key={index}>
          <List horizontal>
            <List.Item>
              <Button inverted circular size='mini' color='red' icon='remove'
                onClick={ () => {this.handleRemoveQA(index)} } />
            </List.Item>
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
          </List>
        </List.Item>
      ))}
      <List.Item>
        <List horizontal>
          <List.Item>
            <Button inverted circular size='mini' color='green' icon='add'
              onClick={this.handleAddQA}
            />
          </List.Item>
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
        </List>
      </List.Item>
    </List>;

    return (
      <DialogBox {...this.props}
          handleSubmit={this.handleSubmit}
          icon={ItemTypes[Constants.TYPE_PASSWORD].icon}
          title={ItemTypes[Constants.TYPE_PASSWORD].title}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item ? this.props.selected_item.label : ""}
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
                defaultValue={this.props.selected_item ? this.props.selected_item.data.username : ""}
                ref='usernameInput'
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Password"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.password : ""}
                ref='passwordInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              {QAs}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DialogBox>
    );
  }
}

class CreditCardEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_CREDIT_CARD,
      label: this.refs.labelInput.input.value,
      data: {
        cvv: this.refs.cvvInput.input.value,
        pin: this.refs.pinInput.input.value,
        number: this.refs.numberInput.input.value,
        name: this.refs.nameInput.input.value,
        expiry_month: this.refs.monthInput.input.value,
        expiry_year: this.refs.yearInput.input.value,
        issuer: this.refs.issuerInput.input.value,
        network: this.refs.networkInput.input.value,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  render() {
    return (
      <DialogBox {...this.props}
          handleSubmit={this.handleSubmit}
          icon={ItemTypes[Constants.TYPE_CREDIT_CARD].icon}
          title={ItemTypes[Constants.TYPE_CREDIT_CARD].title}
      >
        <Grid>
          <Grid.Row columns={5}>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item ? this.props.selected_item.label : ""}
                ref='labelInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={2}>
              <TextField
                style={styles.customWidth}
                floatingLabelText="Network/Type"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.network : ""}
                ref='networkInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={5}>
              <TextField
                fullWidth={true}
                floatingLabelText="Issuer"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.issuer : ""}
                ref='issuerInput'
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column width={6}>
              <TextField
                fullWidth={true}
                floatingLabelText="Number"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.number : ""}
                ref='numberInput'
              />
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={6}>
              <List horizontal>
                <List.Item>
                  <List.Content>
                    <TextField
                      style={styles.tinyWidth}
                      floatingLabelText="Expiry month"
                      defaultValue={this.props.selected_item ? this.props.selected_item.data.expiry_month : ""}
                      ref='monthInput'
                    />
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>/</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <TextField
                      style={styles.customWidth}
                      floatingLabelText="Expiry year"
                      defaultValue={this.props.selected_item ? this.props.selected_item.data.expiry_year : ""}
                      ref='yearInput'
                    />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={4}>
            <Grid.Column width={6}>
              <TextField
                floatingLabelText="Cardholder's Name"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.name : ""}
                ref='nameInput'
              />
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                floatingLabelText="CVV"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.cvv : ""}
                ref='cvvInput'
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <TextField
                style={styles.tinyWidth}
                floatingLabelText="PIN"
                defaultValue={this.props.selected_item ? this.props.selected_item.data.pin : ""}
                ref='pinInput'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DialogBox>
    );
  }
}

class TwoFAEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let codes = [];
    for (let i=0; i<Constants.MAX_NUMBER_2FA_CODES; i++) {
      codes.push(this.refs['codeInput' + i].input.value);
    }
    let updatedItem = {
      type: Constants.TYPE_2FA_CODES,
      label: this.refs.labelInput.input.value,
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
            defaultValue={this.props.selected_item ? this.props.selected_item.data[i] : ""}
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
      <DialogBox {...this.props}
          handleSubmit={this.handleSubmit}
          icon={ItemTypes[Constants.TYPE_2FA_CODES].icon}
          title={ItemTypes[Constants.TYPE_2FA_CODES].title}
      >
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={this.props.selected_item ? this.props.selected_item.label : ""}
                ref='labelInput'
              />
            </Grid.Column>
          </Grid.Row>
          {twoFAcodes}
        </Grid>
      </DialogBox>
    );
  }
}
