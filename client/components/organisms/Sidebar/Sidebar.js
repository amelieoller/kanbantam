import React from 'react';
import styled from 'styled-components';

import ChevronLeft from '_assets/icons/chevrons-left.svg';
import ChevronRight from '_assets/icons/chevrons-right.svg';
import Repeat from '_assets/icons/repeat.svg';
import Clock from '_assets/icons/clock.svg';
import Calendar from '_assets/icons/calendar.svg';

function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <SidebarWrapper
      isSidebarOpen={isSidebarOpen}
      onClick={() => !isSidebarOpen && toggleSidebar()}
    >
      <CollapseButton onClick={() => isSidebarOpen && toggleSidebar()}>
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </CollapseButton>
      <SidebarContent>
        <Clock />
        <Calendar />
        <Repeat />
      </SidebarContent>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.sizes.spacing};
  width: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  position: relative;
  transition: 1s ease;
  height: 100%;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: fixed;
  left: 0;
  z-index: 1;
`;

const SidebarContent = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  overflow: hidden;

  svg {
    color: ${({ theme }) => theme.colors.medium('onSecondary')};
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  left: 100%;
  top: 2rem;
  transform: translateX(-50%);
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.one};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.two};
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

export default Sidebar;
