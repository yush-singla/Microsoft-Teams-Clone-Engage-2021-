import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import { Redirect } from "react-router";

export default function WaitingRoom() {
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
    socket.emit("req-join-room", roomId, ({ status }) => {
      if (status === "invalid room") {
        alert("Link is invalid");
        setStatus("invalid room");
      }
    });
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
          state: { from: "/", audio: true, video: true },
        }}
      />
    );
  }
  if (status === "denied") {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div>WaitingRoom</div>
      <video
        muted
        playsInline
        autoPlay
        style={{ width: "100px", height: "100px" }}
        ref={(videoRef) => {
          if (videoRef && myVideo) {
            videoRef.srcObject = myVideo.stream;
          }
        }}
      ></video>
      <button onClick={toggleAudio.current}>{audio ? "Mute" : "UnMute"}</button>
      <button onClick={toggleVideo.current}>{video ? "Hide Video" : "Show Video"}</button>
      <button onClick={askToJoin} disabled={hasAskedToJoin}>
        {!hasAskedToJoin ? "Ask To Join" : "Waiting for host to let you in"}
      </button>
    </>
  );
}
