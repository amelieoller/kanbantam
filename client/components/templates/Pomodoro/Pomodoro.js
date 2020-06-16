import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ProgressBar from '_molecules/ProgressBar';
import { attemptUpdateBoard } from '_actions/boards';
import { attemptUpdateTodo } from '_actions/todos';
import { formatTime, formatYearMonthDay } from '_utils/dates';
import { useInterval } from '_hooks/useInterval';
import PauseCircle from '_assets/icons/pause-circle.svg';
import PlayCircle from '_assets/icons/play-circle.svg';
import Repeat from '_assets/icons/repeat.svg';

const Pomodoro = ({ firstTodo, currentBoard, workLength, breakLength, isSidebarOpen }) => {
  const today = new Date();
  const formattedDate = formatYearMonthDay(today);

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
    if (isWorkSession && !isStartOfSession && minuteHasPassed && firstTodo) {
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

      // Update title
      const [minutes, seconds] = formatTime(timePassedMs, sessionLength);
      document.title = `${minutes}:${seconds}`;
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
    const currentElapsed = currentBoard.elapsedPomodori;

    const newElapsed = {
      ...currentElapsed,
      [formattedDate]: currentElapsed[formattedDate] ? currentElapsed[formattedDate] + 1 : 1,
    };

    dispatch(
      attemptUpdateBoard({
        id: currentBoard.id,
        elapsedPomodori: newElapsed,
      }),
    );
  };

  // Increase or decrease totalPomodori on the board
  const handleBarUpdate = (newTotal) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, totalPomodori: newTotal }));
  };

  const [minutes, seconds] = formatTime(timePassedMs, sessionLength);

  return isSidebarOpen ? (
    <StyledPomodoro>
      <h1>
        {minutes}:{seconds}
      </h1>

      <Controls>
        {!isRunning ? (
          <PlayCircle onClick={playOrPauseTimer} />
        ) : (
          <PauseCircle onClick={playOrPauseTimer} />
        )}
        <Repeat onClick={switchSessions} />
      </Controls>

      <ProgressBar
        total={currentBoard.totalPomodori}
        elapsed={currentBoard.elapsedPomodori && currentBoard.elapsedPomodori[formattedDate]}
        type="Pomodori"
        handleBarUpdate={handleBarUpdate}
        increment={1}
        minus
      />
    </StyledPomodoro>
  ) : (
    <MinimalPomodoroWrapper>
      <MinimalClock>
        <span>{minutes}</span>
        <span>{seconds}</span>
      </MinimalClock>

      <Controls>
        {!isRunning ? (
          <PlayCircle onClick={playOrPauseTimer} />
        ) : (
          <PauseCircle onClick={playOrPauseTimer} />
        )}
      </Controls>
    </MinimalPomodoroWrapper>
  );
};

const MinimalPomodoroWrapper = styled.div`
  margin-top: 1rem;
`;

const MinimalClock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > *:first-child {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.colors.darker(5, 'surfaceVariant')};
  }

  & > *:last-child {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.surfaceVariant};
  }
`;

const StyledPomodoro = styled.div`
  text-align: center;

  h1 {
    font-size: 2rem;
  }
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minMax(40px, 1fr));

  svg {
    color: ${({ theme }) => theme.colors.darker(15, 'surfaceVariant')};
  }

  & > * {
    cursor: pointer;
    margin: 8px auto;
    height: 25px;
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
    elapsedPomodori: PropTypes.shape({}),
  }),
  workLength: PropTypes.number.isRequired,
  breakLength: PropTypes.number.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
};

export default Pomodoro;
