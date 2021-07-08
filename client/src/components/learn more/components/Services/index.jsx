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
          <ServicesIcon src="https://user-images.githubusercontent.com/70366079/125001936-6b3cb900-e071-11eb-86d7-fcdc60d41273.png" />
          <ServicesH2>Choose One</ServicesH2>
          <ServicesP>About 20 cool masks to choose from.If you want you may change later on. </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <ServicesIcon src="https://user-images.githubusercontent.com/70366079/124368419-92187b00-dc7e-11eb-909e-1bdf232e3cee.png" />
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
