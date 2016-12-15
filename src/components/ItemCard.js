import React from 'react';
import { Button, Card, Image, Container } from 'semantic-ui-react';
import icon_cc from '../img/credit_card.jpg';
import icon_pwd from '../img/password.jpg';
import icon_qr from '../img/qr_code.png';
import icon_2fa from '../img/2fa.png';
import icon_safecoin from '../img/safecoin.png';
import icon_unknown from '../img/unknown.png';

export default class ItemCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleViewAction = this.handleViewAction.bind(this);
    this.handleEditAction = this.handleEditAction.bind(this);
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
  }

  handleViewAction() {
    this.props.handleView(this.props.index);
  }

  handleEditAction() {
    this.props.handleEdit(this.props.index);
  }

  handleDeleteAction() {
    this.props.handleDelete(this.props.index);
  }

  render() {
    var img, meta, color;
    switch (this.props.item.type) {
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

    return (
      <Card color={color} >
        <Card.Content href='#' onClick={this.handleViewAction} >
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
              <Button inverted circular icon='edit' color={color}
                onClick={this.handleEditAction} />
              <Button inverted circular icon='trash outline' color={color}
                onClick={this.handleDeleteAction} />
          </Container>
        </Card.Content>
      </Card>
    );
  }
}
