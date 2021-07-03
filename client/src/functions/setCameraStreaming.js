export async function setCameraStreaming(
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
) {
  console.log("starting");
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    if (callback) {
      callback();
      setLoadingScreen({ value: true, mssg: "Setting Up Video Mode.." });
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
      setScreenShareStreamOn(() => {
        console.log("log disconnecting working");
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
    console.log("returning stream", stream);
    return new Promise((resolve, reject) => {
      resolve({ stream, myPeer });
    });
  } catch (err) {
    console.log(err);
  }
}
