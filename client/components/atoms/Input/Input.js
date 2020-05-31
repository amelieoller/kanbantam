import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = ({
  label,
  placeholder = label,
  required,
  type,
  handleOnBlur,
  defaultValue,
  helpText,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const renderRequiredLabel = () => <span className="input-required">*</span>;

  const handleInputChange = (e) => setInputValue(e.target.value);

  const renderInputNode = () => {
    const inputID = label.toLowerCase();

    return (
      <InputWrapper>
        <StyledLabel htmlFor={inputID}>
          {label} {required ? renderRequiredLabel() : null}
        </StyledLabel>

        <StyledInput
          id={inputID}
          type={type}
          name={inputID}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={(e) => handleOnBlur(e.target.value)}
          required={required}
          value={inputValue}
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
  border: 1px solid #dadada;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  font-size: 1.3rem;
`;

const HelpText = styled.div`
  font-style: italic;
  font-size: 1rem;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.disabled('onSurface')};
`;

Input.propTypes = {
  handleOnBlur: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.oneOf([
    'email',
    'money',
    'number',
    'password',
    'phone',
    'text',
    'zip',
    'date',
  ]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.string,
};

Input.defaultProps = {
  defaultValue: '',
  required: false,
  type: 'text',
};

export default Input;
