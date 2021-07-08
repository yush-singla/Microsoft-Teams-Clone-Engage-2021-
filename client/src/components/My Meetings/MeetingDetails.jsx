import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLogin } from "./../../utils/LoginProvider";
import { Redirect } from "react-router";
import { useSocket } from "../../utils/SocketProvider";
import { Button, Grid, Box, Typography, List, ListItemText, ListItem, ListItemAvatar, Avatar, Divider } from "@material-ui/core";
import { titleCase } from "../../functions/titleCase";
import { Scrollbars } from "react-custom-scrollbars";
import QueueIcon from "@material-ui/icons/Queue";
export default function MeetingDetails() {
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const [verified, setVerified] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const socket = useSocket();
  const myData = useRef();
  const [joined, setJoined] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState();
  useEffect(() => {
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
      if (response.data !== "unauthorised") {
        setIsLoggedIn(true);
        myData.current = response.data;
        socket.emit("get-room-info", window.location.pathname.split("/")[2], (roomData) => {
          console.log(roomData);
          if (roomData === null) {
            alert("the room is invalid!");
            setRedirectToHome(true);
          } else {
            setMeetingInfo(roomData);
          }
        });
      }
      setVerified(true);
    });
  }, []);

  function joinTeam() {
    socket.emit("join-room-chat", window.location.pathname.split("/")[2], myData.current);
    setJoined(true);
  }

  if (redirectToHome) {
    return <Redirect to="/" />;
  }
  if (verified === true && isLoggedIn === false) {
    //redirect to sign in first
    return <Redirect to={{ pathname: "/signinfirst", state: { from: window.location.pathname, prevFrom: "invite" } }} />;
  }
  if (joined) {
    alert("you have successfully joined the room!");
    return <Redirect to="/" />;
  }
  if (meetingInfo) {
    return (
      <Box style={{ textAlign: "center", maxWidth: "80vw", margin: "auto" }}>
        <Typography variant="h4" component="span">
          {titleCase(meetingInfo.name)}
        </Typography>
        <Divider />
        <Avatar style={{ height: "4vw", width: "4vw", margin: "1.5vw auto" }}>
          {titleCase(meetingInfo.name)
            .split(" ")
            .map((x) => x.substr(0, 1))
            .join("")}
        </Avatar>
        <Divider />

        <Typography variant="h5" style={{ marginTop: "4vh", marginBottom: "1.5vh" }}>
          Participants
        </Typography>
        <Divider />
        <Box style={{ width: "50vw", margin: "auto", border: "solid 1px lightgrey" }}>
          <List>
            <Scrollbars style={{ height: "35vh" }}>
              {meetingInfo.participants.map((participant) => {
                return (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={participant.picurL} />
                    </ListItemAvatar>
                    <ListItemText primary={titleCase(participant.name)} secondary={meetingInfo.host === participant.uniqueId ? "Host" : "Member"} />
                  </ListItem>
                );
              })}
            </Scrollbars>
          </List>
        </Box>
        <Button
          startIcon={<QueueIcon />}
          onClick={() => {
            joinTeam();
          }}
          color="primary"
          variant="contained"
          style={{ marginTop: "2vh" }}
        >
          Join Team
        </Button>
      </Box>
    );
  }
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
