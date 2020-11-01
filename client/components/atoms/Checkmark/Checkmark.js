import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Check from '_assets/icons/check.svg';

const Checkmark = ({ onClick }) => {
  return (
    <StyledCheckmark onClick={onClick}>
      <svg className="check-circle">
        <circle
          stroke="white"
          strokeWidth="2"
          fill="transparent"
          r="13"
          cx="15"
          cy="15"
          strokeLinecap="round"
        />
      </svg>

      <Check className="check-mark" />
    </StyledCheckmark>
  );
};

const StyledCheckmark = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  cursor: pointer;

  svg.check-circle {
    width: 30px;
    height: 30px;

    circle {
      stroke-dasharray: 5.1 5;
      stroke: #b9dfc8;
      transition: all 1s ease;
    }
  }

  svg.check-mark {
    width: 18px;
    height: 18px;
    position: absolute;
    left: 21%;
    top: 22%;
    color: #b9dfc8;
    transition: all 1s ease;
  }

  &:hover {
    svg.check-circle circle {
      stroke-dasharray: 18 0;
      fill: #b9dfc847;
      stroke: #85cda2;
      stroke-width: 3px;
    }

    svg.check-mark {
      color: #85cda2;
      stroke-width: 4px;
    }
  }
`;

Checkmark.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Checkmark;
