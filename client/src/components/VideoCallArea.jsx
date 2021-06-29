import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import AlertDialog from "./VideoCallComponents/DialogBox";
import axios from "axios";
import { makeStyles, Typography } from "@material-ui/core";
import Toolbar from "./VideoCallComponents/Toolbar";
import ShowParticipantsDrawer from "./VideoCallComponents/ShowParticipantsDrawer";
import AllVideos from "./VideoCallComponents/AllVideos";
import ChatDrawer from "./VideoCallComponents/ChatDrawer";
import ScreenShare from "./VideoCallComponents/ScreenShare";
import * as faceapi from "face-api.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Modal } from "@material-ui/core";
import LoadingModal from "./VideoCallComponents/LoadingModal";

const useStyles = makeStyles({
  bottomBar: {
    width: "98%",
    height: "10vh",
    position: "fixed",
    bottom: "20px",
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
    flex: "1 0 auto",
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

export default function VideoCallArea(props) {
  const classes = useStyles();
  const [loadingScreen, setLoadingScreen] = useState(false);
  const socket = useSocket();
  const [myId, setMyId] = useState(undefined);
  const myIdRef = useRef();
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
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false);
  const [myPic, setMyPic] = useState(null);
  const [showChatPopUp, setShowChatPopUp] = useState(0);
  const [someOneSharingScreen, setSomeOneSharingScreen] = useState({ value: false, userId: null });
  const someOneSharingScreenRef = useRef({ value: false, userId: null });
  const [startMaskSticker, setStartMaskSticker] = useState(false);
  const stopInterval = useRef();
  const startInterval = useRef();
  const myPicRef = useRef();
  const myNameRef = useRef();
  const loadModels = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ])
      .then(setUpWebRTC)
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadModels();

    //turning off all the events when the component unmounts so that there is no accumulation
    return () => {
      const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
      events.forEach((event) => {
        socket.off(event);
      });
      socket.disconnect();
    };
  }, []);

  //here we set up the socket basic events to detect if someone mutes audio video,etc
  const setUpWebRTC = () => {
    const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
    events.forEach((event) => {
      socket.off(event);
    });
    axios.get("/authenticated").then((response) => {
      setMyPic(response.data.picurL);
      myPicRef.current = response.data.picurL;
      myNameRef.current = response.data.name;
      socket.on("req-to-join-room", ({ socketId, name }, attemtingTo) => {
        if (attemtingTo === "join") {
          setAskForPermission((prev) => [...prev, { socketId, name }]);
          setNameOfPersoToJoin({ name: name, id: socketId });
          setOpenDialogBox(true);
          allowUser.current = () => {
            socket.emit("this-user-is-allowed", socketId);
          };
        } else {
          setAskForPermission((prev) => [...prev.filter((request) => request.socketId !== socketId)]);
        }
      });
      socket.on("update-audio-video-state", ({ video: userVideo, audio: userAudio, userId, picurL: userPicUrl, name: userName, screenShareStatus }) => {
        if (someOneSharingScreenRef.current !== undefined && someOneSharingScreenRef.current.value === false) {
          setSomeOneSharingScreen(screenShareStatus);
          someOneSharingScreenRef.current = screenShareStatus;
        }
        setVideos((prev) => {
          prev.map((vid, key) => {
            if (vid.userId === userId) {
              vid.audio = userAudio;
              vid.video = userVideo;
              vid.picurL = userPicUrl;
              vid.userName = titleCase(userName);
            }
            return null;
          });
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
          prev.forEach((video) => {
            if (video.userId === userId) {
              video.video = status;
            }
          });
          return [...prev];
        });
      });
      socket.on("starting-screen-share", (userId) => {
        setSomeOneSharingScreen({ value: true, userId });
        someOneSharingScreenRef.current = { value: true, userId };
      });
      socket.on("stopping-screen-share", () => {
        setSomeOneSharingScreen({ value: false, userId: null });
        someOneSharingScreenRef.current = { value: false, userId: null };
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
  };
  function titleCase(str) {
    if (str === undefined) return "";
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }
  async function setCameraStreaming(callback) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (callback) {
        callback();
        setVideo(false);
        videoStatus.current = false;
        stream.getAudioTracks()[0].enabled = audioStatus.current;
        stream.getVideoTracks()[0].enabled = false;
      } else {
        setVideo(props.location.state.video);
        setAudio(props.location.state.audio);
        audioStatus.current = props.location.state.audio;
        videoStatus.current = props.location.state.video;
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
        videoStatus.current = !videoStatus.current;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo((prev) => !prev);
        socket.emit("changed-video-status", { status: stream.getVideoTracks()[0].enabled });
      };
      const myPeer = new Peer(undefined);
      toggleShareScreen.current.start = () => {
        if (someOneSharingScreenRef.current.value === true) {
          alert("Someone is already sharing their screen!");
          return;
        }
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
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
        if (callback) {
          const roomId = window.location.pathname.split("/")[2];
          socket.emit("stopping-screen-share", { userId: myIdRef.current, roomId });
          setSomeOneSharingScreen({ value: false, userId: null });
          someOneSharingScreenRef.current = { value: false, userId: null };
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function setScreenShareStream(callback) {
    try {
      let AudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let ScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (callback) callback();
      else {
        setAudio(true);
        audioStatus.current = true;
      }
      connectedPeers.current = {};
      let tracks = [];
      tracks = tracks.concat(AudioStream.getAudioTracks());
      tracks = tracks.concat(ScreenShareStream.getVideoTracks());
      const stream = new MediaStream();
      tracks.forEach((track) => {
        stream.addTrack(track);
      });
      stream.getAudioTracks()[0].enabled = audioStatus.current;
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
      const myPeer = new Peer(undefined);
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
        });
      };
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
        const roomId = window.location.pathname.split("/")[2];
        setSomeOneSharingScreen({ value: true, userId: myIdRef.current });
        someOneSharingScreenRef.current = { value: true, userId: myIdRef.current };
        socket.emit("starting-screen-share", { userId: myIdRef.current, roomId });
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, cb) {
    myPeer.on("open", (userId) => {
      setMyId(userId);
      myIdRef.current = userId;
      cb();
      setVideos((prev) => {
        return [{ stream, userId, audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, userName: titleCase(myNameRef.current) }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId, { audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, name: myNameRef.current });
    });
    socket.on("user-connected", (userId, socketId, { audio: userAudio, video: userVideo, picurL: userPicUrl, name: userName }) => {
      const call = myPeer.call(userId, stream);
      setLoadingScreen(true);
      if (call === undefined) {
        return;
      }
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { userAudio, userVideo, userName, userPicUrl });
        const roomId = window.location.pathname.split("/")[2];
        setVideo((prev) => {
          console.log("the state of video is", prev);
          return prev;
        });
        socket.emit("acknowledge-connected-user", {
          video: videoStatus.current,
          audio: audioStatus.current,
          socketId,
          userId,
          roomId,
          picurL: myPicRef.current,
          name: myNameRef.current,
          screenShareStatus: someOneSharingScreenRef.current,
        });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
    socket.on("user-disconnected", (userId) => {
      connectedPeers.current[userId].close();
      if (someOneSharingScreenRef.current.userId === userId) {
        setSomeOneSharingScreen({ value: false, userId: null });
        someOneSharingScreenRef.current = { value: false, userId: null };
      }
      delete connectedPeers[userId];
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { useraudio: true, userVideo: false });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
  }

  function addVideoStream(userStream, userId, { userAudio, userVideo, userPicUrl, userName }) {
    setVideos((prev) => {
      return [...prev, { userId, stream: userStream, audio: userAudio, video: userVideo, picurL: userPicUrl, userName: titleCase(userName) }];
    });
    setLoadingScreen(false);
  }

  function admitToMeeting({ socketId }) {
    socket.emit("this-user-is-allowed", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
    setLoadingScreen(true);
  }

  function denyMeeting({ socketId }) {
    socket.emit("this-user-is-denied", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
  }

  const toolbarProps = {
    audio,
    toggleAudio,
    classes,
    sharingScreen,
    toggleShareScreen,
    toggleVideo,
    video,
    speakerToggle,
    setSpeakerToggle,
    setWaitingRoomOpen,
    setChatOpen,
    chatOpenRef,
    showChatPopUp,
    setShowChatPopUp,
    setStartMaskSticker,
    startMaskSticker,
    startInterval,
    stopInterval,
    myId,
    someOneSharingScreen,
  };
  const participantDrawerProps = { waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission, myId };
  const allVideoProps = { startInterval, stopInterval, startMaskSticker, someOneSharingScreen, videos, classes, myId, speakerToggle, video, audio };
  const chatProps = { chatOpen, setChatOpen, chatOpenRef, videos, myId, myNameRef, myPicRef, setShowChatPopUp };
  if (videos.length === 0)
    return (
      <div style={{ position: "absolute", top: "45vh", left: "40vw", textAlign: "center" }}>
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={100000} />
        <Typography>Setting up the meet for You</Typography>
      </div>
    );
  return (
    <div>
      <LoadingModal loadingScreen={loadingScreen} />
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
      {someOneSharingScreen.value ? <ScreenShare {...allVideoProps} /> : <AllVideos {...allVideoProps} />}
      <Toolbar {...toolbarProps} />
      <ShowParticipantsDrawer {...participantDrawerProps} />
      <ChatDrawer {...chatProps} />
    </div>
  );
}
