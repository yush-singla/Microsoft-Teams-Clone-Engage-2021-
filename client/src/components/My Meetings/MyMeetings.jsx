import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "@material-ui/core";
import { Redirect } from "react-router";
import { useSocket } from "../../utils/SocketProvider";
import {
  IconButton,
  TextField,
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
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Badge,
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
import { useLogin } from "../../utils/LoginProvider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
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
    height: "75vh",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const profileIconRef = useRef();
  useEffect(() => {
    axios.get("/authenticated").then((response) => {
      setImgUrl(response.data.picurL);
      uniqueIdRef.current = response.data.uniqueId;
      myData.current = response.data;
      socket.emit("get-prev-meetings", uniqueIdRef.current, (prevMeetingsDetails) => {
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
      if (chat.to.roomId === selectedRoom.current.roomId) setChatMessagges((prev) => [...prev, chat]);
    });
    return () => {
      socket.off("recieved-chat");
    };
  }, []);

  function leaveMeeting() {
    socket.emit("leave-team", { uniqueId: uniqueIdRef.current, roomId: selectedRoom.current.roomId });
    setPrevMeetings((prev) => {
      const ans = [...prev.filter((meet) => meet.roomId !== selectedRoom.current.roomId)];
      if (ans.length > 0) selectedRoom.current = ans[0];
      else {
        selectedRoom.current = null;
        setChatMessagges([]);
      }
      return [...ans];
    });
  }

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
    axios.get("/api/join").then((response) => {
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
    axios.get("/api/join").then((response) => {
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
          selectedRoom.current = meeting;
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
  function handleLogOut() {
    axios.get("/logout").then((response) => {
      setImgUrl(null);
      setIsLoggedIn(false);
    });
  }
  if (isLoggedIn === false) {
    return <Redirect to="/" />;
  }
  const UserIcon = ({ url }) => {
    return <img style={{ height: "40px", width: "40px", borderRadius: "100%" }} alt="edit" src={url} />;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box flexDirection="right" flexGrow={1}>
            <Typography variant="h6" className={classes.title}>
              Teams
            </Typography>
          </Box>

          <>
            <IconButton
              onClick={() => {
                setMenuOpen(true);
              }}
              className={classes.profileIcon}
              ref={profileIconRef}
            >
              {imgUrl && <UserIcon url={imgUrl} />}
            </IconButton>
            <Menu
              keepMounted
              anchorEl={profileIconRef.current}
              open={menuOpen}
              onClose={() => {
                setMenuOpen(false);
              }}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
          </>
        </Toolbar>
      </AppBar>

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
            <Grid container>
              <Grid item xs={1}>
                <Box textAlign="left">
                  <IconButton
                    onClick={() => {
                      setOpenMeetingInfoDrawer(false);
                    }}
                  >
                    <KeyboardBackspaceIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={11}>
                <Typography variant="h3" component="span">
                  {titleCase(meetingInfo.name)}
                </Typography>
              </Grid>
            </Grid>

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
              Members
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
            <Typography> {meetingInfo.allowAnyoneToStart === true ? "(Members can start the meet before host)" : "(Only Host can start the meet)"} </Typography>
          </Box>
        </Drawer>
      )}
      <Grid container spacing={1} style={{ marginTop: "1vh", paddingTop: "2vh" }}>
        <Grid item xs={3} style={{ paddingLeft: "2vw" }}>
          <List
            style={{ height: "78vh", backgroundColor: "white", border: "solid lightgrey 1px" }}
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
            <Scrollbars style={{ height: "68vh" }}>
              {prevMeetings.map((meeting, key) => {
                return (
                  <ListItem
                    button
                    key={prevMeetings.roomId}
                    onClick={() => {
                      selectedRoom.current = meeting;
                      getChatMessages(meeting.roomId);
                    }}
                    style={{ backgroundColor: meeting.roomId === selectedRoom.current?.roomId ? "lightgrey" : "white", marginTop: key === 0 ? "1vh" : "auto" }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={meeting.badgeContent === undefined ? 0 : meeting.badgeContent} color="primary">
                        <Avatar>
                          {titleCase(meeting.name)
                            .split(" ")
                            .map((x) => x.substr(0, 1))
                            .join("")}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={titleCase(meeting.name)} />
                  </ListItem>
                );
              })}
            </Scrollbars>
          </List>
        </Grid>
        <Grid item xs={9} style={{ paddingLeft: "2vw", paddingRight: "7vw" }}>
          <Box height="58vh" style={{ backgroundColor: "white", position: "relative", paddingTop: "8vh" }}>
            {selectedRoom.current && (
              <Box style={{ position: "fixed", zIndex: "1000", top: "16vh", width: "65.2vw", backgroundColor: "white", border: "solid lightgrey 2px" }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component="span" variant="h4" style={{ width: "40vw" }}>
                      {titleCase(selectedRoom.current.name)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}></Grid>
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
                  <Grid item xs={2} style={{ textAlign: "center" }}>
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
                  <Grid item xs={1}>
                    <Tooltip title="Leave Meeting">
                      <IconButton
                        onClick={() => {
                          leaveMeeting();
                        }}
                      >
                        <ExitToAppIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            )}
            {prevMeetings.length === 0 && (
              <Box style={{ padding: "10vh 1vw", textAlign: "center" }}>
                <Typography variant="h4">Create Your First Team And Engage with your Colleagues</Typography>
                <Box style={{ marginTop: "3vh" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setMeetingName("");
                      setAllowAnyoneToStart(false);
                      setOpenDialog(true);
                    }}
                  >
                    Create My Team
                  </Button>
                </Box>
              </Box>
            )}
            {prevMeetings.length > 0 && chatMessagges.length === 0 && <Box mt={4}>No Messages In This Meeting</Box>}
            <Scrollbars style={{ height: "58vh" }}>
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
                        <Box style={{ color: "lightgray", fontWeight: "bolder", fontSize: "0.8rem", textAlign: chatMssg.from.uniqueId !== uniqueIdRef.current ? "left" : "right" }}>
                          {titleCase(chatMssg.from.name)}
                        </Box>
                      )}
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
          {prevMeetings.length > 0 && selectedRoom.current && (
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
          )}

          {/* <button onClick={createInstantMeeting}>Create Instant New Meeting</button>
          <button onClick={createMeetingForLater}>Create New Meeting for Later</button> */}
        </Grid>
      </Grid>
    </>
  );
}
