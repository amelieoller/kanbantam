import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import CompletedTodos from '_organisms/CompletedTodos';
import TaskGraph from '_organisms/TaskGraph';
import Pomodoro from '_templates/Pomodoro';
import { sortItemsByOrder } from '_utils/sorting';
import { filterByCategory } from '_utils/filtering';

function Sidebar({ isSidebarOpen, currentBoard }) {
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

  // const renderSectionHeader = (title) =>
  //   isSidebarOpen && (
  //     <SectionHeader isSidebarOpen={isSidebarOpen}>
  //       <h2>{title}</h2>
  //     </SectionHeader>
  //   );

  return (
    <>
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

        <CompletedTodos board={currentBoard} />
      </SectionWrapper>
    </>
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
