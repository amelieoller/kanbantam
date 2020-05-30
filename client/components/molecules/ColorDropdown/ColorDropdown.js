import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TwitterPicker } from 'react-color';

import Droplet from '_assets/icons/droplet.svg';

const ColorDropdown = ({ onChange, currentColor }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleChangeComplete = (color) => {
    const hexColor = color.hex;
    setIsColorPickerOpen(false);

    if (currentColor !== hexColor) {
      onChange(hexColor);
    }
  };

  return (
    <>
      <ColorSwatch
        color={currentColor}
        onClick={() => setIsColorPickerOpen((prevState) => !prevState)}
      >
        <Droplet />
      </ColorSwatch>

      {isColorPickerOpen && (
        <TwitterPicker
          colors={[
            '#FF6900',
            '#FCB900',
            '#7BDCB5',
            '#00D084',
            '#8ED1FC',
            '#0693E3',
            '#ABB8C3',
            '#EB144C',
            '#F78DA7',
            '#9900EF',
          ]}
          onChangeComplete={handleChangeComplete}
          width="auto"
          triangle="top-right"
        />
      )}
    </>
  );
};

const ColorSwatch = styled.button`
  background: ${({ color }) => color};
  border: none;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  margin-left: ${({ theme }) => theme.sizes.spacingSmall};
  display: flex;
  align-items: center;

  svg {
    color: white;
  }
`;

ColorDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentColor: PropTypes.string,
};

ColorDropdown.defaultProps = {
  currentColor: '#FF6900',
};

export default ColorDropdown;
