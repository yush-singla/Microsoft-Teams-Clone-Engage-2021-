import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import { useHistory } from "react-router";
import AlertDialog from "../components/DialogBox";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import Toolbar from "./Toolbar";
import ShowParticipantsDrawer from "./ShowParticipantsDrawer";
import AllVideos from "./AllVideos";
import ChatDrawer from "./ChatDrawer";
import ScreenShare from "./ScreenShare";
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
  const [myName, setMyName] = useState(null);
  const [myPic, setMyPic] = useState(null);
  const [showChatPopUp, setShowChatPopUp] = useState(0);
  const [someOneSharingScreen, setSomeOneSharingScreen] = useState({ value: false, userId: null });
  const someOneSharingScreenRef = useRef({ value: false, userId: null });
  const myPicRef = useRef();
  const myNameRef = useRef();
  useEffect(() => {
    const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
    events.forEach((event) => {
      console.log("turnning off", event);
      socket.off(event);
    });
    axios.get("/authenticated").then((response) => {
      console.log("git to axios atleast");
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
      socket.on("update-audio-video-state", ({ video: userVideo, audio: userAudio, userId, picurL: userPicUrl, name: userName, screenShareStatus }) => {
        console.log("updated data", { userVideo, userAudio, userId });
        console.log({ screenShareStatus });
        if (someOneSharingScreenRef.current !== undefined && someOneSharingScreenRef.current.value === false) {
          setSomeOneSharingScreen(screenShareStatus);
          someOneSharingScreenRef.current = screenShareStatus;
        }
        setVideos((prev) => {
          console.log(prev);
          prev.map((vid, key) => {
            if (vid.userId === userId) {
              console.log({ userPicUrl });
              vid.audio = userAudio;
              vid.video = userVideo;
              vid.picurL = userPicUrl;
              vid.userName = titleCase(userName);
              console.log(vid);
              console.log(prev[key]);
            }
            return null;
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
      socket.on("starting-screen-share", (userId) => {
        console.log("set true");
        setSomeOneSharingScreen({ value: true, userId });
        someOneSharingScreenRef.current = { value: true, userId };
      });
      socket.on("stopping-screen-share", () => {
        console.log("seting false");
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
      console.log("exited axios properly");
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
  async function setCameraStreaming(callback) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (callback) {
        callback();
        setVideo(false);
        // setAudio(false);
        // audioStatus.current = false;
        videoStatus.current = false;
        console.log("setted audio video for this as false and false,respectively");
        console.log(audioStatus.current);
        stream.getAudioTracks()[0].enabled = audioStatus.current;
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
        if (someOneSharingScreenRef.current.value === true) {
          alert("Someone is already sharing their screen!");
          return;
        }
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
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
        console.log("came here");
        if (callback) {
          console.log("sending stop screen share with userid", myIdRef.current);
          const roomId = window.location.pathname.split("/")[2];
          socket.emit("stopping-screen-share", { userId: myIdRef.current, roomId });
          setSomeOneSharingScreen({ value: false, userId: null });
          someOneSharingScreenRef.current = { value: false, userId: null };
        }
      });
    } catch (err) {
      console.log("couldnt go to video streaming");
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
      if (callback) callback();
      else {
        setAudio(true);
        audioStatus.current = true;
      }
      connectedPeers.current = {};
      let tracks = [];
      tracks = tracks.concat(AudioStream.getAudioTracks());
      tracks = tracks.concat(ScreenShareStream.getVideoTracks());
      let stream = new MediaStream(tracks);
      stream.isScreen = true;
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
      setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, () => {
        console.log("sending share screen from ", myIdRef.current);
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
    console.log("here", audioStatus.current, videoStatus.current);
    myPeer.on("open", (userId) => {
      console.log("changing from to", myIdRef.current, userId);
      setMyId(userId);
      myIdRef.current = userId;
      console.log("setting in component", { audioStatus, videoStatus });
      console.log("now cb is caled");
      cb();
      console.log("values after callback", someOneSharingScreenRef.current);
      setVideos((prev) => {
        console.log({ myPic });
        return [{ stream, userId, audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, userName: titleCase(myNameRef.current) }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId, { audio: audioStatus.current, video: videoStatus.current, picurL: myPicRef.current, name: myNameRef.current });
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
      console.log("A user disconnected", userId);
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
      return [...prev, { userId, stream: userStream, audio: userAudio, video: userVideo, picurL: userPicUrl, userName: titleCase(userName) }];
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
  };
  const participantDrawerProps = { waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission, myId };
  const allVideoProps = { someOneSharingScreen, videos, classes, myId, speakerToggle, video, audio };
  const chatProps = { chatOpen, setChatOpen, chatOpenRef, videos, myId, myNameRef, myPicRef, setShowChatPopUp };
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
      {console.log(someOneSharingScreen)}
      {someOneSharingScreen.value ? <ScreenShare {...allVideoProps} /> : <AllVideos {...allVideoProps} />}
      <Toolbar {...toolbarProps} />
      <ShowParticipantsDrawer {...participantDrawerProps} />
      <ChatDrawer {...chatProps} />
    </div>
  );
}
