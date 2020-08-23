import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MinusCircleIcon from '_assets/icons/minus-circle.svg';
import PlusCircleIcon from '_assets/icons/plus-circle.svg';
import Button from '_atoms/Button';

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
      <ProgressBarWrapper>
        {showMinus && (
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
        )}

        <ProgressWrapper>
          <ProgressFiller className="filler" percentage={percentage}>
            <TextLeft percentage={percentage} data-testid="progress-text">
              {total - elapsed} {type} left / {total}
            </TextLeft>
          </ProgressFiller>
        </ProgressWrapper>

        <Button
          data-testid="increment-button"
          data-type="isClickable"
          onClick={handleIncrement}
          label={incrementLabel}
          textColor="surfaceVariant"
          size="small"
          noBackground
        >
          <PlusCircleIcon data-type="isClickable" />
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

  & > *:not(:last-child) {
    margin-right: 3px;
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  height: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.lighter(1, 'surfaceVariant')};
  width: 100%;
`;

const ProgressFiller = styled.div`
  background: ${({ theme, percentage }) =>
    percentage < 40
      ? theme.colors.lighter(75, 'onSurface')
      : theme.colors.lighter(parseInt(1000 / percentage), 'success')};
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s ease-in;
  display: flex;
  align-items: center;
  width: ${({ percentage }) => percentage}%;
`;

const TextLeft = styled.span`
  color: ${({ theme, percentage }) =>
    percentage < 40 ? theme.colors.lighter(2, 'onSurface') : theme.colors.onSurfaceVariant};
  font-size: 0.75rem;
  font-style: italic;
  white-space: nowrap;
  padding-left: 4px;
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
