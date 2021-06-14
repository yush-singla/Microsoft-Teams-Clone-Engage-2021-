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
  useEffect(() => {
    console.log("used effect");
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        document.getElementById("toggleMute").addEventListener("click", () => {
          console.log(stream.getVideoTracks()[0].enabled);
          stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
          setAudio((prev) => !prev);
        });
        document.getElementById("toggleCamera").addEventListener("click", () => {
          console.log(stream.getAudioTracks()[0].enabled);
          stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
          setVideo((prev) => !prev);
        });
        const myPeer = new Peer(undefined, {
          // host: "peerjs-server.herokuapp.com",
          // secure: true,
          // port: 443,
          host: "/",
          port: "3001",
        });
        myPeer.on("open", (userId) => {
          console.log("new peer has been created");
          console.log(myPeer);
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
      })
      .catch((error) => console.log(error));
    // return () => {

    // };
  }, []);
  function addVideoStream(userStream, userId) {
    setVideos((prev) => {
      return [...prev, { userId, stream: userStream }];
    });
  }
  return (
    <div>
      <button id="toggleMute">{audio ? "Mute" : "UnMute"}</button>
      <button id="toggleCamera">{video ? "Hide Video" : "Show Video"}</button>
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
