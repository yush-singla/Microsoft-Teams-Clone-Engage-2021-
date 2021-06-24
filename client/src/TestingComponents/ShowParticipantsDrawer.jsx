import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { Drawer, Typography, Divider, Tooltip, Grid, IconButton, Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  mainBox: {
    minWidth: "25vw",
  },
  participants: {
    paddingLeft: "20%",
    height: "40vh",
    overflowY: "sroll",
  },
});

export default function ShowParticipantsDrawer({ waitingRoomOpen, setWaitingRoomOpen, videos, admitToMeeting, denyMeeting, askForPermission }) {
  const classes = useStyles();
  return (
    <Drawer
      anchor="right"
      open={waitingRoomOpen}
      onClose={() => {
        setWaitingRoomOpen(false);
      }}
    >
      <Box className={classes.mainBox}>
        <Box textAlign="center">
          <Typography variant="h4">Participants</Typography>
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
                    {videoStream.userName}
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
      </Box>
    </Drawer>
  );
}
