export async function setScreenShareStream(
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
) {
  try {
    let AudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let ScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    if (callback) {
      callback();
      setLoadingScreen({ value: true, mssg: "Screen Share is being set Up.." });
    } else {
      setAudio(true);
      console.log("callback is undefined");
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
      setCameraStreamingOn(() => {
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
    return new Promise((resolve, reject) => {
      return resolve({ stream, myPeer });
    });
  } catch (err) {
    console.log(err);
    return new Promise((resolve, reject) => {
      return reject(err);
    });
  }
}
