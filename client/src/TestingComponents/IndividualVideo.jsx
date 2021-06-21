import React from "react";
import { Paper, Box, makeStyles, Grid } from "@material-ui/core";
import { grid, height } from "@material-ui/system";

const useStyles = makeStyles({
  videoAltImg: {
    backgroundColor: "black",
  },
});

export default function IndividualVideo({ myId, speakerToggle, videoStream, video, audio, size }) {
  const classes = useStyles();
  const gridWidth = size <= 1 ? 12 : 6;
  const gridHeight = size >= 3 ? 1 : 2;
  //   console.log();
  return (
    <Grid item xs={gridWidth} style={{ height: (40 * gridHeight).toString() + "vh" }}>
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay
        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: (8 * gridWidth).toString() + "vw", height: (40 * gridHeight).toString() + "vh", display: "block" }
            : { display: "none" }
        }
        ref={(videoRef) => {
          if (videoRef) videoRef.srcObject = videoStream.stream;
          return videoRef;
        }}
      />
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <Paper className={classes.videoAltImg} style={{ height: (40 * gridHeight).toString() + "vh" }}>
          <Box textAlign="center" py={13 * gridHeight} height="inherit">
            <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "70px", width: "70px" }} alt={videoStream.userName} />{" "}
          </Box>
        </Paper>
      )}
      {!videoStream.audio && videoStream.userId !== myId && <p>muted</p>}
      {!videoStream.video && videoStream.userId !== myId && <p>camOff</p>}
    </Grid>
  );
}
