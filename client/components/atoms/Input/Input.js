import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = ({ label, type, helpText, ...inputProps }) => {
  const renderInputNode = () => {
    const inputID = label.toLowerCase();

    return (
      <InputWrapper>
        <StyledLabel htmlFor={inputID}>{label}</StyledLabel>

        <StyledInput
          id={inputID}
          type={type}
          name={inputID}
          placeholder={inputProps.placeholder || label}
          {...inputProps}
        />

        {helpText && <HelpText>{helpText}</HelpText>}
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
  position: absolute;
  left: 14px;
  top: -6px;
  background: white;
  padding: 2px 6px;
  color: ${({ theme }) => theme.colors.medium('onSurface')};
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.sizes.spacingInput};
  border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  font-size: 1.3rem;
  -webkit-appearance: none;
`;

const HelpText = styled.div`
  font-style: italic;
  font-size: 1rem;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.disabled('onSurface')};
`;

Input.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.oneOf(['email', 'money', 'number', 'password', 'phone', 'text', 'zip', 'date']),
  helpText: PropTypes.string,
};

Input.defaultProps = {
  required: false,
  type: 'text',
};

export default Input;
