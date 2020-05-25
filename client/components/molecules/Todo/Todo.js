import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';

import {
  attemptToggleCompleteTodo,
  attemptUpdateTodo,
  attemptDeleteTodo,
} from '_thunks/todos';
import ConfirmModal from '_organisms/ConfirmModal';

const Container = styled.a`
  border-radius: 2px;
  border: 2px solid transparent;
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px lightgreen` : 'none')};
  padding: 8px;
  min-height: 40px;
  margin-bottom: 8px;
  user-select: none;

  &:hover,
  &:active {
    color: darkblue;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const fromNow = (date) => formatDistanceToNow(parseISO(date), { addSuffix: true });

const Todo = ({
  todo: { id, text, completed, createdAt, updatedAt },
  isDragging,
  provided: { innerRef, draggableProps, dragHandleProps },
}) => {
  const dispatch = useDispatch();

  const [currentText, setCurrentText] = useState(text);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [createdMessage, setCreatedMessage] = useState('');

  const updateMessages = () => {
    setUpdatedMessage(updatedAt ? fromNow(updatedAt) : '');
    setCreatedMessage(fromNow(createdAt));
  };

  useEffect(() => {
    updateMessages();
    const interval = window.setInterval(updateMessages, 1000);

    return () => clearInterval(interval);
  }, [updatedAt]);

  const openModal = () => setConfirm(true);
  const closeModal = () => setConfirm(false);
  const updateText = (e) => setCurrentText(e.target.value);
  const editTodo = () => setEdit(true);

  const cancelEdit = () => {
    setEdit(false);
    setCurrentText(text);
  };

  const handleUpdateTodo = () => {
    if (currentText) {
      dispatch(attemptUpdateTodo(id, currentText)).then(() => setEdit(false));
    }
  };

  const toggleCompleteTodo = () => dispatch(attemptToggleCompleteTodo(id));

  const deleteTodo = () => dispatch(attemptDeleteTodo(id));

  return (
    <Container
      isDragging={isDragging}
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <div>{text}</div>
    </Container>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
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

{
  /* <li className="todo box">
      <article className="media">
        <figure className="media-left">
          <span
            className="icon"
            onClick={toggleCompleteTodo}
            onKeyPress={toggleCompleteTodo}
          >
            {completed ? (
              <FontAwesomeIcon icon={faCheckSquare} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faSquare} size="lg" />
            )}
          </span>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <small>{`created ${createdMessage}`}</small>
            </p>
            {edit ? (
              <textarea className="textarea" value={currentText} onChange={updateText} />
            ) : (
              <p>{text}</p>
            )}
          </div>

          <nav className="level is-mobile">
            <div className="level-left">
              {!!updatedAt && <small>{`edited ${updatedMessage}`}</small>}
            </div>
            <div className="level-right">
              {edit ? (
                <span
                  className="icon space-right"
                  onClick={handleUpdateTodo}
                  onKeyPress={handleUpdateTodo}
                >
                  <FontAwesomeIcon icon={faSave} size="lg" />
                </span>
              ) : (
                <span
                  className="icon space-right"
                  onClick={editTodo}
                  onKeyPress={editTodo}
                >
                  <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                </span>
              )}
              {edit ? (
                <span className="icon" onClick={cancelEdit} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faBan} size="lg" />
                </span>
              ) : (
                <span className="icon" onClick={openModal} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </span>
              )}
            </div>
          </nav>
        </div>
      </article>
      <ConfirmModal confirm={confirm} closeModal={closeModal} deleteItem={deleteTodo} />
    </li> */
}
