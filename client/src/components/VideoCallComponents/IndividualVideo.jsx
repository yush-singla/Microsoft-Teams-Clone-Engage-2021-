import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";
import { useSocket } from "../../utils/SocketProvider";
import allStickers from "../../utils/StickerProvider";

const useAbleMaxWidths = ["65vw", "50vw", "32vw"];

export default function IndividualVideo({ myId, speakerToggle, videoStream, video, size, setIsStickerSet }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  //we are using this single variable to store both the refs to canvas as well as video in a map
  //linked to them by their userid
  const videoRefs = useRef({});
  const clearMe = useRef();
  const startInterval = useRef();
  const stopInterval = useRef();
  const img = useRef();
  const errCnt = useRef(0);
  const socket = useSocket();
  const firstTime = useRef(true);
  useEffect(() => {
    startVideo();
    img.current = new Image();
  }, []);
  useEffect(() => {
    if (typeof stopInterval.current === "function") {
      stopInterval.current();
      setIsStickerSet(false);
    }
    socket.on("start-sticker", (userId, key) => {
      if (userId === videoStream.userId) {
        if (typeof stopInterval.current === "function") stopInterval.current();
        if (img.current) {
          const currImg = allStickers[key];
          const currImgName = Object.keys(currImg)[0];
          img.current.src = currImg[currImgName];
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
      if (typeof stopInterval.current === "function") stopInterval.current();
      const turnOff = ["start-sticker", "stop-sticker"];
      turnOff.forEach((turn) => {
        socket.off(turn);
      });
    };
  }, [size]);

  function startVideo() {
    setModelsLoaded(true);
  }

  async function startCanvasDrawing() {
    const myId = videoStream.userId;
    if (videoRefs.current[myId] === undefined) return;
    videoRefs.current[myId].canvasRef.innerHTML = await faceapi.createCanvasFromMedia(videoRefs.current[myId].videoRef);
    const displaySize = videoRefs.current[myId].videoRef.getBoundingClientRect();
    faceapi.matchDimensions(videoRefs.current[myId].canvasRef, displaySize);
    startInterval.current = () => {
      clearMe.current = setInterval(async () => {
        try {
          const detections = await faceapi.detectAllFaces(videoRefs.current[myId].videoRef, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          if (detections && detections.length > 0) {
            errCnt.current = 0;
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const headCoods = resizedDetections[0].landmarks.getLeftEyeBrow();
            const jawCoods = resizedDetections[0].landmarks.getJawOutline();
            videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
            videoRefs.current[myId].canvasRef
              .getContext("2d")
              .drawImage(
                img.current,
                jawCoods[4].x - (jawCoods[16].x - jawCoods[0].x) * 0.43,
                jawCoods[0].y - (jawCoods[8].y - headCoods[3].y) * 0.91,
                (jawCoods[16].x - jawCoods[0].x) * 1.7,
                (jawCoods[8].y - headCoods[3].y) * 1.8
              );
            // faceapi.draw.drawDetections(videoRefs.current[myId].canvasRef, resizedDetections);
            // faceapi.draw.drawFaceLandmarks(videoRefs.current[myId].canvasRef, resizedDetections);
          } else {
            if (errCnt.current > 10) {
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
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 800);
      setTimeout(() => {
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 2000);
      setTimeout(() => {
        videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
      }, 2600);
    };
    if (firstTime.current) {
      startInterval.current();
      setTimeout(() => {
        stopInterval.current();
      }, 1000);
      firstTime.current = false;
    }
  }

  const currMaxWidth = size === 1 ? useAbleMaxWidths[0] : size === 2 ? useAbleMaxWidths[1] : useAbleMaxWidths[2];
  if (!modelsLoaded) {
    return <div style={{ color: "white" }}>Loading</div>;
  }
  if (videoStream === undefined) return null;
  return (
    <>
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay
        onPlaying={() => {
          startCanvasDrawing();
        }}
        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: currMaxWidth, position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
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
            ? { width: currMaxWidth, position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
      ></canvas>
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }} alt={videoStream.userName} />
      )}
    </>
  );
}
