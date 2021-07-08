import React, { useState } from "react";
import Hero from "../components/Hero";
import Info from "../components/Info";
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour, homeObjFive } from "../components/Info/Data";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Sidebar from "../components/SideBar";

const HomeL = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <Hero />
      <Info {...homeObjOne} />
      <Info {...homeObjTwo} />
      <Services />
      <Info {...homeObjThree} />
      <Info {...homeObjFour} />
      <Info {...homeObjFive} />
    </>
  );
};

export default HomeL;
