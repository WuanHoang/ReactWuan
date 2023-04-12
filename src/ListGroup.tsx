import { useState } from "react";
import { List } from "semantic-ui-react"

interface Prop {
  item: string[];
  heading: string;
}

// const items = ["Mars", 'Earth', 'Venus', 'Apollo'];

function listPrint(item: string, count: number) {}

function Test(prop: Prop) {

  return (
    <>
      <List selection verticalAlign='middle'>
        {prop.item.map((item, count) => (
          <List.Item key={item}>
            <List.Content>
                <List.Header>{item}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </>
  );
}

export default Test;
