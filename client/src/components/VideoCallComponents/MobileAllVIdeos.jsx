import React from "react";
import MobileIndividualVideo from "./MobileIndividualVideo";
import Box from "@material-ui/core/Box";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { Grid, makeStyles } from "@material-ui/core";
//these are heights for video components to be used for different no of people to keep the ui
//beautiful all the time
const useStyles = makeStyles({
  videoContainer: {
    display: "flex",
    width: "auto",
    height: "85vh",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  videoContainerChild: {
    flex: "1 0 auto",
  },
  videoContainerGrandChild: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoContainerForFour: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});
const usableHeights = ["90%", "75%", "60%", "45%"];
export default function MobileAllVideos({ startInterval, stopInterval, startMaskSticker, videos, myId, speakerToggle, video, audio }) {
  const classes = useStyles();
  return (
    <Grid container spacing={5}>
      {videos.map((videoStream, key) => {
        return (
          <Grid item xs={(videos.length === 3 && key === 2) || videos.length <= 2 ? 12 : 6}>
            <MobileIndividualVideo
              startMaskSticker={startMaskSticker}
              size={videos.length}
              key={videoStream.userId}
              videoStream={videoStream}
              myId={myId}
              classes={classes}
              speakerToggle={speakerToggle}
              video={video}
              audio={audio}
              startInterval={videoStream.userId === myId && startInterval}
              stopInterval={videoStream.userId === myId && stopInterval}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
