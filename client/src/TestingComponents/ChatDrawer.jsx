import React, { useState, useEffect } from "react";
import { Drawer, Typography, TextField, IconButton, makeStyles, Tooltip, Box, Divider, Select, MenuItem } from "@material-ui/core";
import { useSocket } from "../utils/SocketProvider";
import SendIcon from "@material-ui/icons/Send";

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
    border: "1px solid lightgrey",
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

export default function ChatDrawer({ chatOpen, setChatOpen, videos, myId, myNameRef, myPicRef, setShowChatPopUp }) {
  const classes = useStyles();
  const socket = useSocket();
  const [sendTo, setSendTo] = useState("all");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessagges, setChatMessagges] = useState([]);

  useEffect(() => {
    socket.on("recieved-chat", (chat) => {
      if (chatOpen === false) setShowChatPopUp(true);
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
      }}
    >
      <Box className={classes.chatBox}>
        <Box textAlign="center">
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
                  {chatMssg.message}
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
