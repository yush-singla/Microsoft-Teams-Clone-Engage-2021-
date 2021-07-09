import React from "react";
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SidebarRoute, SideBtnWrap } from "./SidebarElements";

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to="about" onClick={toggle}>
            Video Meetings
          </SidebarLink>
          <SidebarLink to="discover" onClick={toggle}>
            Chats
          </SidebarLink>
          <SidebarLink to="services" onClick={toggle}>
            Face Masks
          </SidebarLink>
          <SidebarLink to="signup" onClick={toggle}>
            Authentication
          </SidebarLink>
          <SidebarLink to="screen" onClick={toggle}>
            Screen Share
          </SidebarLink>
          <SidebarLink to="wait" onClick={toggle}>
            Waiting Rooms
          </SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
