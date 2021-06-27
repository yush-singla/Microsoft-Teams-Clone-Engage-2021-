import React, { useState } from "react";
import { Paper, Box, Tooltip, IconButton, Badge, Modal, Grid, Typography } from "@material-ui/core";
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
}) {
  const socket = useSocket();
  const [openStickerModal, setOpenStickerModal] = useState(false);
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
        <button
          type="button"
          onClick={() => {
            setOpenStickerModal(true);
          }}
        >
          Add Sticker
        </button>
        <Modal
          open={openStickerModal}
          onClose={() => {
            setOpenStickerModal(false);
          }}
        >
          <div style={{ backgroundColor: "white", height: "60vh", width: "40vw", margin: "auto", marginTop: "18vh", overflowY: "scroll" }}>
            <Grid container>
              <Grid xs={12} item style={{ textAlign: "center" }}>
                <Typography variant="h4">Choose your favourite stickers!</Typography>
              </Grid>
              {allStickers.map((sticker, key) => {
                return (
                  <>
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => {
                          setOpenStickerModal(false);
                          const roomId = window.location.pathname.split("/")[2];
                          socket.emit("start-sticker", myId, roomId, key);
                        }}
                      >
                        <img src={sticker} alt={"sticker"} style={{ width: "5vw" }} />
                      </IconButton>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </div>
        </Modal>
        <button
          onClick={() => {
            const roomId = window.location.pathname.split("/")[2];
            socket.emit("stop-sticker", myId, roomId);
          }}
        >
          Stop Sticker
        </button>
      </Box>
    </Paper>
  );
}
