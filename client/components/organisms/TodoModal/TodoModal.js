import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import Modal from 'react-modal';
import { format } from 'date-fns';

import Button from '_atoms/Button';
import CodeMirrorArea from '_atoms/CodeMirrorArea';
import Input from '_atoms/Input';
// import TextArea from '_atoms/TextArea';
import CategorySelect from '_molecules/CategorySelect';
import { attemptUpdateTodo, attemptDeleteTodo } from '_actions/todos';
import { clearCurrentTodo } from '_actions/currentTodo';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function TodoModal({ completedListId }) {
  const dispatch = useDispatch();
  const { currentTodo } = useSelector(R.pick(['currentTodo']));
  const isOpen = !!currentTodo.id;

  const [updatedTodo, setUpdatedTodo] = useState({});
  const [boundingRect, setBoundingRect] = useState({});
  const [todoHasChanged, setTodoHasChanged] = useState(false);

  useEffect(() => {
    const { boundingRect, ...todo } = currentTodo;

    setBoundingRect(boundingRect);
    setUpdatedTodo(todo);
  }, [currentTodo]);

  if (!boundingRect) return null;

  const clearTodo = () => dispatch(clearCurrentTodo());

  const updateTodo = (name, value) => {
    if (!todoHasChanged) setTodoHasChanged(true);

    setUpdatedTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const formatDate = (value) => new Date(value.replace(/-/g, '/').replace(/T.+/, ''));

  const completeTodo = () => {
    dispatch(attemptUpdateTodo({ id: updatedTodo.id, list: completedListId, completed: true }));
    dispatch(clearCurrentTodo());
  };

  const handleUpdateTodo = () => {
    if (updatedTodo.text && todoHasChanged) {
      dispatch(attemptUpdateTodo(updatedTodo));
    }

    clearTodo();
  };

  const deleteTodo = () => {
    dispatch(attemptDeleteTodo(updatedTodo.id));
    clearTodo();
  };

  // MODAL STYLES
  // Returns true if card is closer to right border than to the left
  const isNearRight = window.innerWidth - boundingRect.right < boundingRect.left;

  // Returns true if card is closer to the bottom than the top
  const isNearBottom = window.innerHeight - boundingRect.top < boundingRect.bottom;

  // Check if the display is so thin that we need to trigger a centered, vertical layout
  // DO NOT CHANGE the number 550 without also changing related media-query in CardOptions.scss
  const isThinDisplay = window.innerWidth < 550;

  // Position textarea at the same place as the card and position everything else away from closest edge
  const style = {
    content: {
      top: isNearBottom
        ? 'auto'
        : Math.min(boundingRect.top, window.innerHeight - boundingRect.height - 18),
      bottom: isNearBottom ? window.innerHeight - boundingRect.bottom : 'auto',
      left: isNearRight ? null : boundingRect.left,
      right: isNearRight ? window.innerWidth - boundingRect.right : null,
      flexDirection: isNearRight ? 'row-reverse' : 'row',
      alignItems: isNearBottom ? 'flex-end' : 'flex-start',
    },
  };

  // For layouts that are less wide than 550px, let the modal take up the entire width at the top of the screen
  const mobileStyle = {
    content: {
      flexDirection: 'column',
      top: '60px',
      left: '70px',
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
        <CodeMirrorArea
          label="Text"
          handleOnChange={(value) => updateTodo('text', value)}
          defaultValue={updatedTodo.text}
          style={{
            minHeight: isThinDisplay ? 'none' : boundingRect.height,
            width: isThinDisplay ? '100%' : boundingRect.width,
          }}
        />

        <OptionsWrapper>
          <Button onClick={completeTodo} label="Done">
            Done
          </Button>

          <Input
            label="Minutes"
            handleOnBlur={(value) => updateTodo('minutes', value === '' ? 0 : +value)}
            defaultValue={updatedTodo.minutes}
            type="number"
          />

          <Input
            label="Due Date"
            handleOnBlur={(value) => updateTodo('dueDate', value ? formatDate(value) : '')}
            defaultValue={
              updatedTodo.dueDate ? format(new Date(updatedTodo.dueDate), 'yyyy-MM-dd') : ''
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
            noToggle
          />

          <Button
            onClick={() => {
              if (
                window.confirm(`Are you sure you want to delete the board "${updatedTodo.text}"?`)
              )
                deleteTodo();
            }}
            buttonType="error"
            label="Delete todo"
          >
            Delete
          </Button>

          <Button onClick={handleUpdateTodo} buttonType="success" label="Save todo">
            Save
          </Button>
        </OptionsWrapper>
      </Modal>
    </ModalWrapper>
  );
}

const OptionsWrapper = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.sizes.spacing};
  padding: 0 ${({ theme }) => theme.sizes.spacing};
  width: 100%;
  border-radius: 5px;

  button {
    width: 100%;
  }

  @media ${(props) => props.theme.media.tabletSmall} {
    margin: 0;
    background: white;
    padding: 10px;
  }
`;

const ModalWrapper = styled.div``;

TodoModal.propTypes = {
  completedListId: PropTypes.string.isRequired,
};

export default TodoModal;
