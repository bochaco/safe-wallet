import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ContentSend from 'material-ui/svg-icons/content/send';
import { Grid, Image, Header, Icon, List, Popup, Button } from 'semantic-ui-react'
import { Constants } from '../common.js';
import { EditDialogBox } from './DialogBox.js';

import img_pubkey from '../img/qr_pubkey.png';
import img_altcoinicon from '../img/icon_altcoin.png';

const styles = {
  popup: {
    opacity: 0.85,
  }
}

export default class AltCoinView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQR: false,
    }

    this.handleShowQR = this.handleShowQR.bind(this);
    this.handleHideQR = this.handleHideQR.bind(this);
  }

  componentDidMount() {
    this.refs.recipientInput.input.focus();
  }

  handleShowQR() {
    this.setState({showQR: true});
  }

  handleHideQR() {
    this.setState({showQR: false});
  }

  render() {
    return (
    <div>
      <Grid >
        <Grid.Row>
          <Grid.Column width={10}>
            <Grid >
              <Grid.Row>
                <Grid.Column verticalAlign="middle" width={11}>
                  <Header as='h1' color="blue">
                    <Image size="mini" src={img_altcoinicon} />
                    <Header.Content>
                      {"1.81791634"}
                      <Header.Subheader>
                        Balance
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Image style={{cursor: 'pointer'}} size="tiny"
                    src={img_pubkey} onClick={this.handleShowQR} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={14}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Transfer To"
                    defaultValue=""
                    ref='recipientInput'
                  />
                </Grid.Column>
                <Grid.Column width={2} verticalAlign="bottom">
                  <Button basic icon='camera' color="grey" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={5}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="Amount"
                    defaultValue="0"
                    ref='amountInput'
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <TextField
                    fullWidth={true}
                    floatingLabelText="PIN"
                    defaultValue=""
                    type="password"
                    ref='pinInput'
                  />
                </Grid.Column>
                <Grid.Column verticalAlign="bottom" width={7}>
                  <RaisedButton
                    label="Transfer"
                    primary={false}
                    icon={<ContentSend />}
                    onTouchTap={this.handleSend}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={6}>
            <List divided verticalAlign='middle'>
              {this.props.selected_item.data.history.map((h,index) => (
                <Popup
                  key={h.date+h.amount}
                  style={styles.popup}
                  trigger={
                    <List.Item color={h.direction === "in" ? "green" : "red"}>
                      <List.Content floated='right'>
                        {h.date}
                      </List.Content>
                      <Icon name={h.direction === "in" ? "plus" : "minus"} color={h.direction === "in" ? "green" : "red"} />
                      <List.Content>
                        {h.amount}
                      </List.Content>
                    </List.Item>
                  }
                  content={["From:",<br />,h.from]}
                  positioning='bottom left'
                />
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Dialog
        title="Receive"
        modal={false}
        open={this.state.showQR}
        onRequestClose={this.handleHideQR}
      >
        <Image size="small" src={img_pubkey} />
        <Header as="h3">{"1KbCJfktc1JaKAwRtb42G8iNyhhh9zXRi4"}</Header>
      </Dialog>
    </div>
    );
  }
}

export class AltCoinEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

  };

  render() {
    return (
      <EditDialogBox {...this.props}
          type={Constants.TYPE_ALTCOIN}
          handleSubmit={this.props.handleClose}
      >
      </EditDialogBox>
    );
  }
}

AltCoinEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: {},
  }
}
