import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledBoardTile = styled(Link)`
  background: white;
  width: 100%;
  height: 100%;
`;

function BoardTile({ board }) {
  return (
    <StyledBoardTile key={board.id} to={`/boards/${board.id}`}>
      {board.title}
    </StyledBoardTile>
  );
}

BoardTile.propTypes = {
  board: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardTile;
