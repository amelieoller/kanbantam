import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Button from '_atoms/Button';
import ProgressBar from '_molecules/ProgressBar';
import { attemptUpdateBoard } from '_actions/boards';
import { attemptUpdateTodo } from '_actions/todos';
import { formatTime, formatYearMonthDay } from '_utils/dates';
import { useInterval } from '_hooks/useInterval';
import PauseCircleIcon from '_assets/icons/pause-circle.svg';
import PlayCircleIcon from '_assets/icons/play-circle.svg';
import RepeatIcon from '_assets/icons/repeat.svg';
import notification from '_assets/sounds/notification.mp3';

const Pomodoro = ({ firstTodo, currentBoard, workLength, breakLength, isSidebarOpen }) => {
  const today = new Date();
  const formattedDate = formatYearMonthDay(today);

  const dispatch = useDispatch();

  const [sessionLength, setSessionLength] = useState(workLength); // If it's a work session (25 min) or a break (5 min)
  const [pausedTime, setPausedTime] = useState(0); // Ms when the timer was paused (so it can be started at that exact time)
  const [timePassedMs, setTimePassedMs] = useState(0); // The ms of time that have passed
  const [endTime, setEndTime] = useState(0); // Ms to when the time is run out (time now + length of the session in min * 60000)
  const [isRunning, setIsRunning] = useState(false); // Is the timer running or not

  const audio = new Audio(notification);

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

      audio.play();

      // Timer finished running, switch sessions
      switchSessions();
    } else {
      const newMsPassed = endTime - new Date().getTime();

      // Update title
      const [minutes, seconds] = formatTime(newMsPassed, sessionLength);
      document.title = `${minutes}:${seconds}`;

      // Run the timer updating time passed
      setTimePassedMs(newMsPassed);
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

    document.title = 'Kanbantam';
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

  const renderPlayPauseButtons = () => {
    if (!isRunning) {
      return (
        <Button className="play" onClick={playOrPauseTimer} label="Play" noBackground>
          <PlayCircleIcon />
        </Button>
      );
    }
    return (
      <Button className="pause" onClick={playOrPauseTimer} label="Pause" noBackground>
        <PauseCircleIcon />
      </Button>
    );
  };

  return (
    <StyledPomodoro isSidebarOpen={isSidebarOpen}>
      {/* Clock */}
      <Clock isSidebarOpen={isSidebarOpen}>
        <Button className="repeat" onClick={switchSessions} label="Switch sessions" noBackground>
          <RepeatIcon />
        </Button>

        <span className="minutes">{minutes}</span>
        <span className="seconds">{seconds}</span>
      </Clock>

      {/* Controls */}
      <Controls isSidebarOpen={isSidebarOpen}>{renderPlayPauseButtons()}</Controls>
    </StyledPomodoro>
  );
};

const StyledPomodoro = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 130px;

  .repeat {
    padding-right: ${({ isSidebarOpen }) => (isSidebarOpen ? '8px' : '0')};
    padding-bottom: ${({ isSidebarOpen }) => (isSidebarOpen ? '0' : '5px')};
    color: ${({ theme }) => theme.colors.darker(15, 'surfaceVariant')};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.surfaceVariant};
      outline: none;
    }

    svg {
      height: 15px;
    }
  }

  svg {
    transition: all 0.3s ease;
    cursor: pointer;
  }
`;

const Clock = styled.div`
  display: flex;
  flex-direction: ${({ isSidebarOpen }) => (isSidebarOpen ? 'row' : 'column')};
  align-items: ${({ isSidebarOpen }) => (isSidebarOpen ? 'baseline' : 'center')};
  justify-content: center;
  margin-bottom: ${({ isSidebarOpen }) => (isSidebarOpen ? '10px' : '5px')};
  margin-top: 10px;

  .minutes {
    font-size: ${({ isSidebarOpen }) => (isSidebarOpen ? '3rem' : '2.4rem')};
    color: ${({ theme }) => theme.colors.onBackground};
    padding-right: ${({ isSidebarOpen }) => (isSidebarOpen ? '2px' : '0')};
  }

  .seconds {
    font-size: ${({ isSidebarOpen }) => (isSidebarOpen ? '1.7rem' : '1.4rem')};
    color: ${({ theme }) => theme.colors.darker(3, 'surfaceVariant')};
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: ${({ isSidebarOpen }) => (isSidebarOpen ? 'row' : 'column')};

  .play,
  .pause {
    svg {
      height: 35px;
    }
  }

  .play {
    color: ${({ theme }) => theme.colors.success};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.lighter(2, 'success')};
    }
  }

  .pause {
    color: ${({ theme }) => theme.colors.error};

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.lighter(2, 'error')};
    }
  }

  button:hover,
  button:focus {
    outline: none;
  }
`;

const ProgressBarWrapper = styled.div`
  margin-top: 10px;
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
