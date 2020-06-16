import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import Pomodoro from '_templates/Pomodoro';
import { attemptUpdateBoard } from '_actions/boards';
import { sortItemsByOrder } from '_utils/sorting';
import ChevronLeft from '_assets/icons/chevrons-left.svg';
import ChevronRight from '_assets/icons/chevrons-right.svg';
import Clock from '_assets/icons/clock.svg';

function Sidebar({ isSidebarOpen, currentBoard }) {
  const dispatch = useDispatch();

  const [currentTodos, setCurrentTodos] = useState(null);

  const { todos } = useSelector(R.pick(['todos']));

  useEffect(() => {
    if (currentBoard.defaultFocusList && todos.length !== 0) {
      // find default focus list, then the first todo in that list
      const focusListId = currentBoard.defaultFocusList;
      let filteredTodos = todos.filter((t) => t.list === focusListId);

      if (currentBoard.category) {
        // If cards are being filtered by category make sure the currentTodos array only contains those todos
        filteredTodos = filteredTodos.filter((t) => t.category === currentBoard.category);
      }

      const sortedTodos = sortItemsByOrder(filteredTodos);
      // also filter todos by if there is a category selected to view, use board category
      setCurrentTodos(sortedTodos);
    }
  }, [currentBoard.defaultFocusList, currentBoard.category, todos]);

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, ...attribute }));
  };

  const handleToggleClick = () => {
    handleUpdateBoard({ sidebarOpen: !isSidebarOpen });
  };

  return (
    <SidebarWrapper isSidebarOpen={isSidebarOpen}>
      <CollapseButton onClick={() => handleToggleClick()}>
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </CollapseButton>
      <SidebarContent>
        <SectionWrapper>
          {isSidebarOpen && (
            <SectionHeader>
              <Clock />
              <h2>Pomodoro</h2>
            </SectionHeader>
          )}

          <Pomodoro
            currentBoard={currentBoard}
            firstTodo={currentTodos && currentTodos[0]}
            workLength={25}
            breakLength={5}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>
      </SidebarContent>
    </SidebarWrapper>
  );
}

const SectionWrapper = styled.div``;

const SectionHeader = styled.div`
  display: grid;
  grid-template-columns: 30px auto;

  svg {
    margin-right: 4px;
    width: 30px;
  }

  h2 {
    margin: 0;
  }
`;

const SidebarWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme, isSidebarOpen }) =>
    !isSidebarOpen ? theme.sizes.spacingSmall : theme.sizes.spacing};
  padding-left: ${({ isSidebarOpen, theme }) =>
    !isSidebarOpen &&
    `${
      parseInt(theme.sizes.sidebarWidthLarge) -
      parseInt(theme.sizes.sidebarWidthSmall) +
      parseInt(theme.sizes.spacingSmall)
    }px`};
  width: ${({ theme }) => theme.sizes.sidebarWidthLarge};
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
  box-shadow: 3px 0px 8px 0px rgba(155, 170, 178, 0.1);
  color: ${({ theme }) => theme.colors.onSurface};
  transform: translate3d(
    ${({ isSidebarOpen, theme }) =>
      isSidebarOpen
        ? '0px'
        : `-${
            parseInt(theme.sizes.sidebarWidthLarge) - parseInt(theme.sizes.sidebarWidthSmall)
          }px`},
    0px,
    0px
  );
  transition: 0.4s ease;
  transform-origin: right center;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: fixed;
  z-index: 1;
`;

const SidebarContent = styled.div`
  overflow: hidden;
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 100%;
  top: 20%;
  transform: translateX(-50%);
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};

  &:hover {
    background: ${({ theme }) => theme.colors.darker(1, 'surface')};
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  currentBoard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultFocusList: PropTypes.string,
    category: PropTypes.string,
  }),
};

export default Sidebar;
