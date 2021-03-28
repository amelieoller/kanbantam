import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconButton = ({ onClick, label, children, large, altText }) => {
  const size = large ? 17.5 : 14;
  const stroke = 2;

  return (
    <Wrapper>
      <StyledIconButton
        onClick={onClick}
        size={size}
        stroke={stroke}
        label={altText}
        aria-label={altText}
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

        <span className="icon">{children}</span>
      </StyledIconButton>

      {label && <Label>{label}</Label>}
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
  color: rgba(77, 77, 77, 0.92);
  font-size: 11px;
  margin-top: 3px;
  text-align: center;
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const StyledIconButton = styled.div`
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

  .icon > * {
    width: ${({ size, stroke }) => `${size + stroke}px`};
    height: ${({ size, stroke }) => `${size + stroke}px`};
    position: absolute;
    left: 22%;
    top: 23%;
    color: #ccccd3;
    transition: all 0.8s ease;
    stroke-width: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  &:hover {
    svg.plus-circle circle {
      stroke-dasharray: 18 0;
      stroke: ${({ theme }) => theme.colors.primary};
      stroke-width: 2px;
    }

    .icon > * {
      color: ${({ theme }) => theme.colors.primary};
      stroke-width: 3px;
    }
  }
`;

IconButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  children: PropTypes.node,
  large: PropTypes.bool,
  altText: PropTypes.string,
};

export default IconButton;
