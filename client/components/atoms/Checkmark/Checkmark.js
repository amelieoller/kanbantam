import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Check from '_assets/icons/check.svg';

const Checkmark = ({ onClick, highlight }) => {
  const size = 14;
  const stroke = 2;

  return (
    <StyledCheckmark
      onClick={onClick}
      data-type="isClickable"
      aria-label="Finish todo"
      label="Finish todo"
      size={size}
      stroke={stroke}
      highlight={highlight}
    >
      <svg className="check-circle" data-type="isClickable">
        <circle
          stroke="white"
          strokeWidth={stroke}
          fill="transparent"
          r={size - stroke}
          cx={size}
          cy={size}
          strokeLinecap="round"
          data-type="isClickable"
        />
      </svg>

      <Check className="check-mark" data-type="isClickable" />
    </StyledCheckmark>
  );
};

const StyledCheckmark = styled.div`
  position: relative;
  width: ${({ size }) => `${size * 2}px`};
  height: ${({ size }) => `${size * 2}px`};
  cursor: pointer;

  svg.check-circle {
    width: ${({ size }) => `${size * 2}px`};
    height: ${({ size }) => `${size * 2}px`};

    circle {
      stroke-dasharray: 5.1 5;
      stroke: ${({ highlight }) => (highlight ? '#B9DFC8' : '#eaebf3')};
      transition: all 0.8s ease;
    }
  }

  svg.check-mark {
    width: ${({ size, stroke }) => `${size + stroke}px`};
    height: ${({ size, stroke }) => `${size + stroke}px`};
    position: absolute;
    left: 23%;
    top: 24%;
    color: ${({ highlight }) => (highlight ? '#B9DFC8' : '#eaebf3')};
    transition: all 0.8s ease;
    stroke-width: 3px;
  }

  &:hover {
    svg.check-circle circle {
      stroke-dasharray: 18 0;
      stroke: ${({ theme }) => theme.colors.lighter(2, 'success')};
      stroke-width: 2px;
    }

    svg.check-mark {
      color: ${({ theme }) => theme.colors.lighter(2, 'success')};
      stroke-width: 3px;
    }
  }
`;

Checkmark.propTypes = {
  onClick: PropTypes.func.isRequired,
  highlight: PropTypes.bool,
};

Checkmark.defaultProps = {
  highlight: false,
};

export default Checkmark;
