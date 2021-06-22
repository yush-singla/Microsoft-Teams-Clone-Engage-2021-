import React from "react";
import { Paper, Box, makeStyles, Grid } from "@material-ui/core";
import { grid, height, width } from "@material-ui/system";

const useStyles = makeStyles({
  videoAltImg: {
    backgroundColor: "black",
  },
});

const useAbleMaxWidths = ["85vw", "47vw", "30vw"];

export default function IndividualVideo({ key, myId, speakerToggle, videoStream, video, audio, size }) {
  const classes = useStyles();
  const currMaxWidth = size === 1 ? useAbleMaxWidths[0] : size === 2 || size === 4 ? useAbleMaxWidths[1] : useAbleMaxWidths[2];
  return (
    <>
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay
        style={(videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video) ? { objectFit: "fill", maxWidth: currMaxWidth, maxHeight: "100%" } : { display: "none" }}
        ref={(videoRef) => {
          if (videoRef) videoRef.srcObject = videoStream.stream;
          return videoRef;
        }}
      />
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }} alt={videoStream.userName} />
      )}
      {/* {!videoStream.audio && videoStream.userId !== myId && <p>muted</p>}
        {!videoStream.video && videoStream.userId !== myId && <p>camOff</p>} */}
    </>
  );
}
