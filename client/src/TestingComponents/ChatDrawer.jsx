import React, { useState, useEffect } from "react";
import { Drawer, Typography, TextField, IconButton, makeStyles, Box, Divider, Select, MenuItem } from "@material-ui/core";
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
  containerSendTo: {},
  chatBox: {
    height: "85vh",
    minWidth: "28vw",
  },
});

export default function ChatDrawer({ chatOpen, setChatOpen, videos, myId, myNameRef }) {
  const classes = useStyles();
  const socket = useSocket();
  const [sendTo, setSendTo] = useState("all");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessagges, setChatMessagges] = useState([]);

  useEffect(() => {
    socket.on("recieved-chat", (chat) => {
      setChatMessagges((prev) => [...prev, chat]);
    });
  }, []);

  function sendChat() {
    const chat = {
      from: {
        name: myNameRef.current,
        userId: myId,
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
              <Typography>{chatMssg.message}</Typography>
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
