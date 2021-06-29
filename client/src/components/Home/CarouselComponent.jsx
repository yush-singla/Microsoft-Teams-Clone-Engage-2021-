import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Typography } from "@material-ui/core";
// import { ArrowLeft, ArrowRight } from "@material-ui/icons";
// import { IconButton } from "@material-ui/core";
import img1 from "../assets/images/Business_PNG.png";
import img2 from "../assets/images/microsoft_teams.png";
import img3 from "../assets/images/Chat_PNG.png";

export default function CarouselComponent() {
  const divStyle = {
    padding: "10px",
  };
  return (
    <Carousel
      emulateTouch={true}
      interval={15000}
      swipeable={true}
      infiniteLoop={true}
      autoPlay
      showThumbs={false}
      // renderArrowPrev={(clickHandler, hasPrev, labelPrev) => {
      //   if (hasPrev) {
      //     return (
      //       <button onClick={clickHandler}>
      //         <img src="https://picsum.photos/10/10" />
      //       </button>
      //     );
      //   }
      // }}
      // renderArrowNext={(clickHandler, hasNext, labelNext) => {
      //   if (hasNext) {
      //     return (
      //       <button onClick={clickHandler}>
      //         <img src="https://picsum.photos/10/10" />
      //       </button>
      //     );
      //   }
      // }}
    >
      <div style={divStyle}>
        <img style={{ width: "43%" }} src={img1} alt="yes" />
        <Typography variant="h4">Incididunt ut sit quis laborum </Typography>
        <Typography>
          Nulla adipisicing eu culpa sint incididunt tempor minim veniam sunt. Duis amet laboris occaecat aliquip aliquip. Ut sunt occaecat ipsum pariatur enim minim dolore pariatur magna incididunt.
        </Typography>
      </div>
      <div style={divStyle}>
        <img style={{ width: "85%" }} src={img2} alt="yes" />
        <Typography variant="h4">Non aute ipsum adipisicing ut </Typography>
        <Typography>
          Minim qui quis commodo pariatur commodo qui sit ex cupidatat tempor pariatur esse. Incididunt tempor pariatur fugiat ullamco nulla sunt adipisicing aute tempor deserunt Lorem sunt. Dolore do
        </Typography>
      </div>
      <div style={divStyle}>
        <img style={{ width: "35%" }} src={img3} alt="yes" />
        <Typography variant="h4">Non aute ipsum adipisicing ut</Typography>
        <Typography>
          Consequat culpa tempor cupidatat aliqua culpa dolor do labore officia irure id et nulla irure. Ipsum Lorem id aliqua pariatur laboris officia labore commodo dolore nostrud deserunt. Non
        </Typography>
      </div>
    </Carousel>
  );
}
