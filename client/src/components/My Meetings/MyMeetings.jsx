import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, setRef } from "@material-ui/core";
import { Redirect } from "react-router";
import { useSocket } from "../../utils/SocketProvider";
import {
  IconButton,
  TextField,
  Paper,
  Grid,
  Box,
  Typography,
  makeStyles,
  Tooltip,
  List,
  ListItemText,
  ListSubheader,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogTitle,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  ListItemAvatar,
  Drawer,
  Avatar,
  Divider,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { titleCase } from "../../functions/titleCase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import VideocamIcon from "@material-ui/icons/Videocam";
import InfoIcon from "@material-ui/icons/Info";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Scrollbars } from "react-custom-scrollbars";
import CancelIcon from "@material-ui/icons/Cancel";
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
const dayIs = ["Mond", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
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
  const [openDialog, setOpenDialog] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [meetingName, setMeetingName] = useState();
  const [allowAnyoneToStart, setAllowAnyoneToStart] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState();
  const [openMeetingInfoDrawer, setOpenMeetingInfoDrawer] = useState(false);
  useEffect(() => {
    console.log("useeffect is here");
    axios.get("/authenticated").then((response) => {
      console.log(response.data.uniqueId);
      uniqueIdRef.current = response.data.uniqueId;
      myData.current = response.data;
      socket.emit("get-prev-meetings", uniqueIdRef.current, (prevMeetingsDetails) => {
        console.log(prevMeetingsDetails, "see these");
        setPrevMeetings(prevMeetingsDetails);
        if (prevMeetingsDetails.length !== 0) {
          selectedRoom.current = prevMeetingsDetails[0];
          getChatMessages(selectedRoom.current.roomId);
        }
      });
    });
  }, []);

  useEffect(() => {
    socket.on("recieved-chat", (chat) => {
      chat.dateTime = new Date(chat.dateTime);
      console.log("gotten-data");
      console.log(chat, selectedRoom.current);
      if (chat.to.roomId === selectedRoom.current.roomId) setChatMessagges((prev) => [...prev, chat]);
    });
    return () => {
      socket.off("recieved-chat");
    };
  }, []);

  const windowWidth = 1000;
  function getChatMessages(roomId) {
    socket.emit("get-chat-data", roomId, (response) => {
      const chatsGottenn = response.messages;
      console.log("got these chats bro", chatsGottenn);
      setChatMessagges([
        ...chatsGottenn.map((eachChat) => {
          console.log({ eachChat });
          return {
            from: {
              name: eachChat.from.name,
              picurL: eachChat.from.picurL,
              uniqueId: eachChat.from.uniqueId,
            },
            dateTime: new Date(eachChat.dateTime),
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

  function joinMeeting() {
    setRedirectTo({ to: `/join/${selectedRoom.current.roomId}`, created: false });
  }
  function createInstantMeeting() {
    console.log("creating meet");
    axios.get("/api/join").then((response) => {
      console.log(response.data);
      setRedirectTo({ to: `/join/${response.data.link}`, created: true, meetingName });
    });
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
      dateTime: new Date(),
      all: true,
      to: { roomId: selectedRoom.current.roomId },
      message: chatMessage,
    };
    setChatMessage("");
    setChatMessagges((prev) => [...prev, chat]);
    socket.emit("send-chat", chat, true);
  }

  function createMeetingForLater() {
    console.log("trying");
    axios.get("/api/join").then((response) => {
      console.log("harder");
      socket.emit(
        "create-room-chat",
        {
          uniqueId: myData.current.uniqueId,
          picurL: myData.current.picurL,
          name: myData.current.name,
          roomId: response.data.link,
          meetingName,
          allowAnyoneToStart,
        },
        (meeting) => {
          console.log("success");
          setPrevMeetings((prev) => [...prev, meeting]);
        }
      );
    });
  }
  function showMeetingInfo() {
    socket.emit("get-room-info", selectedRoom.current.roomId, (roomData) => {
      setMeetingInfo(roomData);
      setOpenMeetingInfoDrawer(true);
    });
  }

  if (redirectTo !== null) {
    console.log(selectedRoom);
    if (redirectTo.created === false && (selectedRoom.current.allowAnyoneToStart || uniqueIdRef.current === selectedRoom.current.host))
      return (
        <Redirect
          to={{
            pathname: redirectTo.to,
            state: { from: "/" },
          }}
        />
      );
    else if (redirectTo.created === false && !selectedRoom.current.allowAnyoneToStart) {
      return (
        <Redirect
          to={{
            pathname: redirectTo.to,
          }}
        />
      );
    } else if (redirectTo.created === true) {
      return <Redirect to={{ pathname: redirectTo.to, state: { from: "/", name: meetingName, creator: true, allowAnyoneToStart: allowAnyoneToStart } }} />;
    }
  }
  // const dialogProps={openDialog,setOpenDialog,createInstantMeeting,createMeetingForLater,}

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby="enter-meeting-name"
      >
        <IconButton
          onClick={() => {
            setOpenDialog(false);
          }}
          style={{ position: "absolute", top: "0", right: "0" }}
        >
          <CancelIcon />
        </IconButton>
        <DialogTitle id="responsive-dialog-title">
          <Grid container>
            <Grid item xs={11} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h6">Create A new Team</Typography>
            </Grid>
            {/* <Grid item xs={1} style={{ textAlign: "right" }}>
              
            </Grid> */}
          </Grid>
        </DialogTitle>
        <DialogContent style={{ overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <TextField
                label="Enter the Team Name"
                value={meetingName}
                onChange={(e) => {
                  setMeetingName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowAnyoneToStart}
                    onChange={(e) => {
                      setAllowAnyoneToStart(e.target.checked);
                    }}
                    name="checkedF"
                    color="primary"
                  />
                }
                label="Allow Anyone to start meeting"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              if (meetingName !== "") {
                setOpenDialog(false);
                createInstantMeeting();
              } else alert("Team Name cannot be empty!");
            }}
            color="primary"
            variant="contained"
          >
            Start Meeting Instantly
          </Button>
          <Button
            onClick={() => {
              if (meetingName !== "") {
                setOpenDialog(false);
                createMeetingForLater();
              } else alert("Team Name cannot be empty!");
            }}
            color="primary"
            autoFocus
            variant="outlined"
          >
            Save Team For Later
          </Button>
        </DialogActions>
      </Dialog>
      {meetingInfo && (
        <Drawer
          onClose={() => {
            setOpenMeetingInfoDrawer(false);
          }}
          anchor="right"
          open={openMeetingInfoDrawer}
        >
          <Box style={{ minWidth: "30vw", maxWidth: "50vw", textAlign: "center" }}>
            <Box textAlign="left">
              <IconButton
                onClick={() => {
                  setOpenMeetingInfoDrawer(false);
                }}
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            </Box>
            <Typography variant="h3" component="span">
              {titleCase(meetingInfo.name)}
            </Typography>
            <Divider />
            <Avatar style={{ height: "8vw", width: "8vw", margin: "2vw auto" }}>
              {titleCase(meetingInfo.name)
                .split(" ")
                .map((x) => x.substr(0, 1))
                .join("")}
            </Avatar>
            <Divider />
            <Grid container>
              <Grid item xs={12} sm={8} style={{ marginTop: "1vh" }}>
                <Typography variant="h5">Copy Invite Link</Typography>
              </Grid>
              <Grid item xs={12} sm={4} style={{ textAlign: "left" }}>
                <CopyToClipboard text={`${window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2]}/invite/${meetingInfo.roomId}`}>
                  <IconButton>
                    <FileCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </Grid>
            </Grid>
            <Divider />

            <Typography variant="h4" style={{ marginTop: "4vh", marginBottom: "3vh" }}>
              Participants
            </Typography>
            <Divider />
            <List>
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
            </List>
          </Box>
        </Drawer>
      )}
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <List
            style={{ height: "90vh", backgroundColor: "white" }}
            aria-labelledby="nested-list-subheader"
            color="primary"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Box>
                  <Grid container>
                    <Grid item xs={9}>
                      <Typography component="span" variant="h6">
                        Your Teams
                      </Typography>
                    </Grid>

                    <Grid xs={3}>
                      <Tooltip title="Create New Team">
                        <IconButton
                          onClick={() => {
                            setMeetingName("");
                            setAllowAnyoneToStart(false);
                            setOpenDialog(true);
                          }}
                          color="primary"
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              </ListSubheader>
            }
            className={classes.root}
          >
            <Scrollbars style={{ height: "82vh" }}>
              {prevMeetings.map((meeting) => {
                return (
                  <ListItem
                    button
                    onClick={() => {
                      selectedRoom.current = meeting;
                      getChatMessages(meeting.roomId);
                    }}
                    style={meeting.roomId === selectedRoom.current?.roomId ? { backgroundColor: "lightgrey" } : { backgroundColor: "white" }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {titleCase(meeting.name)
                          .split(" ")
                          .map((x) => x.substr(0, 1))
                          .join("")}
                      </Avatar>
                    </ListItemAvatar>
                    {/* <ListItemIcon></ListItemIcon> */}
                    <ListItemText primary={titleCase(meeting.name)} />
                  </ListItem>
                );
              })}
            </Scrollbars>
          </List>
        </Grid>
        <Grid item xs={8}>
          <Box height="70vh" style={{ backgroundColor: "white", position: "relative", paddingTop: "10vh" }}>
            {selectedRoom.current && (
              <Box style={{ position: "fixed", top: "2vh", width: "65.2vw", border: "solid lightgrey 2px" }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="span" variant="h4" style={{ width: "40vw" }}>
                      {titleCase(selectedRoom.current.name)}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={2} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                    <Button
                      endIcon={<VideocamIcon />}
                      onClick={() => {
                        joinMeeting();
                      }}
                      size="small"
                      variant="outlined"
                      color="primary"
                    >
                      Join Meet
                    </Button>
                  </Grid>
                  <Grid item xs={1} style={{ textAlign: "center" }}>
                    <Tooltip title="Team Info">
                      <IconButton
                        onClick={() => {
                          showMeetingInfo();
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            )}
            {chatMessagges.length === 0 && <Box>No Messages In This Meeting</Box>}
            <Scrollbars style={{ height: "70vh" }}>
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
                      <Box style={{ color: "lightgrey", textAlign: chatMssg.from.uniqueId !== uniqueIdRef.current ? "left" : "right" }}>
                        {chatMssg.dateTime && chatMssg.dateTime.getHours() + ":" + chatMssg.dateTime.getMinutes() + "," + dayIs[chatMssg.dateTime.getDay() - 1]}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Scrollbars>
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

          {/* <button onClick={createInstantMeeting}>Create Instant New Meeting</button>
          <button onClick={createMeetingForLater}>Create New Meeting for Later</button> */}
        </Grid>
      </Grid>
    </>
  );
}
