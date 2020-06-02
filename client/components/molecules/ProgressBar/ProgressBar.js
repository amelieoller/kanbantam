import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptUpdateTodo } from '_thunks/todos';
import PlusCircle from '_assets/icons/plus-circle.svg';

const ProgressBar = ({ minutes, elapsedMinutes, todoId }) => {
  const [percentage, setPercentage] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const calculatedPercentage = (elapsedMinutes / minutes) * 100;

    setPercentage(calculatedPercentage > 100 ? 100 : calculatedPercentage);
  }, [minutes, elapsedMinutes]);

  const handleTimeUpdate = (amount) => {
    let newMinutes = minutes + amount;

    // If newMinutes are below 0, set to 0
    if (newMinutes < 0) newMinutes = 0;

    // If newMinutes are the same as minutes return
    if (newMinutes === minutes) return;

    dispatch(attemptUpdateTodo({ id: todoId, minutes: newMinutes }));
  };

  return (
    <Wrapper>
      <ProgressBarWrapper>
        <ProgressWrapper>
          <ProgressFiller className="filler" width={percentage}>
            <TextLeft>{minutes - elapsedMinutes} minutes left</TextLeft>
          </ProgressFiller>
        </ProgressWrapper>

        <Button data-type="isClickable" onClick={() => handleTimeUpdate(10)}>
          <PlusCircle data-type="isClickable" />
        </Button>
      </ProgressBarWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding-left: 3px;
  padding-right: 0;
  align-items: center;
  display: flex;

  svg {
    height: 13px;
    width: 13px;
    color: ${({ theme }) => theme.colors.lighter(8, 'onSurface')};
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  height: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.lighter(9, 'onSurface')};
  width: 100%;
`;

const ProgressFiller = styled.div`
  background: ${({ theme }) => theme.colors.lighter(8, 'onSurface')};
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s ease-in;
  color: ${({ theme }) => theme.colors.onSecondary};
  display: flex;
  align-items: center;
  width: ${({ width }) => width}%;
`;

const TextLeft = styled.span`
  color: ${({ theme }) => theme.colors.lighter(5, 'onSurface')};
  font-size: 0.75rem;
  font-style: italic;
  white-space: nowrap;
  padding-left: 4px;
`;

ProgressBar.propTypes = {
  minutes: PropTypes.number.isRequired,
  elapsedMinutes: PropTypes.number,
  todoId: PropTypes.string.isRequired,
};

ProgressBar.defaultProps = {
  elapsedMinutes: 0,
};

export default ProgressBar;
