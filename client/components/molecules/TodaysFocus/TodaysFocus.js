import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import CodeMirrorArea from '_atoms/CodeMirrorArea';
import useOnClickOutside from '_hooks/useOnClickOutside';
import MarkdownArea from '_molecules/MarkdownArea';

const TodaysFocus = () => {
  const formRef = useRef();

  const [text, setText] = useState('');
  const [edit, setEdit] = useState(false);

  useOnClickOutside(formRef, () => setEdit(false));

  useEffect(() => {
    const retrievedText = localStorage.getItem('focusText');
    if (retrievedText) setText(retrievedText);
  }, []);

  const changeText = (value) => {
    setText(value);
    localStorage.setItem('focusText', value);
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
        <MarkdownArea
          text={text}
          handleCardClick={() => setEdit(true)}
          handleUpdateText={changeText}
        />
      )}
    </TodaysFocusWrapper>
  );
};

const TodaysFocusWrapper = styled.div`
  padding: 20px 0;
`;

TodaysFocus.propTypes = {};

TodaysFocus.defaultProps = {};

export default TodaysFocus;
