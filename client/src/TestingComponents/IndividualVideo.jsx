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
  const gridWidth = size === 1 ? 12 : size === 2 ? 6 : size === 3 ? 4 : size === 4 ? 6 : null;
  const gridHeight = size >= 3 ? 1 : 2;
  //   console.log();
  return (
    <Grid item xs={gridWidth} style={{ height: (44 * gridHeight).toString() + "vh" }}>
      <Box px={size === 4 ? 11 : 0}>
        <video
          muted={videoStream.userId === myId || speakerToggle}
          key={videoStream.userId}
          playsInline
          autoPlay
          style={
            (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
              ? { width: (8 * gridWidth).toString() + "vw", height: (38 * gridHeight).toString() + "vh", display: "block" }
              : { display: "none" }
          }
          ref={(videoRef) => {
            if (videoRef) videoRef.srcObject = videoStream.stream;
            return videoRef;
          }}
        />
        {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
          <Paper className={classes.videoAltImg} style={{ height: (38 * gridHeight).toString() + "vh" }}>
            <Box textAlign="center" py={10 * gridHeight}>
              <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "70px", width: "70px" }} alt={videoStream.userName} />{" "}
            </Box>
          </Paper>
        )}
        {!videoStream.audio && videoStream.userId !== myId && <p>muted</p>}
        {!videoStream.video && videoStream.userId !== myId && <p>camOff</p>}
      </Box>
    </Grid>
  );
}
