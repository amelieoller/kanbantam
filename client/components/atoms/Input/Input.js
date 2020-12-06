import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = ({ label, type, helpText, noLabel, ...inputProps }) => {
  const renderInputNode = () => {
    const inputID = label.toLowerCase();

    return (
      <InputWrapper>
        {!noLabel && <StyledLabel htmlFor={inputID}>{label}</StyledLabel>}

        <StyledInput
          id={inputID}
          type={type}
          name={inputID}
          noLabel={noLabel}
          placeholder={inputProps.placeholder || label}
          {...inputProps}
        />

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

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.spacingInput};
  border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  font-size: 1.3rem;
  -webkit-appearance: none;
  margin-top: ${({ noLabel }) => !noLabel && '3px'};
`;

Input.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.oneOf(['email', 'money', 'number', 'password', 'phone', 'text', 'zip', 'date']),
  helpText: PropTypes.string,
  noLabel: PropTypes.bool,
};

Input.defaultProps = {
  required: false,
  type: 'text',
  noLabel: false,
};

export default Input;
