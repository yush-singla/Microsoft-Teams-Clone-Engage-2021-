import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { Drawer, Typography, Divider, Tooltip, Grid, IconButton } from "@material-ui/core";

export default function ShowParticipantsDrawer({ waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission }) {
  return (
    <Drawer
      anchor="right"
      open={waitingRoomOpen}
      onClose={() => {
        setWaitingRoomOpen(false);
      }}
    >
      {" "}
      <Typography variant="h5">Participants</Typography>
      <Divider />
      {videos.map((videoStream, key) => {
        if (videoStream && videoStream.userName)
          return (
            <Typography key={videoStream.userId} variant="p" style={{ overflowWrap: "break-word" }}>
              {videoStream.userName}
            </Typography>
          );
        return null;
      })}
      <Divider />
      <Typography variant="h5">Waiting Room</Typography>
      <Divider />
      {/* <Typography variant="p">Following is a list of people currently in the waiting room</Typography> */}
      {askForPermission.map((request, key) => {
        return (
          <React.Fragment key={Math.floor(Math.random() * 10000)}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="p" style={{ overflowWrap: "break-word" }}>
                  {request.name}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Add to the Meeting">
                  <IconButton
                    onClick={() => {
                      admitToMeeting({ socketId: request.socketId });
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Remove from Waiting Room">
                  <IconButton
                    onClick={() => {
                      denyMeeting({ socketId: request });
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      })}
    </Drawer>
  );
}
