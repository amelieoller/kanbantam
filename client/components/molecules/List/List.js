import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faBan,
  faPencilAlt,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

import { attemptUpdateList, attemptDeleteList } from '_thunks/lists';
import ConfirmModal from '_organisms/ConfirmModal';
import AddTodo from '_molecules/AddTodo';
import TodoPage from '_pages/TodoPage';

const fromNow = (date) => formatDistanceToNow(parseISO(date), { addSuffix: true });

export default function List({ id, title, createdAt, updatedAt, boardId }) {
  const dispatch = useDispatch();

  const [currentTitle, setCurrentTitle] = useState(title);
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
  const updateTitle = (e) => setCurrentTitle(e.target.value);
  const editList = () => setEdit(true);

  const cancelEdit = () => {
    setEdit(false);
    setCurrentTitle(title);
  };

  const handleUpdateList = () => {
    if (currentTitle) {
      dispatch(attemptUpdateList(id, currentTitle)).then(() => setEdit(false));
    }
  };

  const deleteList = () => dispatch(attemptDeleteList(id));

  return (
    <li className="list box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <small>{`created ${createdMessage}`}</small>
            </p>
            {edit ? (
              <textarea
                className="textarea"
                value={currentTitle}
                onChange={updateTitle}
              />
            ) : (
              <p>{title}</p>
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
                  onClick={handleUpdateList}
                  onKeyPress={handleUpdateList}
                >
                  <FontAwesomeIcon icon={faSave} size="lg" />
                </span>
              ) : (
                <span
                  className="icon space-right"
                  onClick={editList}
                  onKeyPress={editList}
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

      <h2>Add new Todo:</h2>
      <AddTodo boardId={boardId} listId={id} />

      <h2>All todos for this list:</h2>
      <TodoPage boardId={boardId} listId={id} />

      <ConfirmModal confirm={confirm} closeModal={closeModal} deleteItem={deleteList} />
    </li>
  );
}

List.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string,
  boardId: PropTypes.string.isRequired,
};

List.defaultProps = {
  updatedAt: null,
};
