import React from "react";
import IndividualVideo from "./IndividualVideo";
import Box from "@material-ui/core/Box";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { makeStyles } from "@material-ui/core";
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
const usableHeights = ["94%", "80%", "60%", "48%"];
export default function AllVideos({ startInterval, stopInterval, startMaskSticker, videos, myId, speakerToggle, video, audio }) {
  const classes = useStyles();
  if (videos.length === 0) return null;
  return (
    <Box className={classes.videoContainer}>
      {videos.map((videoStream, key) => {
        const currHeight = videos.length === 1 ? usableHeights[0] : videos.length === 2 ? usableHeights[1] : videos.length === 3 ? usableHeights[2] : usableHeights[3];
        return (
          <Box
            className={classes.videoContainerChild}
            key={videoStream.userId}
            style={{
              backgroundColor: "black",
              textAlign: "center",
              minWidth: videos.length === 4 ? "32%" : "30%",
              width: videos.length === 1 ? "75vw" : videos.length === 2 ? "45vw" : videos.length === 3 ? "30vw" : "30vw",
              margin: "0 1%",
              marginRight: videos.length === 4 ? (key === 1 || key === 3 ? "10%" : "2%") : "1%",
              marginLeft: videos.length === 4 ? (key === 0 || key === 2 ? "10%" : "2%") : "1%",
              height: currHeight,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box className={classes.videoContainerGrandChild}>
              <IndividualVideo
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
            </Box>
            <Box
              style={{
                fontSize: "1.3rem",
                fontFamily: "sans-serif",
                color: "white",
                textAlign: "right",
                paddingRight: "3%",
                width: "fit-content",
                marginLeft: "auto",
                padding: "1.3%",
                zIndex: "100",
                position: "absolute",
                bottom: "0",
                right: "0",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <Box component="span" style={{ verticalAlign: "bottom" }}>
                {videoStream.userId === myId ? "You" : videoStream.userName}
              </Box>
              {videoStream.userId !== myId &&
                (videoStream.audio ? <MicIcon style={{ marginLeft: "10px", verticalAlign: "bottom" }} /> : <MicOffIcon style={{ marginLeft: "10px", verticalAlign: "bottom" }} />)}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
