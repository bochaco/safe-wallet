import React, { Component } from 'react';
import { Button, Card, Image, Container } from 'semantic-ui-react';
import icon_cc from './img/credit_card.jpg';
import icon_pwd from './img/password.jpg';
import icon_qr from './img/qr_code.png';
import icon_2fa from './img/2fa.png';
import icon_unknown from './img/unknown.png';

export class ItemCard extends React.Component {
  render() {
    var img, meta;
    if (this.props.item.type == 0) {
      img = <Image floated='left' size='tiny' src={icon_cc} />
      meta = "Credit Card";
    } else if (this.props.item.type == 1) {
      img = <Image floated='left' size='tiny' src={icon_pwd} />
      meta = "Password";
    } else if (this.props.item.type == 2) {
      img = <Image floated='left' size='tiny' src={icon_qr} />
      meta = "Priv/Pub Key";
    } else if (this.props.item.type == 3) {
      img = <Image floated='left' size='tiny' src={icon_2fa} />
      meta = "2FA Codes";
    } else {
      img = <Image floated='left' size='tiny' src={icon_unknown} />
      meta = "";
    }

    return (
      <Card>
        <Card.Content href='#link'>
          {img}
          <Card.Header>
            {this.props.item.label}
          </Card.Header>
          <Card.Meta>
            <br />
            {meta}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Container textAlign='right'>
            <div>
              <Button inverted circular icon='edit' color='blue'/>
              <Button inverted circular icon='trash outline' color='blue'/>
            </div>
          </Container>
        </Card.Content>
      </Card>
    );
  }
}

export class ItemCardPopUp extends Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}
