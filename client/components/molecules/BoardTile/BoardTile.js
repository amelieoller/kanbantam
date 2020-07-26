import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function BoardTile({ board }) {
  return (
    <StyledBoardTile key={board.id} to={`/boards/${board.id}`}>
      {board.title}
    </StyledBoardTile>
  );
}

const StyledBoardTile = styled(Link)`
  background: ${({ theme }) => theme.colors.surface};
  cursor: grab;
  font-size: 15px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.one};
  padding: ${({ theme }) => theme.sizes.spacing};
  color: ${({ theme }) => theme.colors.onSurface};

  &.dragging-helper-class {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.three};
  }
`;

BoardTile.propTypes = {
  board: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardTile;
