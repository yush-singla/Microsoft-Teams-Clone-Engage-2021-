import React, { useState, useRef } from "react";
import { Paper, Box, Tooltip, IconButton, Badge, Modal, Grid, Typography, Popover } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import CallEndIcon from "@material-ui/icons/CallEnd";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import { useSocket } from "../utils/SocketProvider";
import ChatIcon from "@material-ui/icons/Chat";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import allStickers from "../utils/StickerProvider";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import FaceIcon from "@material-ui/icons/Face";
import ClearIcon from "@material-ui/icons/Clear";
// import { useSocketf } from "../utils/SocketProvider";
export default function Toolbar({
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
  chatOpen,
  setChatOpen,
  showChatPopUp,
  setShowChatPopUp,
  chatOpenRef,
  startMaskSticker,
  setStartMaskSticker,
  startInterval,
  stopInterval,
  myId,
  someOneSharingScreen,
}) {
  const socket = useSocket();
  const [openStickerModal, setOpenStickerModal] = useState(false);
  const [isStickerSet, setIsStickerSet] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const anchorForPopup = useRef();
  return (
    <Paper className={classes.bottomBar}>
      <Box textAlign="center">
        <Tooltip title={audio ? "Turn off Microphone" : "Turn on Microphone"}>
          <IconButton onClick={toggleAudio.current} color={!audio ? "secondary" : "default"}>
            {audio ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>
        {!sharingScreen && (
          <Tooltip title={video ? "Turn off Camera" : "Turn on Camera"}>
            <IconButton id="toggleCamera" onClick={toggleVideo.current} color={!video ? "secondary" : "default"}>
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={!sharingScreen ? "Present Your Screen" : "Stop Presenting Screen"}>
          <IconButton
            onClick={() => {
              if (!sharingScreen) toggleShareScreen.current.start();
              else toggleShareScreen.current.stop();
            }}
            color={sharingScreen ? "secondary" : "default"}
          >
            {!sharingScreen ? <PresentToAllIcon /> : <CancelPresentationIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Leave Meeting">
          <IconButton
            size="medium"
            color="secondary"
            onClick={() => {
              socket.disconnect();
              window.open("/", "_self");
            }}
          >
            <CallEndIcon className={classes.largeIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={speakerToggle ? "Turn on Speaker" : "Turn off Speaker"}>
          <IconButton
            onClick={() => {
              setSpeakerToggle((prev) => !prev);
            }}
          >
            {speakerToggle ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={"Participants and Waiting room"}>
          <IconButton
            onClick={() => {
              setWaitingRoomOpen(true);
            }}
          >
            <PeopleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={showChatPopUp ? "you have unread messages in the chat" : "Chats"}>
          <IconButton
            onClick={() => {
              setShowChatPopUp(0);
              setChatOpen(true);
              chatOpenRef.current = true;
            }}
          >
            {showChatPopUp > 0 ? (
              <>
                {console.log(showChatPopUp)}
                <Badge color="primary" badgeContent={showChatPopUp}>
                  <ChatIcon />
                </Badge>
              </>
            ) : (
              <ChatIcon />
            )}
          </IconButton>
        </Tooltip>
        {!sharingScreen && !someOneSharingScreen.value && (
          <>
            <Tooltip title={"Add sticker and masks"}>
              <IconButton
                type="button"
                ref={anchorForPopup}
                onClick={() => {
                  if (video) setOpenStickerModal(true);
                  else {
                    setOpenPopover(true);
                    setTimeout(() => {
                      setOpenPopover(false);
                    }, 800);
                  }
                }}
              >
                <FaceIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={openPopover}
              anchorEl={anchorForPopup.current}
              onClose={() => {
                setOpenPopover(false);
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Box m={1} style={{ backgroundColor: "transparent", color: "red", fontWeight: "1.5rem" }}>
                <Typography style={{ backgroundColor: "transparent" }}>Turn on the video first</Typography>
              </Box>
            </Popover>
          </>
        )}

        <Modal
          open={openStickerModal}
          onClose={() => {
            setOpenStickerModal(false);
          }}
        >
          <div style={{ backgroundColor: "white", height: "60vh", width: "40vw", margin: "auto", marginTop: "18vh", overflowY: "scroll" }}>
            <Grid container>
              <Grid xs={12} item style={{ textAlign: "center", position: "relative" }}>
                <Tooltip title="Go Back">
                  <IconButton
                    style={{ position: "absolute", top: "0", left: "0" }}
                    onClick={() => {
                      setOpenStickerModal(false);
                    }}
                  >
                    <KeyboardBackspaceIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="h5">Choose your favourite stickers!</Typography>
              </Grid>
              {/* <Grid item xs={4} style={{ textAlign: "center" }}>
                <Tooltip title="None">
                  <IconButton
                    onClick={() => {
                      setIsStickerSet(false);
                      const roomId = window.location.pathname.split("/")[2];
                      socket.emit("stop-sticker", myId, roomId);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Grid> */}
              {allStickers.map((sticker, key) => {
                //key here is the actual name of the variable/sticker
                const nameOfSticker = Object.keys(sticker)[0];
                return (
                  <Grid key={JSON.stringify(sticker)} item xs={4} style={{ textAlign: "center" }}>
                    <Tooltip title={nameOfSticker}>
                      <IconButton
                        onClick={() => {
                          setOpenStickerModal(false);
                          setIsStickerSet(true);
                          const roomId = window.location.pathname.split("/")[2];
                          socket.emit("start-sticker", myId, roomId, key);
                        }}
                      >
                        <img src={sticker[nameOfSticker]} alt={"sticker"} style={{ width: "5vw", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Modal>
        {isStickerSet && (
          <Tooltip title="stop sticker">
            <IconButton
              onClick={() => {
                setIsStickerSet(false);
                const roomId = window.location.pathname.split("/")[2];
                socket.emit("stop-sticker", myId, roomId);
              }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}
