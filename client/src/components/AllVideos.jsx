import React from "react";
import IndividualVideo from "./IndividualVideo";
import { Box } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
const usableHeights = ["90%", "75%", "60%", "45%"];
const usableWidths = ["420vw,42vw,31vw,36vw"];
export default function AllVideos({ startInterval, stopInterval, startMaskSticker, videos, classes, myId, speakerToggle, video, audio }) {
  return (
    <Box className={classes.videoContainer}>
      {videos.map((videoStream, key) => {
        const currHeight = videos.length === 1 ? usableHeights[0] : videos.length === 2 ? usableHeights[1] : videos.length === 3 ? usableHeights[2] : usableHeights[3];
        const currentWidth = videos.length === 1 ? usableWidths[0] : videos.length === 2 ? usableWidths[1] : videos.length === 3 ? usableWidths[2] : usableWidths[3];
        return (
          <Box
            className={classes.videoContainerChild}
            key={videoStream.userId}
            style={{ backgroundColor: "black", textAlign: "center", margin: "0 1%", minWidth: videos.length === 4 ? "32%" : "30%", height: currHeight, position: "relative" }}
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
