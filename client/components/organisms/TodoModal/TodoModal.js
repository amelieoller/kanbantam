import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

import {
  attemptUpdateTodo,
  attemptDeleteTodo,
  attemptToggleCompleteTodo,
} from '_thunks/todos';
import CategorySelect from '_molecules/CategorySelect';
import Input from '_atoms/Input';
import TextArea from '_atoms/TextArea';
import Button from '_atoms/Button';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function TodoModal({ todo, isOpen, setIsOpen, cardBounds }) {
  const dispatch = useDispatch();

  const initialState = {
    text: '',
    minutes: 0,
    category: '',
    dueDate: '',
    priority: 0,
    completed: false,
  };

  const [updatedTodo, setUpdatedTodo] = useState(initialState);

  useEffect(() => {
    setUpdatedTodo({
      ...initialState,
      ...todo,
    });
  }, [todo]);

  if (!cardBounds) return null;

  const closeModal = () => setIsOpen(false);

  const updateTodo = (name, value) => {
    setUpdatedTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const formatDate = (value) => new Date(value.replace(/-/g, '/').replace(/T.+/, ''));

  const toggleCompleted = () => {
    dispatch(attemptToggleCompleteTodo(updatedTodo.id));
    // setUpdatedTodo((prevTodo) => ({ ...prevTodo, completed: !prevTodo.completed }));
  };

  const handleUpdateTodo = () => {
    if (updatedTodo.text) {
      dispatch(attemptUpdateTodo(updatedTodo)).then(closeModal);
    }
  };

  const deleteTodo = () => dispatch(attemptDeleteTodo(todo.id));

  // MODAL STYLES
  // Returns true if card is closer to right border than to the left
  const isNearRight = window.innerWidth - cardBounds.right < cardBounds.left;

  // Returns true if card is closer to the bottom than the top
  const isNearBottom = window.innerHeight - cardBounds.top < cardBounds.bottom;

  // Check if the display is so thin that we need to trigger a centered, vertical layout
  // DO NOT CHANGE the number 550 without also changing related media-query in CardOptions.scss
  const isThinDisplay = window.innerWidth < 550;

  // Position textarea at the same place as the card and position everything else away from closest edge
  const style = {
    content: {
      top: isNearBottom
        ? 'auto'
        : Math.min(cardBounds.top, window.innerHeight - cardBounds.height - 18),
      bottom: isNearBottom ? window.innerHeight - cardBounds.bottom - 18 : 'auto',
      left: isNearRight ? null : cardBounds.left,
      right: isNearRight ? window.innerWidth - cardBounds.right : null,
      flexDirection: isNearRight ? 'row-reverse' : 'row',
      alignItems: isNearBottom ? 'flex-end' : 'flex-start',
    },
  };

  // For layouts that are less wide than 550px, let the modal take up the entire width at the top of the screen
  const mobileStyle = {
    content: {
      flexDirection: 'column',
      top: 3,
      left: 3,
      right: 3,
    },
  };

  return (
    <ModalWrapper>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleUpdateTodo}
        style={isThinDisplay ? mobileStyle : style}
        overlayClassName="modal-underlay"
        className="modal"
      >
        <TextArea
          label="Text"
          handleOnBlur={(value) => updateTodo('text', value)}
          defaultValue={updatedTodo.text}
          style={{
            minHeight: isThinDisplay ? 'none' : cardBounds.height,
            width: isThinDisplay ? '100%' : cardBounds.width,
          }}
        />

        <OptionsWrapper>
          {updatedTodo.completed ? (
            <Button onClick={toggleCompleted}>Undo Done</Button>
          ) : (
            <Button onClick={toggleCompleted}>Done</Button>
          )}

          <Input
            label="Minutes"
            handleOnBlur={(value) => updateTodo('minutes', value)}
            defaultValue={updatedTodo.minutes}
            type="number"
          />

          <Input
            label="Due Date"
            handleOnBlur={(value) =>
              updateTodo('dueDate', value ? formatDate(value) : '')
            }
            defaultValue={
              updatedTodo.dueDate
                ? format(new Date(updatedTodo.dueDate), 'yyyy-MM-dd')
                : ''
            }
            type="date"
          />

          <Input
            label="Priority"
            handleOnBlur={(value) => updateTodo('priority', value)}
            defaultValue={updatedTodo.priority}
            type="number"
          />

          <CategorySelect
            onChange={(newCategoryId) => updateTodo('category', newCategoryId)}
            currentCategoryId={updatedTodo.category}
          />

          <Button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete the board "${updatedTodo.text}"?`,
                )
              )
                deleteTodo();
            }}
            buttonType="error"
          >
            Delete
          </Button>

          <Button onClick={handleUpdateTodo} buttonType="success">
            Save
          </Button>
        </OptionsWrapper>
      </Modal>
    </ModalWrapper>
  );
}

const OptionsWrapper = styled.div`
  margin: 0 ${({ theme }) => theme.sizes.spacing};

  button {
    width: 100%;
  }

  & > * {
    margin-bottom: ${({ theme }) => theme.sizes.spacing};
  }
`;

const ModalWrapper = styled.div``;

TodoModal.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  cardBounds: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
};

export default TodoModal;
