import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const R = require('ramda');

import SettingsIcon from '_assets/icons/settings.svg';
import Heart from '_assets/icons/heart.svg';
import List from '_assets/icons/list.svg';
import X from '_assets/icons/x.svg';
import Eye from '_assets/icons/eye.svg';
import AlertCircle from '_assets/icons/alert-circle.svg';
import Trash from '_assets/icons/trash-2.svg';

import Categories from '_organisms/Categories';
import Dropdown from '_atoms/Dropdown';
import Checkbox from '_atoms/Checkbox';
import SlideOutMenu from '_organisms/SlideOutMenu';
import IconButton from '_atoms/IconButton';
import Input from '_atoms/Input';
import Tooltip from '_atoms/Tooltip';
import { attemptDeleteBoard, attemptUpdateBoard } from '_thunks/boards';

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

const Settings = ({ board }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(R.pick(['categories']));
  const { lists } = useSelector(R.pick(['lists']));

  const [defaultTime, setDefaultTime] = useState(0);
  const [defaultCategory, setDefaultCategory] = useState('');
  const [defaultFocusList, setDefaultFocusList] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  const [settingsPending, setSettingsPending] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  useEffect(() => {
    setDefaultTime(board.defaultTime);
    setDefaultCategory(board.defaultCategory);
    setFocusMode(board.focusMode);
    setDefaultFocusList(board.defaultFocusList);
  }, [board]);

  const handleUpdateBoard = () => {
    if (settingsPending) {
      console.log(
        'defaultTime',
        defaultTime,
        'defaultCategory',
        defaultCategory,
        'focusMode',
        focusMode,
        'defaultFocusList',
        defaultFocusList,
      );

      dispatch(
        attemptUpdateBoard({
          id: board.id,
          defaultTime,
          defaultCategory,
          focusMode,
          defaultFocusList,
        }),
      );

      setSettingsPending(false);
    }
  };

  const toggleSettingsMenu = (bool) => {
    if (bool === false) handleUpdateBoard();

    setIsSettingsMenuOpen((prevState) => !prevState);
  };

  const deleteBoard = () => dispatch(attemptDeleteBoard(board.id));

  return (
    <>
      <SlideOutMenu
        isOpen={isSettingsMenuOpen}
        closeCallback={() => toggleSettingsMenu(false)}
        right
        width={350}
      >
        <StyledSettings>
          <X
            className="close-button"
            onClick={() => {
              toggleSettingsMenu(false);
              handleUpdateBoard();
            }}
          />
          <h1>Settings</h1>

          {/* Presets */}
          <h2>
            <Heart />
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

          <InputWrapper>
            <Input
              label="Default Minutes"
              handleOnBlur={(value) => {
                const newMinutes = value === '' ? 0 : value;

                setSettingsPending(true);
                setDefaultTime(parseInt(newMinutes, 10));
              }}
              defaultValue={defaultTime === 0 ? '' : defaultTime}
              type="number"
              helpText="Default time to be added to each new card"
            />
          </InputWrapper>

          {/* Categories */}
          <h2>
            <List />
            Categories
          </h2>
          <Categories boardId={board.id} />

          {/* Focus Mode */}
          <h2>
            <Eye /> Focus Mode
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
            label="Activate when time starts"
            onChange={() => {
              setSettingsPending(true);
              setFocusMode(!focusMode);
            }}
            checked={focusMode}
            name="focusMode"
          />

          {/* Delete Board */}
          <h2>
            <AlertCircle />
            Danger Zone
          </h2>
          <DeleteSection>
            Delete this board:
            <Trash
              role="button"
              tabIndex={0}
              className="delete-button"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete the board "${board.title}"?`,
                  )
                )
                  deleteBoard();
              }}
            />
          </DeleteSection>
        </StyledSettings>
      </SlideOutMenu>

      <Tooltip tooltipText="Settings">
        <IconButton
          onClick={() => toggleSettingsMenu(true)}
          color="background"
          className="no-focus-mode"
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

const DeleteSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputWrapper = styled.div`
  margin: 15px 0;
`;

Settings.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    defaultTime: PropTypes.number.isRequired,
    defaultCategory: PropTypes.string.isRequired,
    focusMode: PropTypes.bool.isRequired,
    defaultFocusList: PropTypes.string.isRequired,
  }).isRequired,
};

export default Settings;
