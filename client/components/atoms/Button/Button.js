import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Button = ({ children, label, ...buttonProps }) => {
  return (
    <StyledButton type="button" aria-label={label} label={label} {...buttonProps} role="button">
      {children}
    </StyledButton>
  );
};

const withOnText = (string) => `on${string.charAt(0).toUpperCase() + string.slice(1)}`;

const propsCSS = {
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.onSurface};
    border: 2px solid
      ${({ theme, buttonType }) => (buttonType ? theme.colors[buttonType] : theme.colors.primary)};

    &:hover {
      background-color: ${({ theme, buttonType }) =>
        buttonType ? theme.colors[buttonType] : theme.colors.primary};
      color: ${({ theme, buttonType }) =>
        buttonType ? theme.colors[withOnText(buttonType)] : theme.colors.onSecondary};
    }
  `,

  small: css`
    font-size: 1.1rem;
    padding: 4px 9px;

    svg {
      height: 15px;
    }
  `,

  large: css`
    font-size: 1.5rem;
    padding: 8px 13px;

    svg {
      height: 20px;
    }
  `,

  buttonType: css`
    background: ${({ theme, buttonType }) => theme.colors[buttonType]};
    color: ${({ theme, buttonType }) => theme.colors[withOnText(buttonType)]};

    &:hover {
      background: ${({ theme, buttonType }) => theme.colors.darker(1, buttonType)};
    }
  `,

  noBackground: css`
    background: transparent;
    border: transparent;
    padding: 0;

    &:hover {
      background: transparent;
      border: transparent;
    }
  `,

  textColor: css`
    color: ${({ theme, textColor }) => theme.colors[textColor]};
  `,

  disabled: css`
    background: ${({ theme }) => theme.colors.medium('onSurface')};
    border: ${({ theme }) => theme.colors.medium('onSurface')};
    cursor: auto;

    &:hover {
      background: ${({ theme }) => theme.colors.medium('onSurface')};
      border: ${({ theme }) => theme.colors.medium('onSurface')};
    }
  `,
};

const StyledButton = styled.button`
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  padding: ${({ theme }) => theme.sizes.spacingInput};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: ${({ theme, color }) => (color ? color : theme.colors.onSecondary)};
  cursor: pointer;
  font-size: 1.3rem;
  border: 2px solid
    ${({ theme, buttonType }) => (buttonType ? theme.colors[buttonType] : theme.colors.primary)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.colors.darker(1, 'primary')};
    color: ${({ hoverColor }) => hoverColor && hoverColor};
    border: 2px solid
      ${({ theme, buttonType }) =>
        buttonType ? theme.colors.darker(1, buttonType) : theme.colors.darker(1, 'primary')};
  }

  svg {
    height: 17px;
  }

  & > *:not(:first-child) {
    margin-top: 3px;
  }
  ${(props) => props.buttonType && propsCSS.buttonType};
  ${(props) => props.size === 'small' && propsCSS.small};
  ${(props) => props.size === 'large' && propsCSS.large};
  ${(props) => props.outline && propsCSS.outline};
  ${(props) => props.noBackground && propsCSS.noBackground};
  ${(props) => props.textColor && propsCSS.textColor};
  ${(props) => props.disabled && propsCSS.disabled};
`;

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  buttonType: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  size: PropTypes.oneOf(['small', 'normal', 'large']),
  outline: PropTypes.bool,
  label: PropTypes.string.isRequired,
  noBackground: PropTypes.bool,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  type: 'info',
  size: 'normal',
  outline: false,
  noBackground: false,
  textColor: '',
  disabled: false,
};

export default Button;
