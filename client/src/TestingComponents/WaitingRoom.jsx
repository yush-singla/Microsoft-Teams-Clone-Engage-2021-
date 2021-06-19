import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import { Redirect } from "react-router";
import { Box, Paper, IconButton, Button, Grid, Tooltip, makeStyles, Typography } from "@material-ui/core";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";

const useStyles = makeStyles({
  paperStyle: {
    backgroundColor: "#DDDDDD",
  },
});

export default function WaitingRoom() {
  const classes = useStyles();
  const socket = useSocket();
  const [myVideo, setMyVideo] = useState(null);
  const toggleAudio = useRef();
  const toggleVideo = useRef();
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [hasAskedToJoin, setHasAskedToJoin] = useState(false);
  console.log("socket is used", socket);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    console.log("requesting access");
    showUserVideo();
    const roomId = window.location.pathname.split("/")[2];
    socket.emit("check-valid-room", roomId, ({ status }) => {
      if (status === "invalid room") {
        alert("Link is invalid");
        setStatus("invalid room");
      }
    });
    socket.on("you-are-admitted", () => {
      setStatus("allowed");
      alert("allowed");
    });
    socket.on("you-are-denied", () => {
      setStatus("denied");
      alert("host denied entry to the meeting");
    });
    return () => {
      socket.off("you-are-admitted");
      socket.off("you-are-denied");
    };
  }, []);
  function askToJoin() {
    setHasAskedToJoin(true);
    const roomId = window.location.pathname.split("/")[2];
    socket.emit("req-join-room", roomId);
  }
  async function showUserVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    toggleVideo.current = () => {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setVideo((prev) => !prev);
    };
    toggleAudio.current = () => {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setAudio((prev) => !prev);
    };
    // console.log(stream.getVideoTracks(), stream.getAudioTracks());
    // console.log(stream);
    // console.log(myVideo);
    setMyVideo({ stream });
  }

  if (status === "invalid room") {
    return <Redirect to="/" />;
  }
  if (status === "allowed") {
    const link = `/join/${window.location.pathname.split("/")[2]}`;
    return (
      <Redirect
        to={{
          pathname: link,
          state: { from: "/", audio, video },
        }}
      />
    );
  }
  if (status === "denied") {
    return <Redirect to="/" />;
  }
  return (
    <>
      <Box textAlign="center" px={8}>
        <Typography variant="h2">WaitingRoom</Typography>
        <Paper className={classes.paperStyle}>
          <Box p={6}>
            <video
              muted
              playsInline
              autoPlay
              style={{ width: "320px", height: "220px" }}
              ref={(videoRef) => {
                if (videoRef && myVideo) {
                  videoRef.srcObject = myVideo.stream;
                }
              }}
            ></video>
            <Grid container>
              <Grid item xs={12}>
                <Box component="span" px={1}>
                  <Tooltip placement="top" title={audio ? "Turn off Microphone" : "Turn on Microphone"}>
                    <IconButton onClick={toggleAudio.current} color={audio ? "default" : "secondary"}>
                      {audio ? <MicIcon className={classes.iconStyles} /> : <MicOffIcon className={classes.iconStyles} />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box component="span" px={1}>
                  <Tooltip placement="top" title={video ? "Turn off Camera" : "Turn on Camera"}>
                    <IconButton onClick={toggleVideo.current} color={video ? "default" : "secondary"}>
                      {video ? <VideocamIcon className={classes.iconStyles} /> : <VideocamOffIcon className={classes.iconStyles} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" variant="contained" onClick={askToJoin} disabled={hasAskedToJoin}>
                  {!hasAskedToJoin ? "Ask To Join" : "Waiting for host"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
