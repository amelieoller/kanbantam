import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '_atoms/Button';

const UpdateTextButton = ({ text, handleUpdate }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    setNewText(text);
  }, [text]);

  const handleSubmit = () => {
    setIsEditOpen(false);

    if (text !== newText) {
      handleUpdate(newText);
    }
  };

  return isEditOpen ? (
    <Input
      type="text"
      autoFocus
      value={newText}
      onChange={(e) => {
        setNewText(e.target.value);
      }}
      onBlur={handleSubmit}
      onKeyDown={(e) => e.keyCode === 13 && handleSubmit()}
    />
  ) : (
    <Button
      onClick={() => setIsEditOpen(true)}
      label="Open update text input"
      className="hide-on-mobile"
      noBackground
    >
      {newText}
    </Button>
  );
};

const Input = styled.input`
  background: no-repeat;
  border: none;
  color: inherit;
  font-size: inherit;
  padding: inherit;
  outline: none;
`;

UpdateTextButton.propTypes = {
  text: PropTypes.string.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default UpdateTextButton;
