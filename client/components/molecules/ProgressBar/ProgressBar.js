import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MinusCircleIcon from '_assets/icons/minus-circle.svg';
import PlusCircleIcon from '_assets/icons/plus-circle.svg';
import Button from '_atoms/Button';
import {
  Wrapper,
  ProgressBarWrapper,
  ProgressWrapper,
  ProgressFiller,
  TextLeft,
} from './ProgressBarStyles';

const ProgressBar = ({
  total,
  elapsed,
  type,
  handleUpdate,
  incrementBy,
  showMinus,
  incrementLabel,
  decrementLabel,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = (elapsed / total) * 100;

    setPercentage(calculatedPercentage > 100 ? 100 : calculatedPercentage);
  }, [total, elapsed]);

  const handleIncrement = () => handleTotalUpdate(total + incrementBy);
  const handleDecrement = () => handleTotalUpdate(total - incrementBy);

  const handleTotalUpdate = (newTotal) => {
    // If newTotal is below 0 or is the same as previousTotal, return
    if (newTotal === total || newTotal < 0) return;

    handleUpdate(newTotal);
  };

  return (
    <Wrapper>
      <TopText>
        <span className="left">
          <span className="time-done">
            {elapsed}
            {type}
          </span>
          <span> of {total}</span>
        </span>
        <span className="right">
          {total - elapsed}
          {type} left
        </span>
      </TopText>

      <ProgressBarWrapper>
        {/* {showMinus && (
          <Button
            data-testid="decrement-button"
            data-type="isClickable"
            onClick={handleDecrement}
            label={decrementLabel}
            textColor="surfaceVariant"
            size="small"
            noBackground
          >
            <MinusCircleIcon data-type="isClickable" />
          </Button>
        )} */}

        <ProgressWrapper>
          <ProgressFiller className="filler" percentage={percentage}>
            {/* <TextLeft percentage={percentage} data-testid="progress-text">
              {total - elapsed} {type} left / {total}
            </TextLeft> */}
          </ProgressFiller>
        </ProgressWrapper>

        {/* <Button
          data-testid="increment-button"
          data-type="isClickable"
          onClick={handleIncrement}
          label={incrementLabel}
          textColor="surfaceVariant"
          size="small"
          noBackground
        >
          <PlusCircleIcon data-type="isClickable" />
        </Button> */}
      </ProgressBarWrapper>
    </Wrapper>
  );
};

const TopText = styled.div`
  display: flex;
  justify-content: space-between;
  color: #9d9ea7;
  font-weight: 500;
  padding: 2px;
  padding-top: 0;
  font-size: 10px;

  .left {
    .time-done {
      color: #85cda2;
    }
  }

  .right {
  }
`;

ProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  elapsed: PropTypes.number,
  type: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  incrementBy: PropTypes.number.isRequired,
  showMinus: PropTypes.bool,
  incrementLabel: PropTypes.string,
  decrementLabel: PropTypes.string,
};

ProgressBar.defaultProps = {
  elapsed: 0,
  showMinus: true,
  incrementLabel: 'Increment',
  decrementLabel: 'Decrement',
};

export default ProgressBar;
