import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { Grid, Segment,  Button, List } from 'semantic-ui-react'

const styles = {
  qaList: {
    height: 200,
    overflowY: 'auto',
  },
  customWidth: {
      width: 150,
  },
};

export default class CardEdit extends React.Component {
  render() {
    var content = "";
    switch (this.props.selected_item ? this.props.selected_item.type : this.props.selected_type) {
      case 0:
        content = <CreditCardEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case 1:
        content = <PasswordEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case 2:
        content = <PrivPubKeysEdit
                    open={this.props.open}
                    selected_item={this.props.selected_item}
                    handleClose={this.props.handleClose}
                    handleSubmit={this.props.handleSubmit} />
        break;
      case 3:
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
      <div>
        {content}
      </div>
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
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Priv/Pub Key"
        actions={actions}
        modal={true}
        contentStyle={{textAlign: 'center'}}
        open={this.props.open}
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
      </Dialog>
    );
  }
}

class PasswordEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qas: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddQA = this.handleAddQA.bind(this);
    this.handleRemoveQA = this.handleRemoveQA.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      label: this.refs.labelInput.input.value,
      data: {
        username: this.refs.usernameInput.input.value,
        password: this.refs.passwordInput.input.value,
        questions: [],/*this.refs.questionsInput.input.value,*/
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  handleAddQA(event) {
      //console.log("ADD", Array.prototype.indexOf.call(event.target.parentNode.childNodes,event.target));
  }

  handleRemoveQA(qas, index) {
    //console.log("AA", index, qas);
/*    let updatedQAs = qas.slice(0);
    updatedQAs.splice(index, 1);
    //console.log("AA", qas);
    let updatedItem = {
      label: this.refs.labelInput.input.value,
      data: {
        username: this.refs.usernameInput.input.value,
        password: this.refs.passwordInput.input.value,
        questions: updatedQAs,
      }
    }
    //console.log("AA", updatedItem);
    this.props.handleChange(updatedItem);*/
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    /* Let's create an item for each QA */
    const QAs = !this.props.selected_item ? "" :
      this.props.selected_item.data.questions.map((qa, index) => (
        <List.Item key={index}>
          <List horizontal>
            <List.Item>
              <Button inverted circular size='mini' color='red' icon='remove'
                onClick={ () => {this.handleRemoveQA(this.props.selected_item.data.questions, index)} } />
            </List.Item>
            <List.Item>
              <TextField
                floatingLabelText={"Question #" + (index+1)}
                defaultValue={qa.q}
                ref={'q' + index + 'Input'}
              />
            </List.Item>
            <List.Item>
              <TextField
                floatingLabelText="Answer"
                defaultValue={qa.a}
                ref={'a' + index + 'Input'}
              />
            </List.Item>
          </List>
        </List.Item>
      ));

    return (
      <Dialog
        title="Password"
        actions={actions}
        modal={true}
        contentStyle={{textAlign: 'center'}}
        open={this.props.open}
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
              <List style={styles.qaList}>
                {QAs}
                {/* Then we place the one to add a new item */}
                <List.Item>
                  <List horizontal>
                    <List.Item>
                      <Button inverted circular size='mini' color='green' icon='add'
                        onClick={this.handleAddQA} />
                    </List.Item>
                    <List.Item>
                      <TextField
                        floatingLabelText="Question"
                        ref='newQInput'
                      />
                    </List.Item>
                    <List.Item>
                      <TextField
                        floatingLabelText="Answer"
                        ref='newAInput'
                      />
                    </List.Item>
                  </List>
                </List.Item>

              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Dialog>
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
      label: this.refs.labelInput.input.value,
      data: {
        ccv: this.refs.ccvInput.input.value,
        pin: this.refs.pinInput.input.value,
        number: this.refs.numberInput.input.value,
        name: this.refs.nameInput.input.value,
        expiry_month: this.refs.expiry_monthInput.input.value,
        expiry_year: this.refs.expiry_yearInput.input.value,
        issuer: this.refs.issuerInput.input.value,
        network: this.refs.networkInput.input.value,
      }
    }
    this.props.handleSubmit(updatedItem);
  };

  render() {
/*    const monthItems = [
      <MenuItem key={1} value={1} primaryText="01" />,
      <MenuItem key={2} value={4} primaryText="04" />,
      <MenuItem key={3} value={6} primaryText="06" />,
      <MenuItem key={4} value={7} primaryText="07" />,
      <MenuItem key={5} value={8} primaryText="08" />,
    ];*/
    const yearItems = [
      <MenuItem key={1} value={2010} primaryText="2010" />,
      <MenuItem key={2} value={2020} primaryText="2020" />,
      <MenuItem key={3} value={2030} primaryText="2030" />,
      <MenuItem key={4} value={2040} primaryText="2040" />,
      <MenuItem key={5} value={2050} primaryText="2050" />,
    ];

    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];
/*    const options = [
      { text: 'All', value: 'all' },
      { text: 'Articles', value: 'articles' },
      { text: 'Products', value: 'products' },
    ];*/

    return (
      <Dialog
        title="Credit Card"
        actions={actions}
        modal={true}
        contentStyle={{textAlign: 'center'}}
        open={this.props.open}
      >
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column width={7}>
            <TextField
              fullWidth={true}
              floatingLabelText="Label"
              defaultValue={this.props.selected_item ? this.props.selected_item.label : ""}
              ref='labelInput'
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <TextField
              fullWidth={true}
              floatingLabelText="Network/Type"
              defaultValue={this.props.selected_item ? this.props.selected_item.data.network : ""}
              ref='networkInput'
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column width={7}>
            <TextField
              fullWidth={true}
              floatingLabelText="Number"
              defaultValue={this.props.selected_item ? this.props.selected_item.data.number : ""}
              ref='numberInput'
            />
          </Grid.Column>
          <Grid.Column textAlign='left' width={3}>

            <DatePicker
              hintText="Custom date format"
              firstDayOfWeek={0}
            />
          </Grid.Column>
          <Grid.Column textAlign='left' width={3}>
            <SelectField

              value={this.props.selected_item ? this.props.selected_item.data.expiry_year : ""}
              floatingLabelText="Expiry Month"
              ref='expiry_yearInput'
            >
              {yearItems}
            </SelectField>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column width={6}>
            <TextField
              floatingLabelText="Cardholder's Name"
              defaultValue={this.props.selected_item ? this.props.selected_item.data.name : ""}
              ref='nameInput'
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <TextField
              floatingLabelText="CCV"
              defaultValue={this.props.selected_item ? this.props.selected_item.data.ccv : ""}
              ref='ccvInput'
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <TextField
              floatingLabelText="PIN"
              defaultValue={this.props.selected_item ? this.props.selected_item.data.pin : ""}
              ref='PINInput'
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      </Dialog>
    );
  }
}

class TwoFAEdit extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={this.props.selected_item ? "Save" : "Add"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Credit Card"
        actions={actions}
        modal={true}
        contentStyle={{textAlign: 'center'}}
        open={this.props.open}
      >
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" compact secondary>123456</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>987654</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Dialog>
    );
  }
}
