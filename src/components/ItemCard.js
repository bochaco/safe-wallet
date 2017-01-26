import React from 'react';
import { Button, Card, Image, Container } from 'semantic-ui-react';
import { Constants, ItemTypes } from '../common.js';

export default class ItemCards extends React.Component {
  render() {
    if (Object.keys(this.props.data).length > 0) {
      return (
        <Card.Group itemsPerRow={3}>
        {this.props.data.map((item, index) => (
          <ItemCard key={index} index={index} item={item} {...this.props} />
        ))}
        </Card.Group>
      )
    }

    return this.props.noItemsComponent;
  }
}

class ItemCard extends React.Component {
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
    let color = this.props.item.metadata.color;
    if (color == null) {
      color = Constants.DEFAULT_CARD_COLOR;
    }

    return (
      <Card color={color}>
        <Card.Content style={{cursor: 'pointer'}} onClick={this.handleViewAction}>
          <Card.Meta>
            <Image floated='left' size='tiny' src={ItemTypes[this.props.item.type].icon} />
            {this.props.i18nStrings[ItemTypes[this.props.item.type].title]}
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
