import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Wrapper, ProgressBarWrapper, ProgressWrapper, ProgressFiller } from './ProgressBarStyles';
import { minutesAndHours } from '_utils/dates';

const ProgressBar = ({ total, elapsed }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = (elapsed / total) * 100;

    setPercentage(calculatedPercentage > 100 ? 100 : calculatedPercentage);
  }, [total, elapsed]);

  const timeLeft = () => {
    const minutesLeft = total - elapsed;
    const formattedMinutesAndHours = minutesAndHours(minutesLeft);

    if (minutesLeft >= 0) {
      return (
        <>
          <span className="green">{formattedMinutesAndHours}</span>
          <span> left</span>
        </>
      );
    } else {
      return (
        <>
          <span className="red">{formattedMinutesAndHours}</span>
          <span> over</span>
        </>
      );
    }
  };

  return (
    <Wrapper>
      <TopText>
        <span className="left">{elapsed ? <span> Total: {minutesAndHours(total)}</span> : ''}</span>

        <span className="right">{timeLeft()}</span>
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
  }

  .right {
  }

  .green {
    color: #85cda2;
  }

  .red {
    color: #f4a09a;
  }
`;

ProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  elapsed: PropTypes.number,
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
