import React, { Component } from 'react';
import { Button, Card, Grid, Image, Container } from 'semantic-ui-react';
import icon_cc from './img/credit_card.jpg';
import icon_pwd from './img/password.jpg';
import icon_qr from './img/qr_code.png';
import icon_2fa from './img/2fa.png';
import icon_unknown from './img/unknown.png';

export class ItemCard extends React.Component {
  render() {
    var img, meta, color;
    if (this.props.item.type === 0) {
      img = <Image floated='left' size='tiny' src={icon_cc} />
      meta = "Credit Card";
      color = "blue";
    } else if (this.props.item.type === 1) {
      img = <Image floated='left' size='tiny' src={icon_pwd} />
      meta = "Password";
      color = "red";
    } else if (this.props.item.type === 2) {
      img = <Image floated='left' size='tiny' src={icon_qr} />
      meta = "Priv/Pub Key";
      color = "yellow";
    } else if (this.props.item.type === 3) {
      img = <Image floated='left' size='tiny' src={icon_2fa} />
      meta = "2FA Codes";
      color = "violet";
    } else {
      img = <Image floated='left' size='tiny' src={icon_unknown} />
      meta = "";
      color = "grey";
    }

    return (
      <Card itemsPerRow={3} color={color}>
        <Card.Content href='#link'>
          <Card.Meta>
            {img}
            {meta}
          </Card.Meta>
          <Card.Header>
            <br/>
            {this.props.item.label}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Container textAlign='right'>
              <Button inverted circular icon='edit' color={color} />
              <Button inverted circular icon='trash outline' color={color} />
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
