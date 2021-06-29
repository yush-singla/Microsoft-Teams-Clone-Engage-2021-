import React, { useState, useEffect } from "react";
import { Drawer, Typography, TextField, IconButton, Link, makeStyles, Tooltip, Box, Divider, Select, MenuItem } from "@material-ui/core";
import { useSocket } from "../utils/SocketProvider";
import SendIcon from "@material-ui/icons/Send";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = makeStyles({
  chatTextField: {
    width: "24vw",
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
    maxWidth: "20vw",
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
    maxWidth: "14vw",
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
    maxWidth: "14vw",
    fontFamily: "sans-serif",
  },
});

export default function ChatDrawer({ chatOpen, setChatOpen, chatOpenRef, videos, myId, myNameRef, myPicRef, setShowChatPopUp }) {
  const classes = useStyles();
  const socket = useSocket();
  const [sendTo, setSendTo] = useState("all");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessagges, setChatMessagges] = useState([]);

  useEffect(() => {
    socket.on("recieved-chat", (chat) => {
      if (chatOpenRef.current === false) setShowChatPopUp((prev) => prev + 1);
      else setShowChatPopUp(0);
      setChatMessagges((prev) => [...prev, chat]);
    });
    return () => {
      socket.off("recieved-chat");
    };
  }, []);

  function sendChat() {
    const chat = {
      from: {
        name: myNameRef.current,
        userId: myId,
        picurL: myPicRef.current,
      },
      all: sendTo === "all",
      to: sendTo === "all" ? { roomId: window.location.pathname.split("/")[2] } : JSON.parse(sendTo),
      message: chatMessage,
    };
    setChatMessage("");
    setChatMessagges((prev) => [...prev, chat]);
    socket.emit("send-chat", chat);
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
              <Link href={!word.match(/^[a-zA-Z]+:\/\//) ? "http://" + word : word} target="_blank">
                {word + " "}
              </Link>
            );
          }
          return <Typography component="span">{word + " "}</Typography>;
        })}
      </>
    );
  }

  // {
  //   from:{
  //     name:,
  //     userId,
  //     picurl,
  //   },
  //   all:Boolean
  //   ,
  //   to:{
  //  roomId:roomId
  //     name:,
  //     userId:,
  //   },
  //   message:"",
  // }
  function SendMessageButton() {
    return (
      <IconButton onClick={sendChat}>
        <SendIcon />
      </IconButton>
    );
  }
  return (
    <Drawer
      anchor="right"
      open={chatOpen}
      onClose={() => {
        setChatOpen(false);
        chatOpenRef.current = false;
      }}
    >
      <Box className={classes.chatBox} position="relative">
        <Box textAlign="center">
          <Tooltip title="Go Back">
            <IconButton
              style={{ position: "absolute", top: "0", left: "0" }}
              onClick={() => {
                setChatOpen(false);
              }}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h3">Chats</Typography>
        </Box>
        <Divider />
        {chatMessagges.map((chatMssg, key) => {
          return (
            <Box>
              <Box className={classes.sendedMessageContainer} style={chatMssg.from.userId !== myId ? { marginRight: "auto", textAlign: "left" } : { marginLeft: "auto", textAlign: "right" }}>
                {chatMssg.from.userId !== myId && (
                  <Tooltip title={chatMssg.from.name}>
                    <span style={{ lineHeight: "20%" }}>
                      <img src={chatMssg.from.picurL} style={{ height: "2.5vw", width: "auto", borderRadius: "100%", verticalAlign: "middle" }} alt={"pic"} />
                    </span>
                  </Tooltip>
                )}
                <Typography component="p" variant="p" className={chatMssg.from.userId !== myId ? classes.leftAlignedChat : classes.rightAlignedChat}>
                  <ShowChatMessage message={chatMssg.message} />
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box textAlign="center" className={classes.containerSendTo}>
        <Select
          className={classes.SelectForSendTo}
          value={sendTo}
          onChange={(e) => {
            setSendTo(e.target.value);
          }}
        >
          <MenuItem value="all">To Everyone</MenuItem>
          {videos.map((videoStream, key) => {
            if (videoStream.userId !== myId) return <MenuItem value={JSON.stringify({ name: videoStream.userName, userId: videoStream.userId })}>{videoStream.userName}</MenuItem>;
            return null;
          })}
        </Select>
      </Box>
      <Box>
        <TextField
          className={classes.chatTextField}
          placeholder="Enter Chat Messages"
          InputProps={{
            classes: {
              input: classes.chatText,
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
      </Box>
    </Drawer>
  );
}
