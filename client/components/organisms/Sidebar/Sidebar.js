import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import CompletedTodos from '_organisms/CompletedTodos';
import TaskGraph from '_organisms/TaskGraph';
import Pomodoro from '_templates/Pomodoro';
import { attemptUpdateBoard } from '_actions/boards';
import { sortItemsByOrder } from '_utils/sorting';
import { filterByCategory } from '_utils/filtering';
import ChevronLeftIcon from '_assets/icons/chevrons-left.svg';
import ChevronRightIcon from '_assets/icons/chevrons-right.svg';

function Sidebar({ isSidebarOpen, currentBoard }) {
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

  // const renderSectionHeader = (title) =>
  //   isSidebarOpen && (
  //     <SectionHeader isSidebarOpen={isSidebarOpen}>
  //       <h2>{title}</h2>
  //     </SectionHeader>
  //   );

  return (
    <SidebarWrapper isSidebarOpen={isSidebarOpen}>
      <CollapseButton onClick={() => handleToggleClick()} aria-label="Expand sidebar">
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </CollapseButton>
      <SidebarContent>
        <SectionWrapper>
          <Pomodoro
            currentBoard={currentBoard}
            firstTodo={firstTodo}
            workLength={currentBoard.workSessionLength}
            breakLength={currentBoard.breakSessionLength}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>

        {/* <SectionWrapper>
          {renderSectionHeader("Today's Focus")}

          <TodaysFocus boardId={currentBoard.id} boardFocusToday={currentBoard.focusToday} />
        </SectionWrapper> */}

        <SectionWrapper>
          {/* {renderSectionHeader('Pomodori Finished')} */}

          <TaskGraph
            boardId={currentBoard.id}
            totalPomodori={currentBoard.totalPomodori}
            elapsedPomodori={currentBoard.elapsedPomodori}
            isSidebarOpen={isSidebarOpen}
          />
        </SectionWrapper>

        <SectionWrapper>
          {/* {renderSectionHeader('Completed Todos')} */}

          <CompletedTodos />
        </SectionWrapper>
      </SidebarContent>
    </SidebarWrapper>
  );
}

const SectionWrapper = styled.div`
  padding: 50px 15px;
  position: relative;
`;

// const SectionHeader = styled.div`
//   position: absolute;
//   color: #c7c3bd;
//   bottom: 3px;
//   padding-top: 3px;
//   left: 8px;

//   svg {
//     margin: ${({ isSidebarOpen }) => (isSidebarOpen ? '0 2px 0 0' : '0 5px')};
//     width: 25px;
//     flex-shrink: 0;
//     color: ${({ theme }) => theme.colors.lighter(8, 'onBackground')};
//   }

//   h2 {
//     margin: 0;
//     text-transform: uppercase;
//     font-size: 15px;
//     font-weight: 500;
//   }
// `;

const SidebarWrapper = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
  box-shadow: 3px 0px 8px 0px rgba(155, 170, 178, 0.1);
  color: ${({ theme }) => theme.colors.onSurface};
  width: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 0.4s ease;
  overflow-y: scroll;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: fixed;
  left: 0;
  z-index: 1;
`;

const SidebarContent = styled.div`
  & > * {
    border-bottom: 1px solid #eaebf3;
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 50%;
  top: calc(85vh - 40px);
  transform: translateX(-50%);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding: 0;
  border: none;
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
    width: 20px;
    height: 20px;
  }
`;

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  currentBoard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultFocusList: PropTypes.string,
    category: PropTypes.string,
    focusToday: PropTypes.string,
    workSessionLength: PropTypes.number,
    breakSessionLength: PropTypes.number,
    totalPomodori: PropTypes.number,
    elapsedPomodori: PropTypes.shape({}),
  }),
};

export default Sidebar;
