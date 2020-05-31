import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

import { attemptUpdateTodo, attemptDeleteTodo } from '_thunks/todos';
import CategorySelect from '_molecules/CategorySelect';
import Input from '_atoms/Input';
import Button from '_atoms/Button';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function TodoModal({ todo, isOpen, setIsOpen }) {
  const dispatch = useDispatch();

  const [updatedTodo, setUpdatedTodo] = useState({
    text: '',
    minutes: 0,
    category: '',
    dueDate: '',
    priority: 0,
    completed: false,
    ...todo,
  });

  const closeModal = () => setIsOpen(false);

  const updateTodo = (name, value) => {
    setUpdatedTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const formatDate = (value) => new Date(value.replace(/-/g, '/').replace(/T.+/, ''));

  const toggleCompleted = () => {
    setUpdatedTodo((prevTodo) => ({ ...prevTodo, completed: !prevTodo.completed }));
  };

  const handleUpdateTodo = () => {
    if (updatedTodo.text) {
      dispatch(attemptUpdateTodo(updatedTodo)).then(closeModal);
    }
  };

  const deleteTodo = () => dispatch(attemptDeleteTodo(todo.id));

  return (
    <ModalWrapper>
      <Modal isOpen={isOpen} onRequestClose={handleUpdateTodo} style={customStyles}>
        <InputWrapper>
          <Input
            label="Text"
            handleOnBlur={(value) => updateTodo('text', value)}
            defaultValue={updatedTodo.text}
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            label="Minutes"
            handleOnBlur={(value) => updateTodo('minutes', value)}
            defaultValue={updatedTodo.minutes}
            type="number"
          />
        </InputWrapper>

        <CategorySelect
          onChange={(newCategoryId) => updateTodo('category', newCategoryId)}
          currentCategoryId={updatedTodo.category}
        />
        <br />
        <br />

        <InputWrapper>
          <Input
            label="Due Date"
            handleOnBlur={(value) => updateTodo('dueDate', formatDate(value))}
            defaultValue={
              updatedTodo.dueDate
                ? format(new Date(updatedTodo.dueDate), 'yyyy-MM-dd')
                : ''
            }
            type="date"
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            label="Priority"
            handleOnBlur={(value) => updateTodo('priority', value)}
            defaultValue={updatedTodo.priority}
            type="number"
          />
        </InputWrapper>

        {updatedTodo.completed ? (
          <Button onClick={toggleCompleted}>Undo Done</Button>
        ) : (
          <Button onClick={toggleCompleted}>Done</Button>
        )}
        <Button onClick={deleteTodo} buttonType="error">
          Delete
        </Button>

        <Button onClick={handleUpdateTodo} buttonType="success">
          Save
        </Button>
      </Modal>
    </ModalWrapper>
  );
}

const InputWrapper = styled.div`
  margin: 15px 0;
`;

const ModalWrapper = styled.div`
  color: blue;
`;

TodoModal.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default TodoModal;
