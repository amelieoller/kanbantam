import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TwitterPicker } from 'react-color';

import useOnClickOutside from '_hooks/useOnClickOutside';
import DropletIcon from '_assets/icons/droplet.svg';

const ColorDropdown = ({ onChange, currentColor }) => {
  const colorRef = useRef();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useOnClickOutside(colorRef, () => setIsColorPickerOpen(false));

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
        label="Select color"
        aria-label="Select color"
      >
        <DropletIcon />
      </ColorSwatch>

      {isColorPickerOpen && (
        <ColorWrapper ref={colorRef}>
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
          />
        </ColorWrapper>
      )}
    </>
  );
};

const ColorWrapper = styled.span`
  position: absolute !important;
  top: 45px;
  z-index: 1;
`;

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
