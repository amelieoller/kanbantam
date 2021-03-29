import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptUpdateBoard } from '_actions/boards';
import ChevronLeftIcon from '_assets/icons/chevrons-left.svg';
import ChevronRightIcon from '_assets/icons/chevrons-right.svg';

function SidebarWrapper({ isSidebarOpen, boardId, children }) {
  const dispatch = useDispatch();

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: boardId, ...attribute }));
  };

  const handleToggleClick = () => {
    handleUpdateBoard({ sidebarOpen: !isSidebarOpen });
  };

  return (
    <Wrapper isSidebarOpen={isSidebarOpen}>
      <CollapseButton onClick={() => handleToggleClick()} aria-label="Expand sidebar">
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </CollapseButton>
      <SidebarContent>{children}</SidebarContent>
    </Wrapper>
  );
}

const Wrapper = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
  box-shadow: 3px 0px 8px 0px rgba(155, 170, 178, 0.1);
  color: ${({ theme }) => theme.colors.onSurface};
  width: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 0.4s ease;
  overflow-y: scroll;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: fixed;
  left: 0;
  z-index: 1;
`;

const SidebarContent = styled.div`
  & > * {
    border-bottom: 1px solid #eaebf3;
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 50%;
  top: calc(85vh - 40px);
  transform: translateX(-50%);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding: 0;
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  z-index: 1;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.darker(1, 'surface')};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

SidebarWrapper.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  boardId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SidebarWrapper;
