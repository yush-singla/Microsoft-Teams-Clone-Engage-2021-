import React from "react";
import { Paper, Box, Tooltip, IconButton } from "@material-ui/core";
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
export default function Toolbar({ audio, toggleAudio, classes, sharingScreen, toggleShareScreen, toggleVideo, video, speakerToggle, setSpeakerToggle, setWaitingRoomOpen }) {
  const socket = useSocket();
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
      </Box>
    </Paper>
  );
}
