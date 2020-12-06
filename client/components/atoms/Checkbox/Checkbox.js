import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CheckSquareIcon from '_assets/icons/check-square.svg';
import SquareIcon from '_assets/icons/square.svg';

const Checkbox = ({ label, onChange, checked, helpText }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleCheck = () => {
    onChange();
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  return (
    <>
      <StyledCheckbox
        onClick={handleCheck}
        onKeyDown={(e) => e.keyCode === 13 && handleCheck()}
        tabIndex={0}
        isChecked={isChecked}
      >
        {isChecked ? <CheckSquareIcon /> : <SquareIcon />}

        <label htmlFor="checkbox">{label}</label>
      </StyledCheckbox>

      {helpText && <div className="help-text">{helpText}</div>}
    </>
  );
};

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.medium('onSurface')};

  svg {
    color: ${({ theme, isChecked }) => isChecked && theme.colors.secondary};
    margin-right: 6px;
  }

  &:hover svg {
    color: ${({ theme, isChecked }) =>
      isChecked ? theme.colors.darker(1, 'secondary') : theme.colors.secondary};
  }

  label {
    cursor: pointer;
  }
`;

Checkbox.defaultProps = {
  checked: false,
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  helpText: PropTypes.string,
};

export default Checkbox;
