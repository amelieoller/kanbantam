import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Button from '_atoms/Button';
import { attemptUpdateBoard } from '_actions/boards';
import { attemptUpdateTodo } from '_actions/todos';
import { formatTime, formatYearMonthDay } from '_utils/dates';
import { useInterval } from '_hooks/useInterval';
import PauseIcon from '_assets/icons/pause.svg';
import PlayIcon from '_assets/icons/play.svg';
import RepeatIcon from '_assets/icons/repeat.svg';
import notification from '_assets/sounds/notification.mp3';

const audio = new Audio(notification);

const Pomodoro = ({ firstTodo, currentBoard, workLength, breakLength, isSidebarOpen }) => {
  const today = new Date();
  const formattedDate = formatYearMonthDay(today);

  const dispatch = useDispatch();

  const [sessionLength, setSessionLength] = useState(workLength); // If it's a work session (25 min) or a break (5 min)
  const [pausedTime, setPausedTime] = useState(0); // Ms when the timer was paused (so it can be started at that exact time)
  const [timePassedMs, setTimePassedMs] = useState(0); // The ms of time that have passed
  const [endTime, setEndTime] = useState(0); // Ms to when the time is run out (time now + length of the session in min * 60000)
  const [isRunning, setIsRunning] = useState(false); // Is the timer running or not
  const [isHovering, setIsHovering] = useState(false); // Is the user hovering over timer
  const [strokeDasharray, setStrokeDasharray] = useState('0,20000'); // Circle time elapsed

  const sessionLengthInMs = sessionLength * 60 * 1000;
  const fullCircleValue = 440;

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
      document.title = `${isWorkSession ? 'Work' : 'Break'} - ${minutes}:${seconds}`;

      // Update pomodoro circle
      setStrokeDasharray(
        `${fullCircleValue - (fullCircleValue / sessionLengthInMs) * newMsPassed},20000`,
      );

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
    setStrokeDasharray('0,20000');

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

  const [minutes, seconds] = formatTime(timePassedMs, sessionLength);

  const renderPlayPauseButtons = () => {
    const playButton = (
      <Button className="play" label="Play" noBackground>
        <PlayIcon />
      </Button>
    );

    const pauseButton = (
      <Button className="pause" label="Pause" noBackground>
        <PauseIcon />
      </Button>
    );

    return !isRunning ? playButton : pauseButton;
  };

  return (
    <StyledPomodoro isSidebarOpen={isSidebarOpen}>
      <Clock
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={playOrPauseTimer}
        isRunning={isRunning}
      >
        <svg className="striped">
          <circle strokeWidth="6" fill="transparent" cx="75" cy="75" r="70" />
        </svg>

        <svg preserveAspectRatio="none" className="full">
          <circle
            cx="75"
            cy="75"
            r="70"
            id="green-halo"
            fill="none"
            strokeDasharray={strokeDasharray}
            transform="rotate(-90,75,75)"
            strokeLinecap="round"
          />
        </svg>

        <div className="center">
          {isHovering ? (
            <Controls isSidebarOpen={isSidebarOpen}>{renderPlayPauseButtons()}</Controls>
          ) : (
            <>
              <span className="minutes">{minutes}</span>
              <span className="seconds">{seconds}</span>
            </>
          )}
        </div>
      </Clock>

      <Button className="repeat" onClick={switchSessions} label="Switch sessions" noBackground>
        <RepeatIcon />
      </Button>
    </StyledPomodoro>
  );
};

const Clock = styled.div`
  position: relative;
  width: 150px;
  height: 150px;

  .center {
    width: 55px;
    position: absolute;
    top: 38%;
    left: 33%;
    display: flex;
    justify-content: center;
    align-items: baseline;

    .minutes {
      font-size: ${({ isSidebarOpen }) => (isSidebarOpen ? '3rem' : '2.4rem')};
      color: ${({ theme }) => theme.colors.onBackground};
      padding-right: ${({ isSidebarOpen }) => (isSidebarOpen ? '2px' : '0')};
    }

    .seconds {
      font-size: ${({ isSidebarOpen }) => (isSidebarOpen ? '1.7rem' : '1.4rem')};
      color: ${({ theme }) => theme.colors.darker(3, 'surfaceVariant')};
    }
  }

  .striped {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 150px;

    circle {
      stroke-dasharray: 3 3;
      stroke: #eaebf3;
      transition: all 1s ease;
    }
  }

  .full {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 150px;

    circle {
      stroke: ${({ theme, isRunning }) =>
        isRunning ? theme.colors.lighter(2, 'success') : theme.colors.lighter(2, 'error')};
      stroke-width: 10px;
      transition: all 0.5s ease;
    }

    .time {
      fill: #898992;
      font-weight: 100;
    }

    .minutes {
      fill: #ccccd3;
      font-weight: 400;
    }
  }
`;

const StyledPomodoro = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .repeat {
    position: absolute;
    left: 8px;
    bottom: 8px;
    color: #eaebf3;
    outline: none;

    &:hover,
    &:focus {
      color: #898992;
    }
  }

  svg {
    transition: all 0.3s ease;
    cursor: pointer;
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
