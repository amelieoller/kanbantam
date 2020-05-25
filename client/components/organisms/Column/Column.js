import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import List from '_organisms/List';

const Title = styled.h4`
  padding: 8px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid indigo;
    outline-offset: 2px;
  }
`;

const Container = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: ${({ isDragging }) => (isDragging ? 'red' : 'yellow')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: 'purple';
  }
`;

const Column = ({ title, todos, index, boardId }) => (
  <Draggable draggableId={title} index={index}>
    {(provided, snapshot) => (
      <Container ref={provided.innerRef} {...provided.draggableProps}>
        <Header isDragging={snapshot.isDragging}>
          <Title isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
            {title}
          </Title>
        </Header>
        <List
          listId={title}
          style={{
            backgroundColor: snapshot.isDragging ? 'blue' : null,
          }}
          todos={todos}
          boardId={boardId}
        />
      </Container>
    )}
  </Draggable>
);

export default Column;
