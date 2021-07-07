import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import AlertDialog from "./VideoCallComponents/DialogBox";
import { Typography, Snackbar } from "@material-ui/core";
import Toolbar from "./VideoCallComponents/Toolbar";
import ShowParticipantsDrawer from "./VideoCallComponents/ShowParticipantsDrawer";
import AllVideos from "./VideoCallComponents/AllVideos";
import ChatDrawer from "./VideoCallComponents/ChatDrawer";
import ScreenShare from "./VideoCallComponents/ScreenShare";
import * as faceapi from "face-api.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import LoadingModal from "./VideoCallComponents/LoadingModal";
import axios from "axios";
import { titleCase } from "../functions/titleCase";
import { setCameraStreaming } from "../functions/setCameraStreaming";
import { setScreenShareStream } from "../functions/setScreenStream";
import ShareLinkClipBoard from "./VideoCallComponents/ShareLinkClipBoard";
import SetUpInitail from "../functions/SetUpInitail";
import MobileAllVideos from "./VideoCallComponents/MobileAllVIdeos";

export default function VideoCallArea(props) {
  const [loadingScreen, setLoadingScreen] = useState({ value: false, mssg: "" });
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
  const [openSnackBar, setOpenSnackBar] = useState({ value: false });
  const [showChatPopUp, setShowChatPopUp] = useState(0);
  const [someOneSharingScreen, setSomeOneSharingScreen] = useState({ value: false, userId: null });
  const someOneSharingScreenRef = useRef({ value: false, userId: null });
  const [startMaskSticker, setStartMaskSticker] = useState(false);
  const stopInterval = useRef();
  const startInterval = useRef();
  const myPicRef = useRef();
  const myNameRef = useRef();
  const [openShareLink, setOpenShareLink] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isStickerSet, setIsStickerSet] = useState(false);
  const firstTime = useRef(true);
  const uniqueIdRef = useRef();
  const loadModels = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ])
      .then(setUp)
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
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

  const setUp = () => {
    SetUpInitail({
      socket,
      setMyPic,
      axios,
      myPicRef,
      myNameRef,
      setAskForPermission,
      setNameOfPersoToJoin,
      setOpenDialogBox,
      allowUser,
      someOneSharingScreenRef,
      setSomeOneSharingScreen,
      titleCase,
      setVideos,
      setLoadingScreen,
      props,
      uniqueIdRef,
    }).then(() => {
      axios.get("/authenticated").then((response) => {
        uniqueIdRef.current = response.data.uniqueId;
        console.log({ before: props.location.state.name });
        if (props.location.state.creator) {
          console.log("now calliing create room chat");
          socket.emit("create-room-chat", {
            roomId: window.location.pathname.split("/")[2],
            uniqueId: uniqueIdRef.current,
            picurL: myPicRef.current,
            name: myNameRef.current,
            meetingName: props.location.state.name,
            allowAnyoneToStart: props.location.state.allowAnyoneToStart,
          });
        }
      });

      setCameraStreamingOn();
    });
  };

  async function setCameraStreamingOn(callback) {
    setCameraStreaming(
      {
        setVideo,
        videoStatus,
        setAudio,
        audioStatus,
        props,
        connectedPeers,
        socket,
        toggleShareScreen,
        toggleVideo,
        toggleAudio,
        Peer,
        someOneSharingScreenRef,
        setSharingScreen,
        setScreenShareStreamOn,
        setLoadingScreen,
      },
      callback
    ).then(({ stream, myPeer }) => {
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
        if (callback) {
          const roomId = window.location.pathname.split("/")[2];
          socket.emit("stopping-screen-share", { userId: myIdRef.current, roomId });
          setSomeOneSharingScreen({ value: false, userId: null });
          someOneSharingScreenRef.current = { value: false, userId: null };
        }
      });
    });
  }
  async function setScreenShareStreamOn(callback) {
    setScreenShareStream(
      {
        someOneSharingScreenRef,
        setAudio,
        audioStatus,
        connectedPeers,
        toggleAudio,
        socket,
        setSharingScreen,
        toggleShareScreen,
        setCameraStreamingOn,
        setUpSocketsAndPeerEvents,
        setSomeOneSharingScreen,
        myPic,
        myIdRef,
        Peer,
        setLoadingScreen,
      },
      callback
    )
      .then(({ stream, myPeer }) => {
        setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
          const roomId = window.location.pathname.split("/")[2];
          setSomeOneSharingScreen({ value: true, userId: myIdRef.current });
          someOneSharingScreenRef.current = { value: true, userId: myIdRef.current };
          socket.emit("starting-screen-share", { userId: myIdRef.current, roomId });
        });
      })
      .catch((err) => console.log(err));
  }

  function setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, cb) {
    myPeer.on("open", (userId) => {
      setMyId(userId);
      myIdRef.current = userId;
      cb();
      setVideos((prev) => {
        if (firstTime.current) {
          setOpenShareLink(true);
        }
        firstTime.current = false;
        setLoadingScreen({ value: false, mssg: "" });
        return [{ stream, userId, audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, userName: titleCase(myNameRef.current) }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId, { audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, name: myNameRef.current, uniqueId: uniqueIdRef.current });
    });
    socket.on("user-connected", (userId, socketId, { audio: userAudio, video: userVideo, picurL: userPicUrl, name: userName }) => {
      const call = myPeer.call(userId, stream);
      setLoadingScreen({ value: true, mssg: "Admitting new Participant" });
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
    socket.on("user-disconnected", ({ userId, name }) => {
      connectedPeers.current[userId].close();
      setOpenSnackBar({ value: true, name });
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
    setLoadingScreen({ value: false });
    setOpenShareLink(false);
  }

  function admitToMeeting({ socketId }) {
    socket.emit("this-user-is-allowed", socketId);
    setLoadingScreen({ value: true, mssg: "Admitting new Participant" });
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
  }

  function denyMeeting({ socketId }) {
    socket.emit("this-user-is-denied", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req.socketId !== socketId)]);
  }

  const toolbarProps = {
    audio,
    toggleAudio,
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
    askForPermission,
    windowWidth,
    isStickerSet,
    setIsStickerSet,
  };
  const participantDrawerProps = { windowWidth, waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission, myId };
  const allVideoProps = { setIsStickerSet, startInterval, stopInterval, startMaskSticker, someOneSharingScreen, videos, myId, speakerToggle, video, audio };
  const chatProps = { uniqueIdRef, windowWidth, chatOpen, setChatOpen, chatOpenRef, videos, myId, myNameRef, myPicRef, setShowChatPopUp };
  if (videos.length === 0)
    return (
      <div style={{ position: "absolute", top: "45vh", left: "40vw", textAlign: "center" }}>
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={100000} />
        <Typography>Setting up the meet for You</Typography>
      </div>
    );
  return (
    <div>
      <LoadingModal loadingScreen={loadingScreen.value} content={loadingScreen.mssg} />
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
      {someOneSharingScreen.value ? <ScreenShare windowWidth={windowWidth} {...allVideoProps} /> : windowWidth > 900 ? <AllVideos {...allVideoProps} /> : <MobileAllVideos {...allVideoProps} />}
      <ShareLinkClipBoard openShareLink={openShareLink} setOpenShareLink={setOpenShareLink} />
      <Toolbar {...toolbarProps} />
      <ShowParticipantsDrawer {...participantDrawerProps} />
      <ChatDrawer {...chatProps} />
      <Snackbar
        open={openSnackBar.value}
        autoHideDuration={2500}
        onClose={() => {
          setOpenSnackBar({ value: false, name: null });
        }}
        message={`${openSnackBar.name} has left the meeting`}
      />
    </div>
  );
}
