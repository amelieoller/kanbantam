import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import Modal from 'react-modal';
import { lighten } from 'polished';

import Button from '_atoms/Button';
import CodeMirrorArea from '_atoms/CodeMirrorArea';
import Input from '_atoms/Input';
import CategorySelect from '_molecules/CategorySelect';
import { attemptUpdateTodo, attemptDeleteTodo } from '_actions/todos';
import { clearCurrentTodo } from '_actions/currentTodo';
import CheckIcon from '_assets/icons/check-circle.svg';
import TrashIcon from '_assets/icons/trash-2.svg';
import SaveIcon from '_assets/icons/save.svg';
import Flag from '_assets/icons/flag.svg';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function TodoModal({ completedListId, isSidebarOpen }) {
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

  const completeTodo = () => {
    dispatch(attemptUpdateTodo({ id: updatedTodo.id, list: completedListId, completed: true }));
    dispatch(clearCurrentTodo());
  };

  const handleUpdateTodo = () => {
    if (updatedTodo.text && todoHasChanged) {
      dispatch(attemptUpdateTodo({ ...updatedTodo, priority: parseInt(updatedTodo.priority) }));
    }

    clearTodo();
  };

  const deleteTodo = () => {
    dispatch(attemptDeleteTodo(updatedTodo.id));
    clearTodo();
  };

  const sidebarWidth = isSidebarOpen ? 250 : 50;

  // MODAL STYLES
  // Returns true if card is closer to right border than to the left
  const isNearRight = window.innerWidth - boundingRect.right < boundingRect.left - sidebarWidth;

  // Returns true if card is closer to the bottom than the top
  const isNearBottom = window.innerHeight - boundingRect.top < boundingRect.bottom;

  // Check if the display is so thin that we need to trigger a centered, vertical layout
  // DO NOT CHANGE the number 680 without also changing related media-query in CardOptions.scss
  const isThinDisplay = window.innerWidth < 680 + sidebarWidth;

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

  // For layouts that are less wide than 680px, let the modal take up the entire width at the top of the screen
  const mobileStyle = {
    content: {
      flexDirection: 'column',
      top: '60px',
      left: `${20 + sidebarWidth}px`,
    },
  };

  console.log(updatedTodo.priority);

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
          value={updatedTodo.text}
          style={{
            minHeight: isThinDisplay ? 'none' : boundingRect.height,
            width: isThinDisplay ? '100%' : boundingRect.width,
          }}
        />

        <OptionsWrapper sidebarWidth={sidebarWidth}>
          <Input
            label="Minutes"
            onChange={(e) => updateTodo('minutes', e.target.value === '' ? 0 : +e.target.value)}
            value={updatedTodo.minutes}
            type="number"
          />

          <Input
            label="Due Date"
            onChange={(e) => updateTodo('dueDate', e.target.value)}
            value={updatedTodo.dueDate}
            type="date"
          />

          <span>
            <CategoryLabel>Priority</CategoryLabel>
            <Priorities>
              <Button
                onClick={() => updateTodo('priority', 1)}
                label="Priority 1"
                style={{
                  background: `${
                    updatedTodo.priority === 1
                      ? 'mediumturquoise'
                      : lighten(0.29, 'mediumturquoise')
                  }`,
                  border: 'none',
                }}
              >
                1 <Flag />
              </Button>
              <Button
                label="Priority 2"
                onClick={() => updateTodo('priority', 2)}
                style={{
                  background: `${updatedTodo.priority === 2 ? 'orange' : lighten(0.29, 'orange')}`,
                  border: 'none',
                }}
              >
                2 <Flag />
              </Button>
              <Button
                label="Priority 3"
                onClick={() => updateTodo('priority', 3)}
                style={{
                  background: `${updatedTodo.priority === 3 ? 'coral' : lighten(0.29, 'coral')}`,
                  border: 'none',
                }}
              >
                3 <Flag />
              </Button>
            </Priorities>
          </span>

          <span>
            <CategoryLabel>Category</CategoryLabel>

            <CategorySelect
              onChange={(newCategoryId) => updateTodo('category', newCategoryId)}
              currentCategoryId={updatedTodo.category}
              noToggle
            />
          </span>

          <Buttons>
            <Button size="small" onClick={handleUpdateTodo} buttonType="success" label="Save todo">
              <SaveIcon />
            </Button>

            <Button size="small" onClick={completeTodo} label="Done">
              <CheckIcon />
            </Button>

            <Button
              size="small"
              onClick={() => {
                if (
                  window.confirm(`Are you sure you want to delete the board "${updatedTodo.text}"?`)
                )
                  deleteTodo();
              }}
              buttonType="error"
              label="Delete todo"
            >
              <TrashIcon />
            </Button>
          </Buttons>
        </OptionsWrapper>
      </Modal>
    </ModalWrapper>
  );
}

const CategoryLabel = styled.div`
  font-size: 0.85rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.medium('onSurface')};
  margin-bottom: 3px;
`;

const Priorities = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;

  button {
    display: block;
  }
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;

  button {
    width: 3rem;
    width: 75px;
    color: white;
    display: block;

    svg {
      height: 19px;
    }
  }
`;

const OptionsWrapper = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.sizes.spacing};
  padding: 0 ${({ theme }) => theme.sizes.spacing};
  width: 100%;
  border-radius: 5px;
  background: white;
  padding: 10px;
  margin: 0 10px;

  @media ${({ sidebarWidth }) => `(max-width: ${sidebarWidth + 680}px)`} {
    margin: 0;
  }
`;

const ModalWrapper = styled.div``;

TodoModal.propTypes = {
  completedListId: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool,
};

export default TodoModal;
