import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import { useHistory } from "react-router";
import AlertDialog from "../components/DialogBox";

export default function VideoCallArea() {
  let history = useHistory();
  const socket = useSocket();
  const [myId, setMyId] = useState(undefined);
  const connectedPeers = useRef({});
  const [videos, setVideos] = useState([]);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [sharingScreen, setSharingScreen] = useState(false);
  const toggleAudio = useRef();
  const toggleVideo = useRef();
  const toggleShareScreen = useRef({ start: null, stop: undefined });
  const [speakerToggle, setSpeakerToggle] = useState(false);
  const [askForPermission, setAskForPermission] = useState([]);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [nameOfPersonToJoin, setNameOfPersoToJoin] = useState({});
  const allowUser = useRef();
  useEffect(() => {
    socket.on("req-to-join-room", (socketId, attemtingTo) => {
      if (attemtingTo === "join") {
        console.log(`called with ${socketId}`);
        setAskForPermission((prev) => [...prev, socketId]);
        setNameOfPersoToJoin({ name: socketId, id: socketId });
        setOpenDialogBox(true);
        allowUser.current = () => {
          console.log("emitting the message");
          socket.emit("this-user-is-allowed", socketId);
        };
      } else {
        setAskForPermission((prev) => [...prev.filter((request) => request !== socketId)]);
      }
    });
    setCameraStreaming();
  }, []);
  async function setCameraStreaming(callback) {
    setVideo(true);
    setAudio(true);
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      });
      if (callback) callback();
      connectedPeers.current = {};
      socket.connect();
      toggleAudio.current = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setAudio((prev) => !prev);
      };
      toggleVideo.current = () => {
        console.log(stream.getAudioTracks()[0].enabled);
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo((prev) => !prev);
      };
      const myPeer = new Peer(undefined, {
        // host: "peerjs-server.herokuapp.com",
        // secure: true,
        // port: 443,
        host: "/",
        port: "3001",
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
      setUpSocketsAndPeerEvents({ socket, myPeer, stream });
    } catch (err) {
      console.log(err);
    }
  }
  async function setScreenShareStream(callback) {
    setAudio(true);
    console.log("got called screen share");
    try {
      let AudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let ScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (callback) callback();
      connectedPeers.current = {};
      let tracks = [];
      tracks = tracks.concat(AudioStream.getAudioTracks());
      tracks = tracks.concat(ScreenShareStream.getVideoTracks());
      let stream = new MediaStream(tracks);
      toggleAudio.current = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setAudio((prev) => !prev);
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
        host: "/",
        port: "3001",
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
      setUpSocketsAndPeerEvents({ socket, myPeer, stream });
    } catch (err) {
      console.log(err);
    }
  }

  function setUpSocketsAndPeerEvents({ socket, myPeer, stream }) {
    myPeer.on("open", (userId) => {
      setMyId(userId);
      setVideos((prev) => {
        return [{ stream, userId }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId);
    });
    socket.on("user-connected", (userId) => {
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
        addVideoStream(userVideoStream, call.peer);
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
        addVideoStream(userVideoStream, call.peer);
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

  function addVideoStream(userStream, userId) {
    setVideos((prev) => {
      return [...prev, { userId, stream: userStream }];
    });
  }

  function admitToMeeting({ socketId }) {
    console.log("admitiing to meeting", socketId);
    socket.emit("this-user-is-allowed", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req !== socketId)]);
  }

  function denyMeeting({ socketId }) {
    console.log("denyying to meeting", socketId);
    socket.emit("this-user-is-denied", socketId);
    setAskForPermission((prev) => [...prev.filter((req) => req !== socketId)]);
  }

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
      <button id="toggleMute" onClick={toggleAudio.current}>
        {audio ? "Mute" : "UnMute"}
      </button>
      {!sharingScreen && (
        <button id="toggleCamera" onClick={toggleVideo.current}>
          {video ? "Hide Video" : "Show Video"}
        </button>
      )}
      <button
        id="toggleScreenShare"
        onClick={() => {
          if (!sharingScreen) toggleShareScreen.current.start();
          else toggleShareScreen.current.stop();
        }}
      >
        {sharingScreen ? "Stop Share" : "Share Screen"}
      </button>
      {videos.map((video, key) => {
        return (
          <video
            muted={video.userId === myId || speakerToggle}
            key={video.userId}
            playsInline
            autoPlay
            style={{ height: "100px", width: "200px" }}
            ref={(videoRef) => {
              if (videoRef) videoRef.srcObject = video.stream;
              return videoRef;
            }}
          />
        );
      })}
      <button
        onClick={() => {
          setSpeakerToggle((prev) => !prev);
        }}
      >
        Toggle Speaker
      </button>
      <button
        onClick={() => {
          socket.disconnect();
          window.open("/", "_self");
        }}
      >
        Leave Meeting
      </button>
      {askForPermission.map((request, key) => {
        return (
          <React.Fragment key={Math.floor(Math.random() * 10000)}>
            <div>person is {request}</div>
            <button
              onClick={() => {
                admitToMeeting({ socketId: request });
              }}
            >
              accept
            </button>
            <button
              onClick={() => {
                denyMeeting({ socketId: request });
              }}
            >
              remove from waiting area
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
