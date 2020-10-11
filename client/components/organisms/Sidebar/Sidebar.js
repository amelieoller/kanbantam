import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import CompletedTodos from '_organisms/CompletedTodos';
import TaskGraph from '_organisms/TaskGraph';
import TodaysFocus from '_molecules/TodaysFocus';
import Pomodoro from '_templates/Pomodoro';
import { attemptUpdateBoard } from '_actions/boards';
import { sortItemsByOrder } from '_utils/sorting';
import { filterByCategory } from '_utils/filtering';
import ChevronLeftIcon from '_assets/icons/chevrons-left.svg';
import ChevronRightIcon from '_assets/icons/chevrons-right.svg';
import AwardIcon from '_assets/icons/award.svg';
import ClockIcon from '_assets/icons/clock.svg';

function Sidebar({
  isSidebarOpen,
  currentBoard,
  todayCompletedTodos,
  yesterdayCompletedTodos,
  completedListId,
}) {
  const dispatch = useDispatch();

  const [firstTodo, setFirstTodo] = useState(null);

  const { todos } = useSelector(R.pick(['todos']));

  useEffect(() => {
    const focusListId = currentBoard.defaultFocusList;

    if (currentBoard.defaultFocusList && todos.length !== 0) {
      // Get only todos from the focus list
      const todosFromFocusList = todos.filter((t) => t.list === focusListId);
      // Filter those todos by category (if a category filter is selected)
      const todosFilteredByCategory = filterByCategory(currentBoard.category, todosFromFocusList);
      // Sort the todos by order
      const sortedTodos = sortItemsByOrder(todosFilteredByCategory);

      setFirstTodo(sortedTodos[0]);
    }
  }, [currentBoard.defaultFocusList, currentBoard.category, todos]);

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, ...attribute }));
  };

  const handleToggleClick = () => {
    handleUpdateBoard({ sidebarOpen: !isSidebarOpen });
  };

  const renderSectionHeader = (title) =>
    isSidebarOpen && (
      <SectionHeader isSidebarOpen={isSidebarOpen}>
        <h2>{title}</h2>
      </SectionHeader>
    );

  return (
    <SidebarWrapper isSidebarOpen={isSidebarOpen}>
      <CollapseButton onClick={() => handleToggleClick()} aria-label="Expand sidebar">
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </CollapseButton>
      <SidebarContent>
        <SectionWrapper>
          {renderSectionHeader('Pomodoro')}

          <Pomodoro
            currentBoard={currentBoard}
            firstTodo={firstTodo}
            workLength={25}
            breakLength={5}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>

        <SectionWrapper>
          {renderSectionHeader("Today's Focus")}

          <TodaysFocus />
        </SectionWrapper>

        <SectionWrapper>
          {renderSectionHeader('Pomodori Finished')}

          <TaskGraph
            boardId={currentBoard.id}
            totalPomodori={currentBoard.totalPomodori}
            elapsedPomodori={currentBoard.elapsedPomodori}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>

        <SectionWrapper>
          {renderSectionHeader('Completed Todos')}

          <CompletedTodos
            todayCompletedTodos={todayCompletedTodos}
            yesterdayCompletedTodos={yesterdayCompletedTodos}
            completedListId={completedListId}
          />
        </SectionWrapper>
      </SidebarContent>
    </SidebarWrapper>
  );
}

const SectionWrapper = styled.div`
  padding: 6px;
  position: relative;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: center;
  color: #c7c3bd;
  align-items: center;
  right: 3px;
  bottom: 3px;
  padding-top: 3px;

  svg {
    margin: ${({ isSidebarOpen }) => (isSidebarOpen ? '0 2px 0 0' : '0 5px')};
    width: 25px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.lighter(8, 'onBackground')};
  }

  h2 {
    margin: 0;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 500;
  }
`;

const SidebarWrapper = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
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

  & > *:nth-child(odd) {
    background: ${({ theme }) => theme.colors.lighter(87, 'onSurface')};

    h2 {
      color: #969696;
    }
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 100%;
  top: 10px;
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
  z-index: 1;

  &:hover,
  &:focus {
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
  todayCompletedTodos: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, id: PropTypes.string }),
  ),
};

export default Sidebar;
