import React from 'react';
import TextField from 'material-ui/TextField';
import { Grid, Image, Header, Icon, List } from 'semantic-ui-react'
import { Constants, getQRCode } from '../common.js';
import { EditDialogBox } from './DialogBox.js';
import { ColorAndLabel } from './Common.js';

export default class JCardView extends React.Component {
  render() {
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column width={12}>
            <List horizontal relaxed>
              <List.Item>
                <Header>
                  <Icon name='user' color="blue" />
                  <Header.Content>
                    {this.props.selected_item.data[0]}
                    <Header.Subheader>
                      Public Profile ID
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </List.Item>
              <List.Item>
                <Header>
                  <Icon name='male' color="blue" />
                  <Header.Content>
                    {this.props.selected_item.data[1][1][1][3]}
                    <Header.Subheader>
                      Public Full Name
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </List.Item>
            </List>
            <List>
              <List.Item>
                <List horizontal relaxed>
                  <List.Item>
                    <Header as="h4">
                      <Header.Content>
                        {this.props.selected_item.data[1][1][3][1].type[0]}
                        <Header.Subheader>
                          Coin
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </List.Item>
                  <List.Item>
                    <Header as="h5">
                      <Header.Content>
                        {this.props.selected_item.data[1][1][3][3]}
                        <Header.Subheader>
                          Wallet Address / Public Key
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </List.Item>
                </List>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src={getQRCode(this.props.selected_item.data[1][1][3][3])} />
          </Grid.Column>
          <Grid.Column width={1}>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export class JCardEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let updatedItem = {
      type: Constants.TYPE_JCARD,
      metadata: {
        label: this.refs.colorAndLabelInput.refs.labelInput.input.value,
        color: this.refs.colorAndLabelInput.refs.colorInput.getSelectedItem().value,
      },
      data: [
        this.refs.idInput.input.value,
        [
          "vcard",
          [
            ["version", {}, "text", "4.0"],
            ["fn", {}, "text", this.refs.nameInput.input.value],
            ["email", {}, "text", "forrestgump@example.com"],
            ["x-wallet-addr", {
                "type": [ this.refs.coinInput.input.value ]
              }, "text", this.refs.addrInput.input.value
            ],
            ["rev", {}, "timestamp", "2008-04-24T19:52:43Z"]
          ]
        ]
      ]
    }
    this.props.handleSubmit(updatedItem);
  };

  componentDidMount() {
    if (this.refs.colorAndLabelInput) {
      this.refs.colorAndLabelInput.refs.labelInput.input.focus();
    }
  }

  render() {
    return (
      <EditDialogBox {...this.props}
        type={Constants.TYPE_JCARD}
        handleSubmit={this.handleSubmit}
      >
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              <ColorAndLabel
                selected_item={this.props.selected_item}
                ref='colorAndLabelInput'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>
              <TextField
                fullWidth={true}
                floatingLabelText="Public Profile ID"
                defaultValue={this.props.selected_item.data[0]}
                ref='idInput'
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TextField
                fullWidth={true}
                floatingLabelText="Public Full Name"
                defaultValue={this.props.selected_item.data[1][1][1][3]}
                ref='nameInput'
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>
              <TextField
                fullWidth={true}
                floatingLabelText="Coin"
                defaultValue={this.props.selected_item.data[1][1][3][1].type[0]}
                ref='coinInput'
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <TextField
                fullWidth={true}
                floatingLabelText="Wallet Address / Public Key"
                defaultValue={this.props.selected_item.data[1][1][3][3]}
                ref='addrInput'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </EditDialogBox>
    );
  }
}

JCardEdit.defaultProps = {
  selected_item: {
    metadata: {},
    data: [
      "",
      [
        "vcard",
        [
          ["version", {}, "text", "4.0"],
          ["fn", {}, "text", ""],
          ["email", {}, "text", "forrestgump@example.com"],
          ["x-wallet-addr", {
              "type": [ "" ]
            }, "text", ""
          ],
          ["rev", {}, "timestamp", "2008-04-24T19:52:43Z"]
        ]
      ]
    ]
  }
}
