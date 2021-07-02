import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { Drawer, Typography, Divider, Tooltip, Grid, IconButton, Box, makeStyles } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
const useStyles = makeStyles({
  participants: {
    paddingLeft: "20%",
    height: "40vh",
    overflowY: "scroll",
  },
});

export default function ShowParticipantsDrawer({ myId, waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission, windowWidth }) {
  const classes = useStyles();
  return (
    <Drawer
      anchor="right"
      open={waitingRoomOpen}
      onClose={() => {
        setWaitingRoomOpen(false);
      }}
    >
      {console.log(windowWidth)}
      <Box style={{ minWidth: windowWidth >= 900 ? "30vw" : windowWidth >= 500 ? "65vw" : "88vw" }}>
        <Box textAlign="center" position="relative">
          <Tooltip title="Go Back">
            <IconButton
              style={{ position: "absolute", top: "0", left: "0" }}
              onClick={() => {
                setWaitingRoomOpen(false);
              }}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="span">
            Participants
          </Typography>
        </Box>
        <Divider />
        <Box className={classes.participants}>
          {videos.map((videoStream, key) => {
            if (videoStream && videoStream.userName)
              return (
                <Box style={{ display: "table", padding: "10px" }}>
                  <img src={videoStream.picurL} style={{ height: "6vh", width: "auto", borderRadius: "100%", display: "table-cell", verticalAlign: "middle" }} alt="pic of" />{" "}
                  <Typography
                    key={videoStream.userId}
                    component="span"
                    style={{ marginLeft: "10px", fontSize: "1.3rem", overflowWrap: "break-word", display: "table-cell", verticalAlign: "middle", paddingLeft: "10px" }}
                  >
                    {videoStream.userId !== myId ? videoStream.userName : "You"}
                  </Typography>
                </Box>
              );
            return null;
          })}
        </Box>
        <Divider />
        <Box textAlign="center">
          <Typography variant="h4">Waiting Room</Typography>
        </Box>
        <Divider />
        <Box style={{ overflowY: "scroll" }}>
          {askForPermission.map((request, key) => {
            return (
              <React.Fragment key={Math.floor(Math.random() * 10000)}>
                <Grid container>
                  <Grid item xs={8}>
                    <Box textAlign="center" pt={1}>
                      <Typography style={{ fontSize: "1.3rem", overflowWrap: "break-word" }}>{request.name}</Typography>
                    </Box>
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
                          denyMeeting({ socketId: request.socketId });
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
        </Box>
      </Box>
    </Drawer>
  );
}
