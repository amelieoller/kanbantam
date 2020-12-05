import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PlusIcon from '_assets/icons/plus.svg';

const PlusButton = ({ onClick, label, children, large }) => {
  const size = large ? 17.5 : 14;
  const stroke = 2;

  return (
    <Wrapper>
      <StyledPlusButton
        onClick={onClick}
        size={size}
        stroke={stroke}
        label={label}
        aria-label={label}
      >
        <svg className="plus-circle">
          <circle
            stroke="white"
            strokeWidth={stroke}
            fill="transparent"
            r={size - stroke}
            cx={size}
            cy={size}
            strokeLinecap="round"
          />
        </svg>

        <PlusIcon className="plus-mark" />
      </StyledPlusButton>

      {children && <Label>{children}</Label>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Label = styled.div`
  margin-top: 2px;
`;

const StyledPlusButton = styled.div`
  position: relative;
  width: ${({ size }) => `${size * 2}px`};
  height: ${({ size }) => `${size * 2}px`};
  cursor: pointer;

  svg.plus-circle {
    width: ${({ size }) => `${size * 2}px`};
    height: ${({ size }) => `${size * 2}px`};

    circle {
      stroke-dasharray: 5.1 5;
      stroke: #ccccd3;
      transition: all 0.8s ease;
    }
  }

  svg.plus-mark {
    width: ${({ size, stroke }) => `${size + stroke}px`};
    height: ${({ size, stroke }) => `${size + stroke}px`};
    position: absolute;
    left: 22%;
    top: 23%;
    color: #ccccd3;
    transition: all 0.8s ease;
    stroke-width: 3px;
  }

  &:hover {
    svg.plus-circle circle {
      stroke-dasharray: 18 0;
      stroke: ${({ theme }) => theme.colors.primary};
      stroke-width: 2px;
    }

    svg.plus-mark {
      color: ${({ theme }) => theme.colors.primary};
      stroke-width: 3px;
    }
  }
`;

PlusButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
  large: PropTypes.bool,
};

export default PlusButton;
