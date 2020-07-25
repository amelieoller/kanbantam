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
  handleBarUpdate,
  increment,
  minus,
  incrementLabel,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = (elapsed / total) * 100;

    setPercentage(calculatedPercentage > 100 ? 100 : calculatedPercentage);
  }, [total, elapsed]);

  const handleTotalUpdate = (amount) => {
    let newTotal = total + amount;

    // If newTotal are below 0, set to 0
    if (newTotal < 0) newTotal = 0;

    // If newTotal are the same as total return
    if (newTotal === total) return;

    handleBarUpdate(newTotal);
  };

  return (
    <Wrapper>
      <ProgressBarWrapper>
        {minus && (
          <Button
            data-type="isClickable"
            onClick={() => handleTotalUpdate(-increment)}
            label="Subtract 10 minutes"
            textColor="surfaceVariant"
            size="small"
            noBackground
          >
            <MinusCircleIcon data-type="isClickable" />
          </Button>
        )}

        <ProgressWrapper>
          <ProgressFiller className="filler" percentage={percentage}>
            <TextLeft percentage={percentage}>
              {total - elapsed} {type} left / {total}
            </TextLeft>
          </ProgressFiller>
        </ProgressWrapper>

        <Button
          data-type="isClickable"
          onClick={() => handleTotalUpdate(increment)}
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
  handleBarUpdate: PropTypes.func.isRequired,
  increment: PropTypes.number.isRequired,
  minus: PropTypes.bool,
};

ProgressBar.defaultProps = {
  elapsed: 0,
};

export default ProgressBar;
