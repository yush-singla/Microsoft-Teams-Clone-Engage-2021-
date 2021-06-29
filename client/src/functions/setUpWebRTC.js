import axios from "axios";

export const setUpWebRTC = ({
  socket,
  setMyPic,
  myPicRef,
  myNameRef,
  setAskForPermission,
  setNameOfPersoToJoin,
  setOpenDialogBox,
  allowUser,
  setSomeOneSharingScreen,
  someOneSharingScreenRef,
  setVideos,
  props,
  titleCase,
}) => {
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
  });
  return new Promise((resolve, reject) => {
    resolve();
  });
};
