import React, { useEffect, useState, useRef } from "react";
import { Paper, Box, makeStyles, Grid, StylesProvider } from "@material-ui/core";
import * as faceapi from "face-api.js";
import { useSocket } from "../../utils/SocketProvider";
import allStickers from "../../utils/StickerProvider";

// import joker from "../assets/images/CHAT_PNG.png";
const useStyles = makeStyles({
  videoAltImg: {
    backgroundColor: "black",
  },
});

const useAbleMaxWidths = ["49vw", "43vw", "29vw"];

export default function IndividualVideo({ key, myId, speakerToggle, videoStream, video, audio, size }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRefs = useRef({});
  const clearMe = useRef();
  const startInterval = useRef();
  const stopInterval = useRef();
  const img = useRef();
  const errCnt = useRef(0);
  const socket = useSocket();
  useEffect(() => {
    startVideo();
    img.current = new Image();
  }, []);
  useEffect(() => {
    if (typeof stopInterval.current === "function") {
      stopInterval.current();
    }
    socket.on("start-sticker", (userId, key) => {
      console.log("recieved");
      if (userId === videoStream.userId) {
        if (typeof stopInterval.current === "function") stopInterval.current();
        if (img.current) {
          const currImg = allStickers[key];
          console.log(currImg);
          const currImgName = Object.keys(currImg)[0];
          console.log(currImgName);
          img.current.src = currImg[currImgName];
          console.log(img.current.src);
        }
        if (typeof startInterval.current === "function") startInterval.current();
      }
    });
    socket.on("stop-sticker", (userId) => {
      if (userId === videoStream.userId) {
        stopInterval.current();
      }
    });
    return () => {
      console.log("stopping this sticker", videoStream.userId);
      if (typeof stopInterval.current === "function") stopInterval.current();
      const turnOff = ["start-sticker", "stop-sticker"];
      turnOff.forEach((turn) => {
        socket.off(turn);
      });
    };
  }, [size]);

  function startVideo() {
    console.log("starting now");
    setModelsLoaded(true);
  }

  async function startCanvasDrawing() {
    const myId = videoStream.userId;
    if (videoRefs.current[myId] === undefined) return;
    console.log(videoRefs.current);
    videoRefs.current[myId].canvasRef.innerHTML = await faceapi.createCanvasFromMedia(videoRefs.current[myId].videoRef);
    const displaySize = videoRefs.current[myId].videoRef.getBoundingClientRect();
    // const displaySize={
    //   height:
    // }
    faceapi.matchDimensions(videoRefs.current[myId].canvasRef, displaySize);
    console.log(displaySize);
    // const ctx = canvasRef.current.getContext("2d");
    // img.current = new Image();
    // img.current.src = joker;
    startInterval.current = () => {
      clearMe.current = setInterval(async () => {
        try {
          const detections = await faceapi.detectAllFaces(videoRefs.current[myId].videoRef, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          if (detections && detections.length > 0) {
            errCnt.current = 0;
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const noseCoods = resizedDetections[0].landmarks.getNose();
            const headCoods = resizedDetections[0].landmarks.getLeftEyeBrow();
            const jawCoods = resizedDetections[0].landmarks.getJawOutline();
            // console.log(jawCoods);
            // console.log(noseCoods);
            //       // console.log(headCoods);
            videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
            videoRefs.current[myId].canvasRef
              .getContext("2d")
              .drawImage(
                img.current,
                jawCoods[4].x - (jawCoods[16].x - jawCoods[0].x) * 0.48,
                jawCoods[0].y - (jawCoods[8].y - headCoods[3].y) * 0.9,
                (jawCoods[16].x - jawCoods[0].x) * 1.7,
                (jawCoods[8].y - headCoods[3].y) * 1.8
              );
            // faceapi.draw.drawDetections(videoRefs.current[myId].canvasRef, resizedDetections);
            // faceapi.draw.drawFaceLandmarks(videoRefs.current[myId].canvasRef, resizedDetections);
          } else {
            console.log(errCnt.current);
            if (errCnt.current > 10) {
              console.log("clearing now");
              videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
              errCnt.current = 0;
            }
            errCnt.current++;
          }
        } catch (err) {
          console.log(err);
        }
      }, 200);
    };
    stopInterval.current = () => {
      clearInterval(clearMe.current);
      setTimeout(() => {
        console.log("stopped boooom");
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 800);
      setTimeout(() => {
        console.log("stopped boooom");
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 2000);
      setTimeout(() => {
        console.log("stopped boooom");
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 2600);
    };
    // startInterval.current();
  }

  const currMaxWidth = size === 1 ? useAbleMaxWidths[0] : size === 2 || size === 4 ? useAbleMaxWidths[1] : useAbleMaxWidths[2];
  if (!modelsLoaded) {
    return <div style={{ color: "white" }}>Loading</div>;
  }
  return (
    <>
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay
        onPlaying={() => {
          // if (typeof stopInterval.current === "function") stopInterval.current();
          startCanvasDrawing();
        }}
        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: currMaxWidth, height: "100%", position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
        ref={(videoRef) => {
          if (videoRef) {
            if (videoRefs.current[videoStream.userId] === undefined) videoRefs.current[videoStream.userId] = { videoRef };
            else {
              videoRefs.current[videoStream.userId].videoRef = videoRef;
            }
          }
          if (videoRef) videoRef.srcObject = videoStream.stream;
          return videoRef;
        }}
      />
      <canvas
        ref={(canvasRef) => {
          if (canvasRef) {
            if (videoRefs.current[videoStream.userId] === undefined) videoRefs.current[videoStream.userId] = { canvasRef };
            else {
              videoRefs.current[videoStream.userId].canvasRef = canvasRef;
            }
          }
        }}
        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: currMaxWidth, height: "100%", position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
      ></canvas>
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }} alt={videoStream.userName} />
      )}
      {/* {!videoStream.audio && videoStream.userId !== myId && <p>muted</p>}
        {!videoStream.video && videoStream.userId !== myId && <p>camOff</p>} */}
    </>
  );
}
