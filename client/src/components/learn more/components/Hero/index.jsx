import React, { useState } from "react";
import Video from "../../videos/video.mp4";
import { HeroContainer, HeroBg, VideoBg, HeroContent, HeroH1, HeroP, HeroBtnWrapper, ArrowForward, ArrowRight } from "./HeroElements";
import { Button } from "../ButtonElements";

const Hero = () => {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(!hover);
  };

  return (
    <HeroContainer id="home">
      <HeroBg>
        <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
      </HeroBg>
      <HeroContent>
        <HeroH1> Video Calling Made Easy</HeroH1>
        <HeroP>Create Teams, Invite people and Engage with them through chats and video calls.</HeroP>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
