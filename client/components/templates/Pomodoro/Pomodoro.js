import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { attemptUpdateTodo } from '_thunks/todos';
import { attemptUpdateBoard } from '_thunks/boards';
import { useInterval } from '_hooks/useInterval';
import { formatTime } from '_utils/dates';
import ProgressBar from '_molecules/ProgressBar';
import PlayCircle from '_assets/icons/play-circle.svg';
import PauseCircle from '_assets/icons/pause-circle.svg';
import Repeat from '_assets/icons/repeat.svg';

const Pomodoro = ({
  firstTodo,
  currentBoard,
  workLength,
  breakLength,
  isSidebarOpen,
}) => {
  const dispatch = useDispatch();

  const [sessionLength, setSessionLength] = useState(workLength); // If it's a work session (25 min) or a break (5 min)
  const [pausedTime, setPausedTime] = useState(0); // Ms when the timer was paused (so it can be started at that exact time)
  const [timePassedMs, setTimePassedMs] = useState(0); // The ms of time that have passed
  const [endTime, setEndTime] = useState(0); // Ms to when the time is run out (time now + length of the session in min * 60000)
  const [isRunning, setIsRunning] = useState(false); // Is the timer running or not

  // -------------- MAIN TIMER FUNCTIONALITY --------------
  const elapseTime = () => {
    const isWorkSession = sessionLength === workLength;
    const isStartOfSession = timePassedMs === 0;
    const minuteHasPassed = Math.floor((timePassedMs / 1000) % 60) === 0;
    // If a minute has passed, update todo (make sure it is a workSession, not the beginning of a session, and the minute has passed)
    if (isWorkSession && !isStartOfSession && minuteHasPassed) {
      updateTodo();
    }

    // If time is over switch sessions, otherwise, run the timer
    if (!isStartOfSession && timePassedMs < 1000) {
      // If a work session has elapsed, update board
      if (isWorkSession) {
        updateBoard();
      }

      switchSessions();
    } else {
      // Start the timer by setting setTimePassedMs to endTime minus now
      setTimePassedMs(endTime - new Date().getTime());
    }
  };

  // Pass elapseTime to useInterval and run every 990 ms
  useInterval(elapseTime, isRunning ? 990 : null);

  // -------------- EFFECTS --------------
  // First time starting timer
  useEffect(() => {
    if (isRunning && !endTime) {
      setEndTime(new Date().getTime() + sessionLength * 60000);
    }
  }, [isRunning, sessionLength, endTime]);

  // Whenever timer is resumed after a pause
  useEffect(() => {
    if (isRunning && pausedTime) {
      const newStartTime = new Date().getTime();

      setEndTime(newStartTime + pausedTime);
    }
  }, [isRunning, pausedTime]);

  // Every time the timer is paused
  useEffect(() => {
    if (!isRunning && endTime) {
      setPausedTime(endTime - new Date().getTime());
    }
  }, [isRunning, endTime]);

  // -------------- HELPERS --------------
  const switchSessions = () => {
    // Switch sessions and reset everything else
    setSessionLength(sessionLength === workLength ? breakLength : workLength);
    setPausedTime(0);
    setTimePassedMs(0);
    setEndTime(0);
    setIsRunning(false);
  };

  const playOrPauseTimer = () => setIsRunning((prevIsRunning) => !prevIsRunning);

  // -------------- DATABASE UPDATES --------------
  // Elapse one minute on the first todo in the default list
  const updateTodo = () => {
    dispatch(
      attemptUpdateTodo({
        id: firstTodo.id,
        elapsedMinutes: firstTodo.elapsedMinutes + 1,
      }),
    );
  };

  // Increase elapsedPomodori by 1 on the board
  const updateBoard = () => {
    dispatch(
      attemptUpdateBoard({
        id: currentBoard.id,
        elapsedPomodori: currentBoard.elapsedPomodori + 1,
      }),
    );
  };

  // Increase or decrease totalPomodori on the board
  const handleBarUpdate = (newTotal) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, totalPomodori: newTotal }));
  };

  return (
    <StyledPomodoro isSidebarOpen={isSidebarOpen}>
      <h1>{formatTime(timePassedMs, sessionLength)}</h1>

      <Controls isSidebarOpen={isSidebarOpen}>
        {!isRunning ? (
          <PlayCircle onClick={playOrPauseTimer} />
        ) : (
          <PauseCircle onClick={playOrPauseTimer} />
        )}
        {isSidebarOpen && <Repeat onClick={switchSessions} />}
      </Controls>

      {isSidebarOpen && (
        <ProgressBar
          total={currentBoard.totalPomodori}
          elapsed={currentBoard.elapsedPomodori}
          type="Pomodori"
          handleBarUpdate={handleBarUpdate}
          increment={1}
          minus
        />
      )}
    </StyledPomodoro>
  );
};

const StyledPomodoro = styled.div`
  text-align: center;

  h1 {
    font-size: ${({ isSidebarOpen }) => (isSidebarOpen ? '2rem' : '1rem')};
  }
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minMax(40px, 1fr));

  & > * {
    cursor: pointer;
    margin: ${({ isSidebarOpen }) => (isSidebarOpen ? '8px auto' : '0 5px')};
    height: ${({ isSidebarOpen }) => (isSidebarOpen ? '25px' : '20px')};
  }
`;

Pomodoro.propTypes = {
  firstTodo: PropTypes.shape({
    id: PropTypes.string,
    elapsedMinutes: PropTypes.number,
  }),
  currentBoard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalPomodori: PropTypes.number,
    elapsedPomodori: PropTypes.number,
  }),
  workLength: PropTypes.number.isRequired,
  breakLength: PropTypes.number.isRequired,
};

export default Pomodoro;
