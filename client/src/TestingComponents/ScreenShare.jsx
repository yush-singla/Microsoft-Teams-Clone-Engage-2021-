import React from "react";
import { Grid, Box } from "@material-ui/core";

export default function ScreenShare({ videos, classes, myId, speakerToggle, video, audio }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={8}>
        <video
          autoPlay
          muted
          style={{ maxHeight: "83vh", maxWidth: "100%", margin: "auto", display: "block" }}
          ref={(videoRef) => {
            if (videos.length >= 1) {
              if (videoRef) videoRef.srcObject = videos[0].stream;
              return videoRef;
            }
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Box style={{ overflowY: "scroll", maxHeight: "80vh" }}>
          {videos.map((videoStream, key) => {
            if (key > 0) {
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
