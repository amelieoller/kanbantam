import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const R = require('ramda');

import Button from '_atoms/Button';
import Checkbox from '_atoms/Checkbox';
import Dropdown from '_atoms/Dropdown';
import Input from '_atoms/Input';
import Categories from '_organisms/Categories';
import SlideOutMenu from '_organisms/SlideOutMenu';
import { attemptUpdateBoard, attemptDeleteBoard } from '_actions/boards';
import AlertCircleIcon from '_assets/icons/alert-circle.svg';
import EyeIcon from '_assets/icons/eye.svg';
import HeartIcon from '_assets/icons/heart.svg';
import ListIcon from '_assets/icons/list.svg';
import SettingsIcon from '_assets/icons/settings.svg';
import TrashIcon from '_assets/icons/trash-2.svg';
import XIcon from '_assets/icons/x.svg';
import ClockIcon from '_assets/icons/clock.svg';

const Settings = ({ currentBoard }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(R.pick(['categories']));
  const { lists } = useSelector(R.pick(['lists']));

  const [defaultTimes, setDefaultTimes] = useState([0, 0, 0]);
  const [defaultCategory, setDefaultCategory] = useState('');
  const [defaultFocusList, setDefaultFocusList] = useState('');
  const [startFocusModeWithPomodoro, setStartFocusModeWithPomodoro] = useState(false);
  const [continuousPomodori, setContinuousPomodori] = useState(false);
  const [workSessionLength, setWorkSessionLength] = useState(0);
  const [breakSessionLength, setBreakSessionLength] = useState(0);

  const [settingsPending, setSettingsPending] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  useEffect(() => {
    setDefaultTimes(currentBoard.defaultTimes ? currentBoard.defaultTimes : [0, 0, 0]);
    setDefaultCategory(currentBoard.defaultCategory);
    setStartFocusModeWithPomodoro(currentBoard.startFocusModeWithPomodoro);
    setDefaultFocusList(currentBoard.defaultFocusList || '');
    setContinuousPomodori(currentBoard.continuousPomodori);
    setWorkSessionLength(currentBoard.workSessionLength);
    setBreakSessionLength(currentBoard.breakSessionLength);
  }, [currentBoard]);

  const handleUpdateBoard = () => {
    if (settingsPending) {
      dispatch(
        attemptUpdateBoard({
          id: currentBoard.id,
          defaultTimes,
          defaultCategory,
          startFocusModeWithPomodoro,
          defaultFocusList,
          continuousPomodori,
          workSessionLength,
          breakSessionLength,
        }),
      );

      setSettingsPending(false);
    }
  };

  const toggleSettingsMenu = (bool) => {
    if (bool === false) handleUpdateBoard();

    setIsSettingsMenuOpen((prevState) => !prevState);
  };

  const deleteBoard = () => dispatch(attemptDeleteBoard(currentBoard.id));

  const renderDefaultTimeInput = (index) => {
    const buttonLabel = `Default Minutes ${
      index === 0 ? '(First' : index === 1 ? '(Second' : '(Third'
    } Button)`;

    return (
      <InputWrapper>
        <Input
          label={buttonLabel}
          onChange={(e) => {
            const newMinutes = e.target.value === '' ? 0 : e.target.value;

            setSettingsPending(true);
            setDefaultTimes([
              ...defaultTimes.slice(0, index),
              parseInt(newMinutes, 10),
              ...defaultTimes.slice(index + 1, defaultTimes.length),
            ]);
          }}
          defaultValue={defaultTimes[index] === 0 ? '' : defaultTimes[index]}
          type="number"
          helpText="Default time to be added to each new card"
        />
      </InputWrapper>
    );
  };

  return (
    <>
      <SlideOutMenu
        isOpen={isSettingsMenuOpen}
        closeCallback={() => toggleSettingsMenu(false)}
        right
        width={350}
      >
        <StyledSettings>
          <XIcon
            className="close-button"
            onClick={() => {
              toggleSettingsMenu(false);
              handleUpdateBoard();
            }}
          />
          <h1>Settings</h1>

          {/* Presets */}
          <h2>
            <HeartIcon />
            Card Presets
          </h2>
          <InputWrapper>
            <Dropdown
              label="Default Category"
              defaultValue={defaultCategory}
              handleOnBlur={(e) => {
                setSettingsPending(true);
                setDefaultCategory(e.target.value);
              }}
              helpText="Default category to be added to each new card"
            >
              <option value="none">none</option>

              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.title}
                </option>
              ))}
            </Dropdown>
          </InputWrapper>

          {renderDefaultTimeInput(0)}
          {renderDefaultTimeInput(1)}
          {renderDefaultTimeInput(2)}

          {/* Categories */}
          <h2>
            <ListIcon />
            Categories
          </h2>
          <Categories boardId={currentBoard.id} />

          {/* Focus Mode */}
          <h2>
            <EyeIcon /> Focus Mode
          </h2>
          <InputWrapper>
            <Dropdown
              label="Default List"
              defaultValue={defaultFocusList}
              handleOnBlur={(e) => {
                setSettingsPending(true);
                setDefaultFocusList(e.target.value);
              }}
              helpText="Default list to focus on"
            >
              <option value="none">{'None'.toUpperCase()}</option>
              {lists
                .filter((l) => !l.special)
                .map((list) => (
                  <option value={list.id} key={list.id}>
                    {list.title.toUpperCase()}
                  </option>
                ))}
            </Dropdown>
          </InputWrapper>

          <Checkbox
            label="Activate when Pomodoro starts"
            onChange={() => {
              setSettingsPending(true);
              setStartFocusModeWithPomodoro(!startFocusModeWithPomodoro);
            }}
            checked={startFocusModeWithPomodoro}
            helpText="Activates focus mode when Pomodoro timer starts"
          />

          {/* Pomodoro */}
          <h2>
            <ClockIcon /> Pomodoro
          </h2>

          <Checkbox
            label="Enable continuous Pomodori"
            onChange={() => {
              setSettingsPending(true);
              setContinuousPomodori(!continuousPomodori);
            }}
            checked={continuousPomodori}
            helpText="Pomodoro timer will continue running and automatically switch from work to break mode and back"
          />

          <Input
            label="Work Session Length"
            onChange={(e) => {
              const newMinutes = e.target.value === '' ? 0 : e.target.value;

              setSettingsPending(true);
              setWorkSessionLength(parseInt(newMinutes, 10));
            }}
            defaultValue={workSessionLength === 0 ? '' : workSessionLength}
            type="number"
            helpText="Length of a work session in minutes (default is 25 minutes)"
          />

          <Input
            label="Break Session Length"
            onChange={(e) => {
              const newMinutes = e.target.value === '' ? 0 : e.target.value;

              setSettingsPending(true);
              setBreakSessionLength(parseInt(newMinutes, 10));
            }}
            defaultValue={breakSessionLength === 0 ? '' : breakSessionLength}
            type="number"
            helpText="Length of a break session in minutes (default is 5 minutes)"
          />

          {/* Delete Board */}
          <h2>
            <AlertCircleIcon />
            Danger Zone
          </h2>
          <DeleteSection
            onClick={() => {
              if (
                window.confirm(`Are you sure you want to delete the board "${currentBoard.title}"?`)
              )
                deleteBoard();
            }}
          >
            <TrashIcon />
            Delete this board
          </DeleteSection>
        </StyledSettings>
      </SlideOutMenu>

      <Button onClick={() => toggleSettingsMenu(true)} label="Open board settings" noBackground>
        <SettingsIcon />
      </Button>
    </>
  );
};

const StyledSettings = styled.div`
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.onSurface};
  width: 100%;
  min-height: 100%;
  padding: 20px;

  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    margin: 20px;
    font-size: 28px;
    color: ${(props) => props.theme.colors.monotoneAccent};
    cursor: pointer;
    padding: 4px;
    background: ${(props) => props.theme.colors.background};
    height: 28px;
  }

  h1,
  h2,
  h3 {
    font-weight: 400;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin-bottom: 0.8rem;
    margin-top: 2.3rem;
    display: flex;

    svg {
      margin-right: 0.5rem;
    }
  }

  h2 + p {
    margin-top: 0.3rem;
  }
`;

const DeleteSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.medium('onSurface')};
  margin-bottom: ${({ theme }) => theme.sizes.spacingLarge};

  svg {
    margin-right: 6px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.error};

    svg {
      color: ${(props) => props.theme.colors.error};
    }
  }
`;

const InputWrapper = styled.div`
  margin: 15px 0;
`;

Settings.propTypes = {
  currentBoard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    defaultCategory: PropTypes.string,
    startFocusModeWithPomodoro: PropTypes.bool,
    continuousPomodori: PropTypes.bool,
    defaultFocusList: PropTypes.string,
    workSessionLength: PropTypes.number,
    breakSessionLength: PropTypes.number,
  }).isRequired,
};

export default Settings;
