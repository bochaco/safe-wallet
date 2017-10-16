import React from 'react';
import { List, Label, Grid, Button, Card, Image } from 'semantic-ui-react';
import { Constants, ItemTypes } from '../common.js';

export default class ItemCards extends React.Component {
  render() {
    if (Object.keys(this.props.data).length > 0) {
      return (
        <Grid padded centered>
          <Grid.Column width={15}>
            <Card.Group itemsPerRow={3} stackable>
            {Object.keys(this.props.data).map((key) => (
              <ItemCard
                key={this.props.data[key].id}
                index={this.props.data[key].id}
                item={this.props.data[key].content}
                {...this.props}
              />
            ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
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
      <Card id='itemCard'>
        <Card.Content style={{cursor: 'pointer'}} onClick={this.handleViewAction}>
          <Image floated='left' src={ItemTypes[this.props.item.type].icon} />
          <Card.Header>
          </Card.Header>
          <Card.Meta>
            {this.props.i18nStrings[ItemTypes[this.props.item.type].title]}
          </Card.Meta>
          <Card.Description>
            <h3>{this.props.item.metadata.label}</h3>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <List>
            <List.Item>
              <Label circular color={color} empty />
              <List.Content verticalAlign='middle' floated='right'>
                <Button id='btnCard' circular icon='edit'
                  onClick={this.handleEditAction} />
                <Button id='btnCard' circular icon='trash outline'
                  onClick={this.handleDeleteAction} />
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
      </Card>
    );
  }
}
