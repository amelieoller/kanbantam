import React from 'react';
import PropTypes from 'prop-types';
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
  height: ${({ theme }) => theme.sizes.listHeaderHeight};

  &:hover {
    background-color: 'purple';
  }
`;

const Column = ({ title, todos, index, boardId, listHeight }) => (
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
          listHeight={listHeight}
        />
      </Container>
    )}
  </Draggable>
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf({
    board: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    list: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
  boardId: PropTypes.string.isRequired,
  listHeight: PropTypes.number.isRequired,
};

export default Column;
