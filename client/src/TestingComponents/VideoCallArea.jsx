import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import IndividualVideo from "./IndividualVideo";
import { useHistory } from "react-router";
import AlertDialog from "../components/DialogBox";
import axios from "axios";
import GridLayout from "react-grid-layout";
import { Paper, makeStyles, IconButton, Box, Tooltip, Drawer, Typography, Divider, Grid } from "@material-ui/core";
import CallEndIcon from "@material-ui/icons/CallEnd";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import PeopleIcon from "@material-ui/icons/People";
import { display, textAlign } from "@material-ui/system";
import { use } from "passport";
const useStyles = makeStyles({
  bottomBar: {
    width: "98%",
    height: "10vh",
    position: "fixed",
    bottom: "20px",
    // overflow: "hidden",
    backgroundColor: "lightgrey",
  },
  largeIcon: {
    width: 35,
    height: 35,
  },
  iconBg: {
    backgroundColor: "grey",
  },
  videoContainer: {
    display: "flex",
    width: "auto",
    height: "85vh",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  videoContainerChild: {
    display: "flex",
    flex: "1 0 auto",
    // height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainerForFour: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
});

export default function VideoCallArea(props) {
  const classes = useStyles();
  let history = useHistory();
  const socket = useSocket();
  const [myId, setMyId] = useState(undefined);
  const connectedPeers = useRef({});
  const [videos, setVideos] = useState([]);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const audioStatus = useRef(true);
  const videoStatus = useRef(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const toggleAudio = useRef();
  const toggleVideo = useRef();
  const toggleShareScreen = useRef({ start: null, stop: undefined });
  const [speakerToggle, setSpeakerToggle] = useState(false);
  const [askForPermission, setAskForPermission] = useState([]);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [nameOfPersonToJoin, setNameOfPersoToJoin] = useState({});
  const allowUser = useRef();
  const [waitingRoomOpen, setWaitingRoomOpen] = useState(false);
  const [myName, setMyName] = useState(null);
  const [myPic, setMyPic] = useState(null);
  const myPicRef = useRef();
  const myNameRef = useRef();
  useEffect(() => {
    const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
    events.forEach((event) => {
      console.log("turnning off", event);
      socket.off(event);
    });
    axios.get("/authenticated").then((response) => {
      setMyName(response.data.name);
      setMyPic(response.data.picurL);
      myPicRef.current = response.data.picurL;
      myNameRef.current = response.data.name;
      socket.on("req-to-join-room", ({ socketId, name }, attemtingTo) => {
        if (attemtingTo === "join") {
          console.log(`called with ${socketId} & ${name}`);
          setAskForPermission((prev) => [...prev, { socketId, name }]);
          setNameOfPersoToJoin({ name: name, id: socketId });
          setOpenDialogBox(true);
          allowUser.current = () => {
            console.log("emitting the message");
            socket.emit("this-user-is-allowed", socketId);
          };
        } else {
          setAskForPermission((prev) => [...prev.filter((request) => request.socketId !== socketId)]);
        }
      });
      socket.on("update-audio-video-state", ({ video: userVideo, audio: userAudio, userId, picurL: userPicUrl, name: userName }) => {
        console.log("updated data", { userVideo, userAudio, userId });
        setVideos((prev) => {
          console.log(prev);
          prev.map((vid, key) => {
            if (vid.userId === userId) {
              console.log({ userPicUrl });
              vid.audio = userAudio;
              vid.video = userVideo;
              vid.picurL = userPicUrl;
              vid.userName = userName;
              console.log(vid);
              console.log(prev[key]);
            }
          });
          console.log(prev);
          return [...prev];
        });
      });
      socket.on("changed-audio-status-reply", ({ status, userId }) => {
        setVideos((prev) => {
          prev.forEach((video) => {
            if (video.userId === userId) {
              video.audio = status;
            }
          });
          return [...prev];
        });
      });
      socket.on("changed-video-status-reply", ({ status, userId }) => {
        setVideos((prev) => {
          console.log(prev);
          prev.forEach((video) => {
            if (video.userId === userId) {
              console.log("status", status);
              video.video = status;
            }
          });
          console.log(prev);
          return [...prev];
        });
      });
      if (props.location.state === undefined) props.location.state = {};
      if (props.location.state.audio === undefined) {
        props.location.state.audio = true;
      }
      if (props.location.state.video === undefined) {
        props.location.state.video = false;
      }
      setCameraStreaming();
    });

    return () => {
      const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
      events.forEach((event) => {
        console.log("turnning off", event);
        socket.off(event);
      });
      socket.disconnect();
      // myPeer.disconnect();
    };
  }, []);
  async function setCameraStreaming(callback) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      });
      if (callback) {
        callback();
        setVideo(false);
        setAudio(true);
        audioStatus.current = true;
        videoStatus.current = false;
        console.log("setted audio video for this as true and false,respectively");
        stream.getAudioTracks()[0].enabled = true;
        stream.getVideoTracks()[0].enabled = false;
      } else {
        console.log("setted audio video for this as true and false,respectively");
        setVideo(props.location.state.video);
        setAudio(props.location.state.audio);
        audioStatus.current = props.location.state.audio;
        videoStatus.current = props.location.state.video;
        console.log(props.location.state);
        console.log("here see this", { audioStatus, videoStatus });
        stream.getAudioTracks()[0].enabled = props.location.state.audio;
        stream.getVideoTracks()[0].enabled = props.location.state.video;
      }
      connectedPeers.current = {};
      socket.connect();
      toggleAudio.current = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        audioStatus.current = !audioStatus.current;
        setAudio((prev) => !prev);
        socket.emit("changed-audio-status", { status: stream.getAudioTracks()[0].enabled });
      };
      toggleVideo.current = () => {
        console.log(stream.getAudioTracks()[0].enabled);
        videoStatus.current = !videoStatus.current;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo((prev) => !prev);
        socket.emit("changed-video-status", { status: stream.getVideoTracks()[0].enabled });
      };
      const myPeer = new Peer(undefined, {
        // host: "peerjs-server.herokuapp.com",
        // secure: true,
        // port: 443,
        // host: "/",
        // port: "3001",
      });
      toggleShareScreen.current.start = () => {
        console.log(videos);
        setScreenShareStream(() => {
          setSharingScreen(true);
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          myPeer.disconnect();
          const events = ["user-disconnected", "user-connected"];
          events.forEach((event) => {
            console.log(`turning off the event ${event}`);
            socket.off(event);
          });
          socket.disconnect();
        });
      };
      console.log("before", { audio, video });
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic });
    } catch (err) {
      console.log(err);
    }
  }
  async function setScreenShareStream(callback) {
    console.log("got called screen share");
    try {
      let AudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let ScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setAudio(true);
      audioStatus.current = true;
      if (callback) callback();
      connectedPeers.current = {};
      let tracks = [];
      tracks = tracks.concat(AudioStream.getAudioTracks());
      tracks = tracks.concat(ScreenShareStream.getVideoTracks());
      let stream = new MediaStream(tracks);
      toggleAudio.current = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        audioStatus.current = !audioStatus.current;
        setAudio((prev) => !prev);
        socket.emit("changed-audio-status", { status: stream.getAudioTracks()[0].enabled });
      };
      stream.getVideoTracks()[0].onended = () => {
        setSharingScreen(false);
        toggleShareScreen.current.stop();
      };
      console.log(stream);
      console.log(tracks);
      const myPeer = new Peer(undefined, {
        // host: "peerjs-server.herokuapp.com",
        // secure: true,
        // port: 443,
        // host: "/",
        // port: "3001",
      });
      socket.connect();
      toggleShareScreen.current.stop = () => {
        setCameraStreaming(() => {
          myPeer.disconnect();
          setSharingScreen(false);
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          const events = ["user-disconnected", "user-connected"];
          events.forEach((event) => {
            console.log(`turning off the events ${event}`);
            socket.off(event);
          });
          socket.disconnect();
          console.log("disconnected the socket");
        });
      };
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic });
    } catch (err) {
      console.log(err);
    }
  }

  function setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }) {
    console.log("here", audioStatus.current, videoStatus.current);
    myPeer.on("open", (userId) => {
      setMyId(userId);
      console.log("setting in component", { audioStatus, videoStatus });
      setVideos((prev) => {
        console.log({ myPic });
        return [{ stream, userId, audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, userName: myNameRef }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId, { audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, name: myNameRef });
    });
    socket.on("user-connected", (userId, socketId, { audio: userAudio, video: userVideo, picurL: userPicUrl, name: userName }) => {
      const call = myPeer.call(userId, stream);
      if (call === undefined) {
        console.log(socket);
        console.log("call is undefined");
        return;
      }
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { userAudio, userVideo, userName, userPicUrl });
        // console.log("is it correct", { video, audio });
        const roomId = window.location.pathname.split("/")[2];
        setVideo((prev) => {
          console.log("the state of video is", prev);
          return prev;
        });
        // console.log("acknowledging connected users about the change", { video, audio });
        socket.emit("acknowledge-connected-user", { video: videoStatus.current, audio: audioStatus.current, socketId, userId, roomId, picurL: myPicRef.current, name: myNameRef.current });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
    socket.on("user-disconnected", (userId) => {
      console.log("A user disconnected", userId);

      connectedPeers.current[userId].close();
      delete connectedPeers[userId];
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { userAudio: false, userVideo: false });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
    history.listen(() => {
      if (history.action === "POP") {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        console.log(history);

        myPeer.disconnect();
        socket.disconnect();
      }
    });
  }

  function addVideoStream(userStream, userId, { userAudio, userVideo, userPicUrl, userName }) {
    setVideos((prev) => {
      return [...prev, { userId, stream: userStream, audio: userAudio, video: userVideo, picurL: userPicUrl, userName }];
    });
  }

  function admitToMeeting({ socketId }) {
    console.log("admitiing to meeting", socketId);
    socket.emit("this-user-is-allowed", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
  }

  function denyMeeting({ socketId }) {
    console.log("denyying to meeting", socketId);
    socket.emit("this-user-is-denied", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
  }
  const layout = [
    [{ i: "1", x: 1, y: 0, w: 10, h: 12, static: true }],
    [
      { i: "1", x: 0, y: 0, w: 6, h: 12 },
      { i: "2", x: 8, y: 0, w: 6, h: 12 },
    ],
    [
      { i: "1", x: 0, y: 3, w: 4, h: 9 },
      { i: "2", x: 4, y: 3, w: 4, h: 9 },
      { i: "3", x: 8, y: 3, w: 4, h: 9 },
    ],
    [
      { i: "1", x: 1, y: 0, w: 4, h: 7 },
      { i: "2", x: 7, y: 0, w: 4, h: 7 },
      { i: "3", x: 1, y: 10, w: 4, h: 7 },
      { i: "4", x: 7, y: 10, w: 4, h: 7 },
    ],
  ];

  const usableHeights = ["90%", "75%", "60%", "40%"];
  return (
    <div>
      {openDialogBox && (
        <AlertDialog
          openDialogBox={openDialogBox}
          id={nameOfPersonToJoin.id}
          name={nameOfPersonToJoin.name}
          admitToMeeting={admitToMeeting}
          setOpenDialogBox={setOpenDialogBox}
          denyMeeting={denyMeeting}
        />
      )}
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
            </Box>
          );
        })}
      </Box>
      <Paper className={classes.bottomBar}>
        <Box textAlign="center">
          <Tooltip title={audio ? "Turn off Microphone" : "Turn on Microphone"}>
            <IconButton onClick={toggleAudio.current} color={!audio ? "secondary" : "default"}>
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>
          {!sharingScreen && (
            <Tooltip title={video ? "Turn off Camera" : "Turn on Camera"}>
              <IconButton id="toggleCamera" onClick={toggleVideo.current} color={!video ? "secondary" : "default"}>
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={!sharingScreen ? "Present Your Screen" : "Stop Presenting Screen"}>
            <IconButton
              onClick={() => {
                if (!sharingScreen) toggleShareScreen.current.start();
                else toggleShareScreen.current.stop();
              }}
              color={sharingScreen ? "secondary" : "default"}
            >
              {!sharingScreen ? <PresentToAllIcon /> : <CancelPresentationIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Leave Meeting">
            <IconButton
              size="medium"
              color="secondary"
              onClick={() => {
                socket.disconnect();
                window.open("/", "_self");
              }}
            >
              <CallEndIcon className={classes.largeIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title={speakerToggle ? "Turn on Speaker" : "Turn off Speaker"}>
            <IconButton
              onClick={() => {
                setSpeakerToggle((prev) => !prev);
              }}
            >
              {speakerToggle ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={"Open Waiting Room"}>
            <IconButton
              onClick={() => {
                setWaitingRoomOpen(true);
              }}
            >
              <PeopleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      {/* <button
        onClick={() => {
          setWaitingRoomOpen(true);
        }}
      >
        open waiting room
      </button> */}
      <Drawer
        anchor="right"
        open={waitingRoomOpen}
        onClose={() => {
          setWaitingRoomOpen(false);
        }}
      >
        {" "}
        <Typography variant="h5">Participants</Typography>
        <Divider />
        <Typography variant="h5">Waiting Room</Typography>
        <Divider />
        {/* <Typography variant="p">Following is a list of people currently in the waiting room</Typography> */}
        {askForPermission.map((request, key) => {
          return (
            <React.Fragment key={Math.floor(Math.random() * 10000)}>
              <Grid container>
                <Grid item xs={8}>
                  <Typography variant="p" style={{ overflowWrap: "break-word" }}>
                    {request.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title="Add to the Meeting">
                    <IconButton
                      onClick={() => {
                        admitToMeeting({ socketId: request.socketId });
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title="Remove from Waiting Room">
                    <IconButton
                      onClick={() => {
                        denyMeeting({ socketId: request });
                      }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </React.Fragment>
          );
        })}
      </Drawer>
    </div>
  );
}
