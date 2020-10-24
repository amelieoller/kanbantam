import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import CodeMirrorArea from '_atoms/CodeMirrorArea';
import useOnClickOutside from '_hooks/useOnClickOutside';
import MarkdownArea from '_molecules/MarkdownArea';
import { attemptUpdateBoard } from '_actions/boards';

const TodaysFocus = ({ boardId, boardFocusToday }) => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [edit, setEdit] = useState(false);

  const saveText = (newText) => {
    dispatch(attemptUpdateBoard({ id: boardId, focusToday: newText }));
  };

  useOnClickOutside(formRef, () => {
    saveText(text);
    setEdit(false);
  });

  useEffect(() => {
    setText(boardFocusToday);
  }, [boardFocusToday]);

  const changeText = (value) => {
    setText(value);
    saveText(value);
  };

  const handleClick = (e) => {
    const { tagName, dataset, parentElement } = e.target;

    // If an item (with the id of 'isClickable') is clicked, don't open modal
    if (dataset.type === 'isClickable' || parentElement.dataset.type === 'isClickable') return;
    // If link is clicked don't open modal
    if (tagName === 'A' || tagName === 'INPUT') return;

    setEdit(true);
  };

  return (
    <TodaysFocusWrapper>
      {edit ? (
        <div ref={formRef} className="focus-wrapper">
          <CodeMirrorArea
            label="Text"
            handleOnChange={changeText}
            defaultValue={text}
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <div onClick={handleClick}>
          <MarkdownArea text={text} handleUpdateText={changeText} />
        </div>
      )}
    </TodaysFocusWrapper>
  );
};

const TodaysFocusWrapper = styled.div`
  padding: 20px 0;
`;

TodaysFocus.propTypes = {
  boardId: PropTypes.string.isRequired,
  boardFocusToday: PropTypes.string,
};

TodaysFocus.defaultProps = {};

export default TodaysFocus;
