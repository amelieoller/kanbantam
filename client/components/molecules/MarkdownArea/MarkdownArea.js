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
  min-height: 14px;

  img {
    width: 100%;
  }

  em {
    font-style: italic;
  }

  hr {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
    overflow: visible;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.lighter(7, 'onSurface')};
  }

  /* Code */
  code {
    background: ${({ theme }) => theme.colors.lighter(85, 'onSurface')};
    border-radius: 3px;
    padding: 0.1em 0.3em;
    font-size: 90%;
  }

  pre {
    font-family: monospace, monospace;
    font-size: 1em;
    padding: 3px;
    background: ${({ theme }) => theme.colors.lighter(85, 'onSurface')};
    border-radius: 3px;
    margin: 3px 0;

    code {
      padding: 0;
    }
  }

  /* Lists */
  ol,
  ul {
    li {
      input[type='checkbox'] {
        margin-right: 3px;
      }

      &::before {
        color: ${({ theme }) => theme.colors.disabled('onSurface')};
        display: inline-block;
      }
    }
  }

  ol {
    list-style: none;
    counter-reset: li;

    li {
      counter-increment: li;

      &::before {
        content: counter(li);
        width: 0.8em;
      }
    }
  }

  ul li::before {
    content: '•';
    width: 0.7em;
  }

  /* Headers */
  h1 {
    font-size: 1.85em;
    margin: 0.27em 0;
  }

  h2 {
    font-size: 1.5em;
    margin: 0.43em 0;
  }

  h3 {
    font-size: 1.3em;
    margin: 0.6em 0;
  }

  h4 {
    font-size: 1em;
    margin: 0.93em 0;
  }

  h5 {
    font-size: 0.83em;
    margin: 1.17em 0;
  }

  h6 {
    font-size: 0.67em;
    margin: 0.93em 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    :first-child {
      margin-top: 0;
    }
  }

  /* Tables */
  table {
    width: 100%;

    th {
      border-bottom: 1px solid ${({ theme }) => theme.colors.lighter(65, 'onSurface')};
      border-right: 1px solid ${({ theme }) => theme.colors.lighter(65, 'onSurface')};
      font-size: 1.15em;
      padding: 7px 5px;
      text-align: left;
      vertical-align: middle;

      :first-child {
        border-top-left-radius: 3px;
      }

      :last-child {
        border-top-right-radius: 3px;
        border-right: none;
      }
    }

    tr {
      border-top: 1px solid ${({ theme }) => theme.colors.lighter(75, 'onSurface')};
      border-bottom: 1px solid ${({ theme }) => theme.colors.lighter(75, 'onSurface')};

      :hover td {
        background: ${({ theme }) => theme.colors.lighter(6, 'onSurface')};
        color: #ffffff;
      }

      :first-child {
        border-top: none;
      }

      :last-child {
        border-bottom: none;
      }

      :nth-child(odd) td {
        background: ${({ theme }) => theme.colors.lighter(85, 'onSurface')};
      }

      :nth-child(odd):hover td {
        background: ${({ theme }) => theme.colors.lighter(6, 'onSurface')};
      }
    }

    tr:last-child td:first-child {
      border-bottom-left-radius: 3px;
    }

    tr:last-child td:last-child {
      border-bottom-right-radius: 3px;
    }

    td {
      padding: 5px;
      text-align: left;
      vertical-align: middle;
      border-right: 1px solid ${({ theme }) => theme.colors.lighter(75, 'onSurface')};

      :last-child {
        border-right: 0px;
      }
    }
  }
`;

MarkdownArea.propTypes = {
  text: PropTypes.string.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  handleUpdateText: PropTypes.func.isRequired,
};

MarkdownArea.defaultProps = {};

export default MarkdownArea;
