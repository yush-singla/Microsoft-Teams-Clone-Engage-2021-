import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "@material-ui/core";
import { useSocket } from "../../utils/SocketProvider";
import { IconButton, TextField, Paper, Grid, Box, Typography, makeStyles, Tooltip, List, ListItemText, ListSubheader, ListItem } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
const useStyles = makeStyles({
  chatTextFieldPc: {
    width: "50vw",
    paddingLeft: "1vw",
    paddingRight: "3vw",
  },
  chatTextFieldMobile: {
    width: "55vw",
    paddingLeft: "1vw",
    paddingRight: "3vw",
  },
  chatText: {
    fontWeight: "normal",
  },
  SelectForSendTo: {
    minWidth: "18vw",
  },
  sendedMessageContainer: {
    padding: "2%",
    maxWidth: window.innerWidth > 900 ? "20vw" : "80%",
  },
  chatBox: {
    height: "85vh",
    minWidth: "28vw",
    overflowY: "scroll",
  },
  leftAlignedChat: {
    borderRadius: "20px",
    textAlign: "left",
    backgroundColor: "white",
    padding: "3%",
    paddingRight: "8%",
    paddingLeft: "6%",
    margin: "3%",
    wordWrap: "break-word",
    display: "inline-block",
    minWidth: "10vw",
    maxWidth: window.innerWidth >= 900 ? "14vw" : "60vw",
    border: "1px solid grey",
  },
  rightAlignedChat: {
    borderRadius: "20px",
    textAlign: "right",
    backgroundColor: "#eee",
    padding: "3%",
    paddingRight: "5%",
    paddingLeft: "8%",
    margin: "3%",
    wordWrap: "break-word",
    display: "inline-block",
    minWidth: "10vw",
    maxWidth: window.innerWidth >= 900 ? "14vw" : "60vw",
    fontFamily: "sans-serif",
  },
});

export default function MyMeetings() {
  const classes = useStyles();
  // const classes = {};
  const socket = useSocket();
  const [prevMeetings, setPrevMeetings] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessagges, setChatMessagges] = useState([]);
  const uniqueIdRef = useRef();
  const myData = useRef();
  const selectedRoom = useRef();
  useEffect(() => {
    console.log("useeffect is here");
    axios.get("/authenticated").then((response) => {
      console.log(response.data.uniqueId);
      uniqueIdRef.current = response.data.uniqueId;
      myData.current = response.data;
      socket.emit("get-prev-meetings", uniqueIdRef.current, (prevMeetingsDetails) => {
        console.log(prevMeetingsDetails, "see these");
        setPrevMeetings(prevMeetingsDetails);
      });
    });
  }, []);

  useEffect(() => {
    socket.on("recieved-chat", (chat) => {
      console.log(chat, selectedRoom.current);
      if (chat.to === selectedRoom.current) setChatMessagges((prev) => [...prev, chat]);
    });
    return () => {
      socket.off("recieved-chat");
    };
  }, []);

  const windowWidth = 1000;
  function getChatMessages(roomId) {
    socket.emit("get-chat-data", roomId, (response) => {
      const chatsGottenn = response.messages;
      setChatMessagges([
        ...chatsGottenn.map((eachChat) => {
          return {
            from: {
              name: eachChat.from.name,
              picurL: eachChat.from.picurL,
              uniqueId: eachChat.from.uniqueId,
            },
            message: eachChat.content,
          };
        }),
      ]);
    });
  }
  function isUrl(s) {
    var regexp =
      /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
    return regexp.test(s);
  }

  function ShowChatMessage({ message }) {
    const words = message.split(" ");
    return (
      <>
        {words.map((word, key) => {
          if (isUrl(word)) {
            return (
              <Link key={key} href={!word.match(/^[a-zA-Z]+:\/\//) ? "http://" + word : word} target="_blank">
                {word + " "}
              </Link>
            );
          }
          return (
            <Typography key={key} component="span">
              {word + " "}
            </Typography>
          );
        })}
      </>
    );
  }
  function SendMessageButton() {
    return (
      <IconButton
        onClick={() => {
          sendChat();
        }}
      >
        <SendIcon />
      </IconButton>
    );
  }
  function sendChat() {
    const chat = {
      from: {
        name: myData.current.name,
        uniqueId: myData.current.uniqueId,
        picurL: myData.current.picurL,
      },
      all: true,
      to: { roomId: selectedRoom.current },
      message: chatMessage,
    };
    setChatMessage("");
    setChatMessagges((prev) => [...prev, chat]);
    socket.emit("send-chat", chat, true);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Paper style={{ height: "92vh" }}>
          <List
            style={{ overflowY: "scroll", height: "90vh" }}
            aria-labelledby="nested-list-subheader"
            color="primary"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Nested List Items
              </ListSubheader>
            }
            className={classes.root}
          >
            {prevMeetings.map((meeting) => {
              return (
                <ListItem
                  button
                  onClick={() => {
                    selectedRoom.current = meeting;
                    getChatMessages(meeting);
                  }}
                  color="primary"
                >
                  {/* <ListItemIcon>
                  <SendIcon />
                </ListItemIcon> */}
                  <ListItemText primary={meeting} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Box height="80vh" style={{ backgroundColor: "white", overflowY: "scroll" }}>
          {chatMessagges.length === 0 && <Box>No Messages In This Meeting</Box>}
          {chatMessagges.map((chatMssg, key) => {
            return (
              <Box key={key}>
                <Box
                  className={classes.sendedMessageContainer}
                  style={
                    chatMssg.from.uniqueId !== uniqueIdRef.current
                      ? { marginRight: "auto", textAlign: "left", maxWidth: windowWidth > 900 ? "20vw" : "80%" }
                      : { marginLeft: "auto", textAlign: "right", maxWidth: windowWidth > 900 ? "20vw" : "80%" }
                  }
                >
                  {chatMssg.from.uniqueId !== uniqueIdRef.current && (
                    <Tooltip title={chatMssg.from.name}>
                      <span style={{ lineHeight: "20%" }}>
                        <img src={chatMssg.from.picurL} style={{ height: "6vh", width: "auto", borderRadius: "100%", verticalAlign: "middle" }} alt={"pic"} />
                      </span>
                    </Tooltip>
                  )}
                  <Typography
                    component="p"
                    variant="p"
                    className={chatMssg.from.uniqueId !== uniqueIdRef.current ? classes.leftAlignedChat : classes.rightAlignedChat}
                    style={{ maxWidth: windowWidth >= 900 ? "14vw" : "60vw" }}
                  >
                    <ShowChatMessage message={chatMssg.message} />
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
        <TextField
          className={windowWidth >= 900 ? classes.chatTextPc : classes.chatTextFieldMobile}
          style={{ marginLeft: "2vw", marginTop: "3vh" }}
          placeholder="Enter Chat Messages"
          InputProps={{
            classes: {
              input: windowWidth >= 900 ? classes.chatTextFieldPc : classes.chatTextFieldMobile,
            },
            endAdornment: <SendMessageButton />,
          }}
          value={chatMessage}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && chatMessage !== "") sendChat();
          }}
        />
      </Grid>
    </Grid>
  );
}
