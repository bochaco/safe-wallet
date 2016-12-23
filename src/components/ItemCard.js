import React from 'react';
import { Button, Card, Image, Container } from 'semantic-ui-react';
import { ItemTypes } from '../common.js';

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

    let color;
    switch (this.props.item.type) {
      case 0:
        color = "brown";
        break;
      case 1:
        color = "red";
        break;
      case 2:
        color = "yellow";
        break;
      case 3:
        color = "violet";
        break;
      case 4:
        color = "blue";
        break;
      default:
        color = "orange";
    }

    return (
      <Card color={color}>
        <Card.Content style={{cursor: 'pointer'}} onClick={this.handleViewAction}>
          <Card.Meta>
            <Image floated='left' size='tiny' src={ItemTypes[this.props.item.type].icon} />
            {ItemTypes[this.props.item.type].title}
          </Card.Meta>
          <Card.Header>
            <br/>
            {this.props.item.metadata.label}
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
