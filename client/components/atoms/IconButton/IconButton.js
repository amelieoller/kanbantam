import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledIconButton = styled.button`
  flex: 0 0 auto;
  color: ${(props) => props.theme.colors[props.color] || props.color};
  padding: 8px;
  overflow: visible;
  font-size: ${(props) => `${props.fontSize}rem`};
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: ${(props) => (props.round ? '50%' : props.theme.sizes.borderRadius)};
  border: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;
  background-color: ${(props) =>
    props.theme.colors[props.background] || props.background};
  min-width: 25px;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.18);
  }

  @media ${(props) => props.theme.media.tablet} {
    /* font-size: ${(props) => `${props.fontSize * 1.2}rem`}; */
    padding: 12px;
  }
`;

const IconButton = (props) => {
  const { children, onClick, onKeyDown } = props;

  return (
    <StyledIconButton
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </StyledIconButton>
  );
};

IconButton.defaultProps = {
  fontSize: 1,
  color: 'inherit',
  className: '',
  round: false,
  background: 'transparent',
};

IconButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  onClick: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  round: PropTypes.bool,
  background: PropTypes.string,
  onKeyDown: PropTypes.func,
};

export default IconButton;
