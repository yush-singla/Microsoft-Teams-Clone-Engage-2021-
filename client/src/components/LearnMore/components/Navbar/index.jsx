import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavLinks, NavItem, NavBtn, NavBtnLink } from "./NavbarElements";
import { animateScroll as scroll } from "react-scroll";

const Navbar = ({ toggle }) => {
  const [scrollNav, setScrollNav] = useState(false);
  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav scrollNav={scrollNav}>
          <NavbarContainer>
            <NavLogo to="/" onClick={toggleHome}>
              Home
            </NavLogo>
            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>
            <NavMenu>
              <NavItem>
                <NavLinks to="about" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Video Meetings
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="discover" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Chats
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="services" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Face Masks
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="signup" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Authentication
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="screen" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Screen Share
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="wait" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
                  Waiting Rooms
                </NavLinks>
              </NavItem>
            </NavMenu>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
