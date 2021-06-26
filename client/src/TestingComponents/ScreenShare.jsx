import React from "react";
import { Grid, Box } from "@material-ui/core";
import { display } from "@material-ui/system";

export default function ScreenShare({ someOneSharingScreen, videos, classes, myId, speakerToggle, video, audio }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={8}>
        {videos.map((videoStream, key) => {
          console.log(videoStream.userId, myId, speakerToggle);
          if (videoStream.userId === someOneSharingScreen.userId) {
            return (
              <video
                autoPlay
                muted={videoStream.userId === myId || speakerToggle}
                style={{ maxHeight: "83vh", maxWidth: "100%", margin: "auto", display: "block" }}
                ref={(videoRef) => {
                  if (videoRef) videoRef.srcObject = videoStream.stream;
                  return videoRef;
                }}
              />
            );
          }
          return null;
        })}
      </Grid>
      <Grid item xs={4}>
        <Box style={{ overflowY: "scroll", maxHeight: "80vh", textAlign: "center" }}>
          {videos.map((videoStream, key) => {
            if (videoStream.userId !== someOneSharingScreen.userId) {
              return (
                <Box style={{ backgroundColor: "black", margin: "1% 5%", display: "flex", height: "100%", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "33vh" }}>
                  <video
                    autoPlay
                    muted={videoStream.userId === myId || speakerToggle}
                    style={(!videoStream.video && videoStream.userId !== myId) || (!video && videoStream.userId === myId) ? { display: "none" } : { maxWidth: "100%", maxHeight: "36vh" }}
                    ref={(videoRef) => {
                      if (videoRef) videoRef.srcObject = videoStream.stream;
                      return videoRef;
                    }}
                  />
                  {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
                    <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }} alt={videoStream.userName} />
                  )}
                </Box>
              );
            }
            return null;
          })}
        </Box>
      </Grid>
    </Grid>
  );
}
