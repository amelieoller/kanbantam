import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Dropdown = ({ children, label, required, handleOnBlur, defaultValue, helpText }) => {
  const renderRequiredLabel = () => <span className="input-required">*</span>;

  const renderInputNode = () => {
    const inputID = label.toLowerCase();

    return (
      <InputWrapper>
        <StyledLabel htmlFor={inputID}>
          {label} {required ? renderRequiredLabel() : null}
        </StyledLabel>

        <StyledSelect
          className="browser-default"
          name={name}
          onChange={handleOnBlur}
          value={defaultValue}
          label={label}
          aria-label={label}
        >
          {children}
        </StyledSelect>

        {helpText && <div className="help-text">{helpText}</div>}
      </InputWrapper>
    );
  };

  return <>{label ? renderInputNode() : null}</>;
};

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 0.85rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.medium('onSurface')};
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.spacingInput};
  border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  font-size: 1.3rem;
  margin-top: 3px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%),
    linear-gradient(
      to right,
      ${({ theme }) => theme.colors.surfaceVariant},
      ${({ theme }) => theme.colors.surfaceVariant}
    );
  background-position: calc(100% - 15px) calc(0.7em + 2px), calc(100% - 10px) calc(0.7em + 2px),
    calc(100% - 2em) 0.2em;
  background-size: 5px 5px, 5px 5px, 1px 1.5em;
  background-repeat: no-repeat;
`;

Dropdown.propTypes = {
  children: PropTypes.node,
  handleOnBlur: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  helpText: PropTypes.string,
};

Dropdown.defaultProps = {
  defaultValue: '',
  required: false,
};

export default Dropdown;
