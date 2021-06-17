import React from "react";
import { Carousel } from "react-responsive-carousel";
import { Typography } from "@material-ui/core";
// import { ArrowLeft, ArrowRight } from "@material-ui/icons";
// import { IconButton } from "@material-ui/core";

export default function CarouselComponent() {
  const imgStyles = {
    borderRadius: "100%",
    width: "54%",
  };
  const divStyle = {
    padding: "10px",
  };
  return (
    <Carousel
      emulateTouch={true}
      transitionTime={700}
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
        <img style={imgStyles} src="https://picsum.photos/560/370" alt="yes" />
        <Typography variant="h4">Incididunt ut sit quis laborum </Typography>
        <Typography>
          Nulla adipisicing eu culpa sint incididunt tempor minim veniam sunt. Duis amet laboris occaecat aliquip aliquip. Ut sunt occaecat ipsum pariatur enim minim dolore pariatur magna incididunt.
        </Typography>
      </div>
      <div style={divStyle}>
        <img style={imgStyles} src="https://picsum.photos/560/370" alt="yes" />
        <Typography variant="h4">Non aute ipsum adipisicing ut </Typography>
        <Typography>
          Minim qui quis commodo pariatur commodo qui sit ex cupidatat tempor pariatur esse. Incididunt tempor pariatur fugiat ullamco nulla sunt adipisicing aute tempor deserunt Lorem sunt. Dolore do
          non ad et ea eiusmod ut elit exercitation et ex cillum. Sint eu eiusmod qui sint consequat ad ad labore consectetur labore esse. Elit sint consequat nisi fugiat minim irure laboris dolor
        </Typography>
      </div>
      <div style={divStyle}>
        <img style={imgStyles} src="https://picsum.photos/560/370" alt="yes" />
        <Typography variant="h4">Non aute ipsum adipisicing ut</Typography>
        <Typography>
          Consequat culpa tempor cupidatat aliqua culpa dolor do labore officia irure id et nulla irure. Ipsum Lorem id aliqua pariatur laboris officia labore commodo dolore nostrud deserunt. Non
          officia magna fugiat sit cupidatat quis nisi id dolore labore. Nisi velit nulla non consequat reprehenderit non dolore veniam anim sunt culpa incididunt esse ipsum. Reprehenderit mollit
        </Typography>
      </div>
    </Carousel>
  );
}
