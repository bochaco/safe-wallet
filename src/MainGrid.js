import React from 'react'
import { Card, Container } from 'semantic-ui-react'
import { ItemCard } from './ItemCard.js';


export default class MainGrid extends React.Component {
  render() {
    var cards = this.props.data.map((item, index) => (
        <ItemCard item={item} />
    ));

    return (
      <Container>
        <Card.Group itemsPerRow={3}>
          {cards}
        </Card.Group>
      </Container>
    );
  }
}
