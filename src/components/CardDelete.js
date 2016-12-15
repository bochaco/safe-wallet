import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, Image } from 'semantic-ui-react';

import icon_cc from '../img/credit_card.jpg';
import icon_pwd from '../img/password.jpg';
import icon_qr from '../img/qr_code.png';
import icon_2fa from '../img/2fa.png';
import icon_safecoin from '../img/safecoin.png';
import icon_unknown from '../img/unknown.png';


export default class CardDelete extends React.Component {
  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label="Delete"
        primary={false}
        onTouchTap={this.props.handleSubmit}
      />,
    ];

    var img, meta, color;
    if (this.props.selected_item != null) {
      switch (this.props.selected_item.type) {
        case 0:
          img = <Image floated='left' size='tiny' src={icon_cc} />
          meta = "Credit Card";
          color = "brown";
          break;
        case 1:
          img = <Image floated='left' size='tiny' src={icon_pwd} />
          meta = "Password";
          color = "red";
          break;
        case 2:
          img = <Image floated='left' size='tiny' src={icon_qr} />
          meta = "Priv/Pub Key";
          color = "yellow";
          break;
        case 3:
          img = <Image floated='left' size='tiny' src={icon_2fa} />
          meta = "2FA Codes";
          color = "violet";
          break;
        case 4:
          img = <Image floated='left' size='tiny' src={icon_safecoin} />
          meta = "Safecoin Wallet";
          color = "blue";
          break;
        default:
          img = <Image floated='left' size='tiny' src={icon_unknown} />
          meta = "";
          color = "grey";
      }
    }

    return (
      <div>
        <Dialog
          title="Are you sure you want to delete this item?"
          actions={actions}
          modal={true}
          contentStyle={{textAlign: 'center'}}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
        >
          <Card fluid color={color}>
            <Card.Content>
              <Card.Meta>
                {img}
                {meta}
              </Card.Meta>
              <Card.Header>
                <br/>
                {(this.props.selected_item == null ? "" : this.props.selected_item.label)}
              </Card.Header>
            </Card.Content>
          </Card>

        </Dialog>
      </div>
    );
  }
}
