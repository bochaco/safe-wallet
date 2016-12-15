import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Grid, Segment, Image, Header, Icon, Button } from 'semantic-ui-react'

/*
export default class CardEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: this.props.selected_item.label,
      data: this.props.selected_item.data
    }

    this.handleChangeLabel = this.handleChangeLabel.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    console.log("SUBMIT!:", this.state);
    this.props.handleSubmit(this.state);
  }

  handleChangeLabel(newLabel) {
    this.setState({label: newLabel})
  }

  handleChangeData(newData) {
    this.setState({data: newData})
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={(this.props.selected_item === null) ? "Add" : "Submit"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    var content = "", title = "";
    switch (this.props.selected_item.type) {
      case 0:
        content = <CreditCardView data={this.props.selected_item.data} />;
        title = "Credit Card"
        break;
      case 1:
        content = <PasswordView data={this.props.selected_item.data} />;
        title = "Password"
        break;
      case 2:
        content = <PrivPubKeysEdit label={this.props.selected_item.label}
                    data={this.props.selected_item.data}
                    handleChangeLabel={this.handleChangeLabel}
                    handleChangeData={this.handleChangeData} />;
        title = "Priv/Pub Keys"
        break;
      case 3:
        content = <TwoFAView data={this.props.selected_item.data} />;
        title = "2FA Codes"
        break;
      default:
        break;
    }

    console.log("DIALOG:", this.state.label, this.state.data);
    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal={true}
          contentStyle={{textAlign: 'center'}}
          open={this.props.open}
        >
          {content}
        </Dialog>
      </div>
    );
  }
}
*/
export default class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    let newItem = {
      label: this.labelInput.input.value,
      data: {
        pk: this.pkInput.input.value,
        sk: this.skInput.input.value
      }
    }
    this.setState({
      item: newItem
    });
  };

  handleSubmit() {
    this.props.handleSubmit(this.state.item);
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label={(this.props.selected_item == null) ? "Add" : "Submit"}
        primary={false}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Priv/Pub Key"
          actions={actions}
          modal={true}
          contentStyle={{textAlign: 'center'}}
          open={this.props.open}
        >
        <Grid >
          <Grid.Row>
            <Grid.Column width={7}>
              <TextField
                id="text-field-controlled"
                fullWidth={true}
                floatingLabelText="Label"
                defaultValue={(this.props.selected_item == null) ? "" : this.props.selected_item.label}
                onChange={this.handleChange}
                ref={(input) => { this.labelInput = input; }}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                id="text-field-controlled"
                fullWidth={true}
                floatingLabelText="Public Key"
                defaultValue={(this.props.selected_item == null) ? "" : this.props.selected_item.data.pk}
                onChange={this.handleChange}
                ref={(input) => { this.pkInput = input; }}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button circular icon='camera' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <TextField
                id="text-field-controlled"
                fullWidth={true}
                floatingLabelText="Private Key"
                defaultValue={(this.props.selected_item == null) ? "" : this.props.selected_item.data.sk}
                onChange={this.handleChange}
                ref={(input) => { this.skInput = input; }}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button circular icon='camera' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Dialog>
      </div>
    );
  }
}



/*
class PasswordView extends React.Component {
  render() {
    return (
      <Grid columns='equal' divided='vertically'>
      <Grid.Row>
        <Grid.Column>
          <Header>
            <Icon name='user' color="teal" />
            <Header.Content>
              {this.props.data.username}
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
              {this.props.data.password}
              <Header.Subheader>
                Password
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <div>
            <Header sub>{this.props.data.questions[0].q}</Header>
            <span>{this.props.data.questions[0].a}</span>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div>
            <Header sub>{this.props.data.questions[1].q}</Header>
            <span>{this.props.data.questions[1].a}</span>
          </div>
        </Grid.Column>
      </Grid.Row>
      </Grid>
    );
  }
}

class PrivPubKeysEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeLabel = this.handleChangeLabel.bind(this);
    this.handleChangePk = this.handleChangePk.bind(this);
    this.handleChangeSk = this.handleChangeSk.bind(this);
  }

  handleChangeLabel = (event) => {
    this.props.handleChangeLabel(event.target.value);
  };

  handleChangePk = (event) => {
    let data = {
      pk: event.target.value,
      sk: this.state.data.sk
    }
    this.props.handleChangeData(data);
  };

  handleChangeSk = (event) => {
    let data = {
      pk: this.props.data.pk,
      sk: event.target.value
    }
    this.props.handleChangeData(data);
  };

  render() {
    console.log("RENDER",this.props.data);
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column width={7}>
            <TextField
              id="text-field-controlled"
              fullWidth={true}
              floatingLabelText="Label"
              defaultValue={this.props.label}
              onChange={this.handleChangeLabel}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <TextField
              id="text-field-controlled"
              fullWidth={true}
              floatingLabelText="Public Key"
              defaultValue={this.props.data.pk}
              onChange={this.handleChangePk}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Button circular icon='camera' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={15}>
            <TextField
              id="text-field-controlled"
              fullWidth={true}
              floatingLabelText="Private Key"
              defaultValue={this.props.data.sk}
              onChange={this.handleChangeSk}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Button circular icon='camera' />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class CreditCardView extends React.Component {
  render() {
    return (
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Image src={img_credit_card_view} />
          </Grid.Column>
          <Grid.Column>
            <br/>
            <Header>
              <Icon name='protect' color="brown" />
              <Header.Content>
                Security Code: {this.props.data.ccv}
              </Header.Content>
            </Header>
            <Header>
              <Icon name='payment' color="brown" />
              <Header.Content>
                PIN: {this.props.data.pin}
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

class TwoFAView extends React.Component {
  render() {
    return (
      <Grid columns='equal'>
        <Grid.Row>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>{this.props.data[0]}</Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment textAlign="center" compact secondary>{this.props.data[1]}</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>{this.props.data[2]}</Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment textAlign="center" compact secondary>{this.props.data[3]}</Segment>
          </Grid.Column>
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
    );
  }
}
*/
