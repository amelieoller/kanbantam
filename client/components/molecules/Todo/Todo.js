import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import { attemptDeleteTodo } from '_thunks/todos';
import Trash from '_assets/icons/trash-2.svg';
import Calendar from '_assets/icons/calendar.svg';
import Flag from '_assets/icons/flag.svg';
import TodoModal from '_organisms/TodoModal';
import useCombinedRefs from '_hooks/useCombinedRefs';

const fromNow = (date) => formatDistanceToNow(parseISO(date), { addSuffix: true });

const Todo = ({
  todo,
  todo: { id, text },
  isDragging,
  provided: { innerRef, draggableProps, dragHandleProps },
}) => {
  const cardRef = useRef(null);
  const combinedRef = useCombinedRefs(innerRef, cardRef);

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [boundingRect, setBoundingRect] = useState();

  useLayoutEffect(() => {
    setBoundingRect(combinedRef.current.getBoundingClientRect());
  }, [combinedRef, isOpen]);

  const deleteTodo = () => dispatch(attemptDeleteTodo(id));

  const openModal = () => setIsOpen(true);

  return (
    <>
      <Container
        isDragging={isDragging}
        ref={combinedRef}
        {...draggableProps}
        {...dragHandleProps}
        onClick={openModal}
      >
        <Header>
          {!!todo.priority && (
            <Badge
              color={
                todo.priority === 1
                  ? 'mediumturquoise'
                  : todo.priority === 2
                  ? 'orange'
                  : 'coral'
              }
            >
              <Flag />
            </Badge>
          )}
          {todo.dueDate && (
            <DueDate>
              <Calendar /> {fromNow(todo.dueDate)}
            </DueDate>
          )}
        </Header>

        <Main>
          <ReactMarkdown source={text} linkTarget="_blank" />
        </Main>

        <Footer>
          <FooterLeft></FooterLeft>
          <FooterRight>
            <Trash onClick={deleteTodo} />
          </FooterRight>
        </Footer>
      </Container>

      <TodoModal
        todo={todo}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cardBounds={boundingRect}
      />
    </>
  );
};

const Container = styled.div`
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border: 2px solid transparent;
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px lightgreen` : 'none')};
  padding: ${({ theme }) => theme.sizes.spacingSmall};
  min-height: ${({ theme }) => theme.sizes.minCardHeight};
  margin-bottom: ${({ theme }) => theme.sizes.spacingSmall};
  user-select: none;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.one};

  & > *:not(:last-child) {
    margin-bottom: 3px;
  }

  &:hover,
  &:active {
    box-shadow: ${({ theme }) => theme.shadows.three};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.two};
    background: ${({ theme }) => theme.colors.darker(1, 'surface')};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Badge = styled.span`
  color: white;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  padding: 2px 4px;
  font-size: 0.85rem;

  svg {
    height: 14px;
    width: 14px;
    color: ${({ color }) => color};
    fill: ${({ color }) => color};
  }
`;

const DueDate = styled.span`
  color: darkgray;
  padding: 1px 4px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  svg {
    height: 14px;
    width: 14px;
    margin-right: 2px;
  }
`;

const Main = styled.div`
  font-size: 1.2rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;
    color: lightgray;
    cursor: pointer;
  }
`;

const FooterLeft = styled.span`
  display: flex;
  align-items: center;
`;

const FooterRight = styled.span`
  display: flex;
  align-items: center;
`;

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.number,
  }),
  isDragging: PropTypes.bool.isRequired,
  provided: PropTypes.shape({
    innerRef: PropTypes.func.isRequired,
    draggableProps: PropTypes.shape({}),
    dragHandleProps: PropTypes.shape({}),
  }),
};

Todo.defaultProps = {
  updatedAt: null,
};

export default Todo;
