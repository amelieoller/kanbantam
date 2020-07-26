import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import CompletedTodos from '_organisms/CompletedTodos';
import Pomodoro from '_templates/Pomodoro';
import { attemptUpdateBoard } from '_actions/boards';
import { sortItemsByOrder } from '_utils/sorting';
import ChevronLeftIcon from '_assets/icons/chevrons-left.svg';
import ChevronRightIcon from '_assets/icons/chevrons-right.svg';
import AwardIcon from '_assets/icons/award.svg';
import ClockIcon from '_assets/icons/clock.svg';

function Sidebar({ isSidebarOpen, currentBoard, todayCompletedTodos }) {
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
      <CollapseButton onClick={() => handleToggleClick()} aria-label="Expand sidebar">
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </CollapseButton>
      <SidebarContent>
        <SectionWrapper>
          <SectionHeader isSidebarOpen={isSidebarOpen}>
            <ClockIcon />
            <h2>Pomodoro</h2>
          </SectionHeader>

          <Pomodoro
            currentBoard={currentBoard}
            firstTodo={currentTodos && currentTodos[0]}
            workLength={25}
            breakLength={5}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>

        <SectionWrapper>
          <SectionHeader isSidebarOpen={isSidebarOpen}>
            <AwardIcon />
            <h2>Completed Todos</h2>
          </SectionHeader>

          <CompletedTodos todayCompletedTodos={todayCompletedTodos} />
        </SectionWrapper>
      </SidebarContent>
    </SidebarWrapper>
  );
}

const SectionWrapper = styled.div`
  padding: 0.8rem 0 2.5rem 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(230 230 230);
  padding-bottom: 5px;
  color: ${({ theme }) => theme.colors.lighter(4, 'onBackground')};

  svg {
    margin: ${({ isSidebarOpen }) => (isSidebarOpen ? '0 2px 0 0' : '0 5px')};
    width: 30px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.lighter(8, 'onBackground')};
  }

  h2 {
    margin: 0;
    text-transform: uppercase;
    font-size: 14px;
  }
`;

const SidebarWrapper = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme, isSidebarOpen }) =>
    !isSidebarOpen ? theme.sizes.spacingSmall : theme.sizes.spacing};
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
  box-shadow: 3px 0px 8px 0px rgba(155, 170, 178, 0.1);
  color: ${({ theme }) => theme.colors.onSurface};
  width: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 0.4s ease;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: fixed;
  left: 0;
  z-index: 1;
`;

const SidebarContent = styled.div`
  overflow: hidden;
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  height: 30px;
  width: 30px;
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
    width: 16px;
    height: 16px;
  }
`;

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  currentBoard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultFocusList: PropTypes.string,
    category: PropTypes.string,
  }),
  todayCompletedTodos: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, id: PropTypes.string }),
  ),
};

export default Sidebar;
