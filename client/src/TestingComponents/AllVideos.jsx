import React from "react";
import IndividualVideo from "./IndividualVideo";
import { Box } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
const usableHeights = ["90%", "75%", "60%", "45%"];
export default function AllVideos({ videos, classes, myId, speakerToggle, video, audio }) {
  function titleCase(str) {
    if (str === undefined) return "";
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }
  return (
    <Box className={classes.videoContainer}>
      {videos.map((videoStream, key) => {
        const currHeight = videos.length === 1 ? usableHeights[0] : videos.length === 2 ? usableHeights[1] : videos.length === 3 ? usableHeights[2] : usableHeights[3];
        return (
          <>
            <Box
              className={classes.videoContainerChild}
              key={(key + 1).toString()}
              style={{ backgroundColor: "black", textAlign: "center", margin: "0 1%", minWidth: videos.length === 4 ? "32%" : "30%", height: currHeight, position: "relative" }}
            >
              <Box className={classes.videoContainerGrandChild}>
                <IndividualVideo size={videos.length} key={videoStream.userId} videoStream={videoStream} myId={myId} classes={classes} speakerToggle={speakerToggle} video={video} audio={audio} />;
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
                }}
              >
                <Box component="span" style={{ verticalAlign: "bottom" }}>
                  {titleCase(videoStream.userName)}
                </Box>
                <MicIcon style={{ marginLeft: "10px", verticalAlign: "bottom" }} />
              </Box>
            </Box>
          </>
        );
      })}
    </Box>
  );
}
