import React from "react";
import { Grid, Box } from "@material-ui/core";

export default function ScreenShare({ someOneSharingScreen, videos, classes, myId, speakerToggle, video, audio }) {
  return (
    <Grid container spacing={1}>
      {console.log("here", someOneSharingScreen, videos)}
      <Grid item xs={8}>
        {videos.map((videoStream, key) => {
          if (videoStream.userId === someOneSharingScreen.userId) {
            return (
              <video
                autoPlay
                muted
                style={{ maxHeight: "83vh", maxWidth: "100%", margin: "auto", display: "block" }}
                ref={(videoRef) => {
                  if (videoRef) videoRef.srcObject = videoStream.stream;
                  return videoRef;
                }}
              />
            );
          }
        })}
      </Grid>
      <Grid item xs={4}>
        <Box style={{ overflowY: "scroll", maxHeight: "80vh" }}>
          {videos.map((videoStream, key) => {
            if (videoStream.userId !== someOneSharingScreen.userId) {
              return (
                <video
                  autoPlay
                  muted
                  style={{ width: "100%" }}
                  ref={(videoRef) => {
                    if (videoRef) videoRef.srcObject = videoStream.stream;
                    return videoRef;
                  }}
                />
              );
            }
          })}
        </Box>
      </Grid>
    </Grid>
  );
}
