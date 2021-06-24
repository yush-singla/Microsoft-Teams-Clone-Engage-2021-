import React from "react";
import IndividualVideo from "./IndividualVideo";
import { Box } from "@material-ui/core";

const usableHeights = ["90%", "75%", "60%", "40%"];
export default function AllVideos({ videos, classes, myId, speakerToggle, video, audio }) {
  return (
    <Box className={classes.videoContainer}>
      {videos.map((videoStream, key) => {
        const currHeight = videos.length === 1 ? usableHeights[0] : videos.length === 2 ? usableHeights[1] : videos.length === 3 ? usableHeights[2] : usableHeights[3];
        return (
          <Box
            className={classes.videoContainerChild}
            key={(key + 1).toString()}
            style={{ backgroundColor: "black", textAlign: "center", margin: "0 1%", minWidth: videos.length === 4 ? "32%" : "30%", height: currHeight, flexGrow: videos.length === 4 ? 0 : 1 }}
          >
            <IndividualVideo size={videos.length} key={videoStream.userId} videoStream={videoStream} myId={myId} classes={classes} speakerToggle={speakerToggle} video={video} audio={audio} />;
            <Box style={{ color: "white", position: "absolute", top: "100%", left: "0%" }}>{videoStream.userName}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
