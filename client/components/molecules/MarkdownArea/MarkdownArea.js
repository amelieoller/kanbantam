import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const MarkdownArea = ({ text, handleCardClick, handleUpdateText }) => {
  const toggleCheckbox = (checked, i) => {
    let j = 0;

    const newText = text.replace(/\[(\s|x)\]/g, (match) => {
      let newString;
      if (i === j) {
        newString = checked ? '[x]' : '[ ]';
      } else {
        newString = match;
      }
      j += 1;
      return newString;
    });

    handleUpdateText(newText);
  };

  const handleClick = (e) => {
    const { tagName, checked, type, dataset, parentElement } = e.target;

    const elAttribute = dataset.type;
    const elAttributeParent = parentElement.dataset.type;

    var aElements = e.target.parentNode.parentNode.children;
    var aElementsLength = aElements.length;

    var index;

    for (var i = 0; i < aElementsLength; i++) {
      if (aElements[i] == parentElement) {
        //this condition is never true
        index = i;
      }
    }

    if (tagName.toLowerCase() === 'input' && type.toLowerCase() === 'checkbox') {
      // The id is a string that describes which number in the order of checkboxes this particular checkbox has
      toggleCheckbox(checked, parseInt(index, 10));
    }

    if (elAttribute === 'isClickable' || elAttributeParent === 'isClickable') return;
    if (tagName === 'A' || tagName === 'INPUT') return;

    handleCardClick();
  };

  return (
    <Main onClick={handleClick}>
      <ReactMarkdown source={text} />
    </Main>
  );
};

const Main = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.onSurface};

  img {
    width: 100%;
  }

  em {
    font-style: italic;
  }

  ol {
    list-style: none;
    counter-reset: li;

    li {
      counter-increment: li;

      &::before {
        content: counter(li);
        color: ${({ theme }) => theme.colors.disabled('onSurface')};
        display: inline-block;
        width: 0.8em;
      }
    }
  }

  ul li::before {
    content: '•';
    color: ${({ theme }) => theme.colors.disabled('onSurface')};
    display: inline-block;
    width: 0.7em;
  }
`;

MarkdownArea.propTypes = {
  text: PropTypes.string.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  handleUpdateText: PropTypes.func.isRequired,
};

MarkdownArea.defaultProps = {};

export default MarkdownArea;
