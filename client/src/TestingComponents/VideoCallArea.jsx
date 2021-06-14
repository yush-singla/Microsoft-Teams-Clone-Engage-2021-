import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import Peer from "peerjs";
import { useHistory } from "react-router";

export default function VideoCallArea() {
  let history = useHistory();
  const socket = useSocket();
  const [myId, setMyId] = useState(undefined);
  const connectedPeers = useRef({});
  const [videos, setVideos] = useState([]);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const toggleAudio = useRef();
  const toggleVideo = useRef();
  const toggleShareScreen = useRef();

  useEffect(() => {
    async function setStreaming() {
      let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      toggleAudio.current = () => {
        console.log(stream.getVideoTracks()[0].enabled);
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setAudio((prev) => !prev);
      };
      toggleVideo.current = () => {
        console.log(stream.getAudioTracks()[0].enabled);
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setVideo((prev) => !prev);
      };
      const myPeer = new Peer(undefined, {
        host: "peerjs-server.herokuapp.com",
        secure: true,
        port: 443,
        // host: "/",
        // port: "3001",
      });
      toggleShareScreen.current = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        myPeer.disconnect();
        StartScreenShare();
        socket.disconnect();
      };
      myPeer.on("open", (userId) => {
        // console.log("new peer has been created");
        // console.log(myPeer);
        socket.connect();
        setMyId(userId);
        setVideos((prev) => {
          return [...prev, { stream, userId }];
        });
        const roomId = window.location.pathname.split("/")[2];
        socket.emit("join-room", roomId, userId);
      });
      socket.on("user-connected", (userId) => {
        const call = myPeer.call(userId, stream);
        if (!call) console.error("call is undefined");
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
        console.log("disconnected", userId);
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
    setStreaming();
  }, []);

  async function StartScreenShare() {
    let AudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let ScreenShareStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    let tracks = [];
    tracks = tracks.concat(AudioStream.getAudioTracks());
    tracks = tracks.concat(ScreenShareStream.getVideoTracks());
    let stream = new MediaStream(tracks);
    console.log(stream);
    console.log(tracks);
    const myPeer = new Peer(undefined, {
      host: "peerjs-server.herokuapp.com",
      secure: true,
      port: 443,
      // host: "/",
      // port: "3001",
    });
    socket.connect();
    socket.on("connect", () => {
      console.log("connected successfully");
      console.log(myPeer);
    });
    myPeer.on("open", (userId) => {
      connectedPeers.current = {};
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId);
      setVideos([{ userId, stream }]);
      setMyId(userId);
    });
    socket.on("user-connected", (userId) => {
      const call = myPeer.call(userId, stream);
      if (!call) console.error("call is undefined");
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
      console.log("disconnected", userId);
      connectedPeers.current[userId].close();
      delete connectedPeers[userId];
    });
    myPeer.on("call", (call) => {
      console.log("I was called");
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
  return (
    <div>
      <button id="toggleMute" onClick={toggleAudio.current}>
        {audio ? "Mute" : "UnMute"}
      </button>
      <button id="toggleCamera" onClick={toggleVideo.current}>
        {video ? "Hide Video" : "Show Video"}
      </button>
      <button id="toggleScreenShare" onClick={toggleShareScreen.current}>
        Share Screen
      </button>
      {videos.map((video, key) => {
        return (
          <video
            muted={video.userId === myId}
            key={video.userId}
            playsInline
            autoPlay
            ref={(videoRef) => {
              if (videoRef) videoRef.srcObject = video.stream;
              return videoRef;
            }}
          />
        );
      })}
    </div>
  );
}
