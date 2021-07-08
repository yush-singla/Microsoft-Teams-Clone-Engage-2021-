import React from "react";
import { Grid, Box } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { Scrollbars } from "react-custom-scrollbars";

export default function ScreenShare({ someOneSharingScreen, videos, classes, myId, speakerToggle, video, audio, windowWidth }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={windowWidth >= 900 ? 8 : 12}>
        {videos.map((videoStream, key) => {
          if (videoStream.userId === someOneSharingScreen.userId) {
            return (
              <video
                key={key}
                autoPlay
                muted={videoStream.userId === myId || speakerToggle}
                style={{ height: windowWidth >= 900 ? "83vh" : "60vh", maxWidth: "100%", margin: "auto", display: "block" }}
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
      {windowWidth >= 900 ? (
        <Grid item xs={4}>
          <Scrollbars>
            <Box style={{ maxHeight: "80vh", textAlign: "center" }}>
              {videos.map((videoStream, key) => {
                if (videoStream.userId !== someOneSharingScreen.userId) {
                  return (
                    <Box
                      key={key}
                      style={{
                        backgroundColor: "black",
                        margin: "1% 5%",
                        display: "flex",
                        height: "40vh",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        minHeight: "33vh",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <video
                        autoPlay
                        muted={videoStream.userId === myId || speakerToggle}
                        style={(!videoStream.video && videoStream.userId !== myId) || (!video && videoStream.userId === myId) ? { display: "none" } : { width: "30vw" }}
                        ref={(videoRef) => {
                          if (videoRef) videoRef.srcObject = videoStream.stream;
                          return videoRef;
                        }}
                      />
                      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
                        <img
                          src={videoStream.picurL}
                          style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }}
                          alt={videoStream.userName}
                        />
                      )}
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
                }
                return null;
              })}
            </Box>
          </Scrollbars>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Grid container style={{ overflowY: "hidden", overflowX: "scroll", maxHeight: "24vh", textAlign: "center" }}>
            {videos.map((videoStream, key) => {
              if (videoStream.userId !== someOneSharingScreen.userId) {
                return (
                  <Grid key={key} xs={videos.length <= 4 ? 4 : 3}>
                    <Box
                      component="span"
                      style={{
                        backgroundColor: "black",
                        margin: "1% 5%",
                        display: "flex",
                        height: "24vh",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        overflow: "hidden",
                        width: "100%%",
                        position: "relative",
                      }}
                    >
                      <video
                        autoPlay
                        muted={videoStream.userId === myId || speakerToggle}
                        style={(!videoStream.video && videoStream.userId !== myId) || (!video && videoStream.userId === myId) ? { display: "none" } : { width: "30vw" }}
                        ref={(videoRef) => {
                          if (videoRef) videoRef.srcObject = videoStream.stream;
                          return videoRef;
                        }}
                      />
                      <Box
                        style={{
                          fontSize: "0.5rem",
                          fontFamily: "sans-serif",
                          color: "white",
                          textAlign: "right",
                          paddingRight: "3%",
                          width: "fit-content",
                          marginLeft: "auto",
                          zIndex: "100",
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          height: "10vw",
                        }}
                      >
                        <Box component="span" style={{ verticalAlign: "top", marginTop: "1vw" }}>
                          {videoStream.userId === myId ? "You" : videoStream.userName}
                        </Box>
                        <Box component="span" style={{ verticalAlign: "middle" }}>
                          {videoStream.userId !== myId &&
                            (videoStream.audio ? (
                              <MicIcon style={{ marginLeft: "10px", width: "3vw", verticalAlign: "bottom" }} />
                            ) : (
                              <MicOffIcon style={{ marginLeft: "10px", width: "3vw", verticalAlign: "bottom" }} />
                            ))}
                        </Box>
                      </Box>
                      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
                        <img
                          src={videoStream.picurL}
                          style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }}
                          alt={videoStream.userName}
                        />
                      )}
                    </Box>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
