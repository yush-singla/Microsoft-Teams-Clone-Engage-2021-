import React, { useState, useRef } from "react";
import { Paper, Box, Tooltip, IconButton, Badge, Modal, Grid, Typography, Popover, makeStyles } from "@material-ui/core";
import allStickers from "../../utils/StickerProvider";
import { useSocket } from "../../utils/SocketProvider";

//material icons are being imported
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
import ChatIcon from "@material-ui/icons/Chat";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import FaceIcon from "@material-ui/icons/Face";
import ClearIcon from "@material-ui/icons/Clear";
//end  of material ui icons import

const useStyles = makeStyles({
  bottomBar: {
    width: "98%",
    minHeight: "10vh",
    position: "fixed",
    bottom: "2vh",
    backgroundColor: "lightgrey",
  },
  largeIcon: {
    width: 35,
    height: 35,
  },
  iconBg: {
    backgroundColor: "grey",
  },
});

export default function Toolbar({
  audio,
  toggleAudio,
  sharingScreen,
  toggleShareScreen,
  toggleVideo,
  video,
  speakerToggle,
  setSpeakerToggle,
  setWaitingRoomOpen,
  setChatOpen,
  showChatPopUp,
  setShowChatPopUp,
  chatOpenRef,
  myId,
  someOneSharingScreen,
  askForPermission,
  windowWidth,
}) {
  const socket = useSocket();
  const [openStickerModal, setOpenStickerModal] = useState(false);
  const [isStickerSet, setIsStickerSet] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const anchorForPopup = useRef();
  const classes = useStyles();
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

        {windowWidth >= 400 && (
          <Tooltip title={speakerToggle ? "Turn on Speaker" : "Turn off Speaker"}>
            <IconButton
              onClick={() => {
                setSpeakerToggle((prev) => !prev);
              }}
            >
              {speakerToggle ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={"Participants and Waiting room"}>
          <IconButton
            onClick={() => {
              setWaitingRoomOpen(true);
            }}
          >
            {askForPermission.length > 0 ? (
              <Badge color="primary" badgeContent={askForPermission.length}>
                <PeopleIcon />
              </Badge>
            ) : (
              <PeopleIcon />
            )}
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
          <Box style={{ backgroundColor: "white", height: "60vh", width: windowWidth >= 600 ? "40vw" : "80vw", margin: "auto", marginTop: "18vh", overflowY: "scroll" }}>
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

              {allStickers.map((sticker, key) => {
                //key here is the actual name of the variable/sticker
                const nameOfSticker = Object.keys(sticker)[0];
                return (
                  <Grid key={JSON.stringify(sticker)} item xs={6} sm={4} style={{ textAlign: "center" }}>
                    <Tooltip title={nameOfSticker}>
                      <IconButton
                        style={{ minWidth: "10px" }}
                        onClick={() => {
                          setOpenStickerModal(false);
                          setIsStickerSet(true);
                          const roomId = window.location.pathname.split("/")[2];
                          socket.emit("start-sticker", myId, roomId, key);
                        }}
                      >
                        <img src={sticker[nameOfSticker]} alt={"sticker"} style={{ height: "10vh", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
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
