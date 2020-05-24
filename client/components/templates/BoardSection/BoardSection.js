import React from 'react';
import styled from 'styled-components';

import BoardList from '_organisms/BoardList';

function BoardSection() {
  return (
    <StyledBoardList>
      <BoardList />
    </StyledBoardList>
  );
}

const StyledBoardList = styled.div`
  padding: 20px;
`;

export default BoardSection;
