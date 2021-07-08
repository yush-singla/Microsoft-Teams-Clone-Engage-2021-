import React from "react";
import Icon1 from "../../images/svg-1.svg";
import Icon2 from "../../images/svg-2.svg";
import Icon3 from "../../images/svg-3.svg";
import { ServicesContainer, ServicesH1, ServicesWrapper, ServicesCard, ServicesIcon, ServicesH2, ServicesP } from "./ServiceElements";

const Services = () => {
  return (
    <ServicesContainer id="services">
      <ServicesH1>Face Masks</ServicesH1>
      <ServicesWrapper>
        <ServicesCard>
          <ServicesIcon src={Icon1} />
          <ServicesH2>Choose One</ServicesH2>
          <ServicesP>About 20 cool masks to choose from.If you want you may change later on. </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <ServicesIcon src={Icon2} />
          <ServicesH2>Get Masked</ServicesH2>
          <ServicesP>The mask instantly gets on your face in your video. Don't miss their reaction!</ServicesP>
        </ServicesCard>
        <ServicesCard>
          <ServicesIcon src={Icon3} />
          <ServicesH2>Try Them All</ServicesH2>
          <ServicesP>You can easily change the mask or stop with just a click. Have Fun!</ServicesP>
        </ServicesCard>
      </ServicesWrapper>
    </ServicesContainer>
  );
};

export default Services;
