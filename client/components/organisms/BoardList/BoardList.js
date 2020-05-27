import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import BoardTile from '_molecules/BoardTile';
import AddBoardTile from '_molecules/AddBoardTile';

const StyledBoardList = styled.div`
  display: grid;
  grid-auto-rows: 140px;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, 270px);

  & > * {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.one};
    color: ${({ theme }) => theme.colors.onSurface};
    font-size: 15px;
    font-weight: 500;
    padding: ${({ theme }) => theme.sizes.spacing};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
      box-shadow: ${({ theme }) => theme.shadows.two};
    }
  }
`;

function BoardList() {
  const { boards } = useSelector(R.pick(['boards']));

  return (
    <StyledBoardList>
      {R.reverse(boards).map((board) => (
        <BoardTile key={board.id} board={board} />
      ))}

      <AddBoardTile />
    </StyledBoardList>
  );
}

export default BoardList;
