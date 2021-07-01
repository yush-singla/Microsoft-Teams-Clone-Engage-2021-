import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Menu, MenuItem, Button, Box, Paper, makeStyles, TextField, Grid, IconButton, Typography, Modal, AppBar, Toolbar, Divider } from "@material-ui/core";
import { ArrowForward, VideoCall } from "@material-ui/icons";
import { useLogin } from "../../utils/LoginProvider";
import handleSignIn from "../../utils/handleSignIn";
import chartImg from "../../assets/images/chart.png";

//material ui icons
import GTranslateIcon from "@material-ui/icons/GTranslate";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles({
  joinButtons: {
    overflow: "hidden",
  },
  alignButtons: {
    flexDirection: "column-reverse",
  },
  Modal: {
    position: "absolute",
    top: "35vh",
    left: "35vw",
    right: "35vw",
    minWidth: "30%",
    backgroundColor: "white",
    paddingBottom: "2%",
  },
  signInButtons: {
    width: "88%",
  },
  profileIcon: {
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    "&:active": {
      visibility: "visible",
    },
  },
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const classes = useStyles();
  const [link, setLink] = useState(null);
  const [inputLink, setinputLink] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1190);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const profileIconRef = useRef();
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
      if (response.data !== "unauthorised") {
        setImgUrl(response.data.picurL);
        setIsLoggedIn(true);
      }
    });
  }, []);
  const UserIcon = ({ url }) => {
    console.log({ url });
    return <img style={{ height: "40px", width: "40px", borderRadius: "100%" }} alt="edit" src={url} />;
  };
  const SearchButton = () => (
    <IconButton
      onClick={() => {
        handleJoin(inputLink);
      }}
    >
      <ArrowForward />
    </IconButton>
  );

  //requests the server to logout the person
  function handleLogOut() {
    axios.get("/logout").then((response) => {
      setImgUrl(null);
      setIsLoggedIn(false);
    });
  }

  //requests the server to create a new meeting for the client
  function handleCreate() {
    axios
      .get("/api/join")
      .then((response) => {
        setLink({ to: `/join/${response.data.link}`, created: true });
      })
      .catch((error) => console.log(error));
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  //handles when user joins through links
  function handleJoin(url) {
    if (isValidHttpUrl(url)) {
      url = new URL(url);
      setLink({ to: url.pathname, created: false });
    } else {
      alert("the link is invalid");
      setinputLink("");
    }
  }

  //this is the link to the meeting, the user is redirected to it, when he creates the meeting
  if (link) {
    return (
      <Redirect
        to={{
          pathname: link.to,
          state: link.created && { from: "/" },
        }}
      />
    );
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box flexDirection="right" flexGrow={1}>
            <Typography variant="h6" className={classes.title}>
              Teams
            </Typography>
          </Box>
          {isLoggedIn && imgUrl ? (
            <>
              <IconButton
                onClick={() => {
                  setMenuOpen(true);
                }}
                className={classes.profileIcon}
                ref={profileIconRef}
              >
                <UserIcon url={imgUrl} />
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
          ) : (
            <Button
              onClick={() => {
                setModalOpen(true);
              }}
              color="inherit"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Paper className={classes.Modal}>
          <Box textAlign="center">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">Sign In </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button className={classes.signInButtons} color="secondary" variant="contained" startIcon={<GTranslateIcon />} onClick={() => handleSignIn("google")}>
                  Google
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button className={classes.signInButtons} color="primary" variant="contained" startIcon={<FacebookIcon />} onClick={() => handleSignIn("facebook")}>
                  Facebook
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button className={classes.signInButtons} color="default" variant="contained" startIcon={<GitHubIcon />} onClick={() => handleSignIn("github")}>
                  Github
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Modal>
      <Box py={2} className={classes.joinButtons}>
        <Grid container spacing={1} className={classes.joinButtons}>
          <Grid item xs={12} md={6}>
            <Box style={windowWidth >= 980 ? { paddingTop: "5vh", marginLeft: "5vw", marginRight: "3vw" } : { paddingTop: "1vh", marginLeft: "1vw", marginRight: "1vw" }} textAlign="left">
              <Box style={{ paddingTop: "2vh", paddingLeft: "3vw" }}>
                <Typography variant="h2">Welcome To Microsoft Teams</Typography>
                <Box style={{ fontSize: "1.6rem", fontWeight: "bolder", marginTop: "3.5vh", marginBottom: "5vh" }}>
                  <Typography variant="h4">Keeping You Connected</Typography>
                </Box>
                <Typography>
                  Whether it’s chat, calls, or video, anyone can engage at any time, bringing everyone closer. So rest assured your next video call is a slam dunk with a lot of fun.
                </Typography>
              </Box>
              <Box style={{ paddingLeft: "2vw", marginTop: "1vh" }} overflow="hidden" textAlign="center">
                <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "4.2vh" }}>
                  <Grid item xs={12} md={6} className={classes.buttonPadding} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button size="large" startIcon={<VideoCall />} variant="contained" color="primary" onClick={handleCreate}>
                      {windowWidth >= 1136 ? "Create New Meet" : "Create Meet"}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TextField
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleJoin(inputLink);
                      }}
                      value={inputLink}
                      onChange={(e) => setinputLink(e.target.value)}
                      placeholder="Join with Link"
                      InputProps={{ endAdornment: <SearchButton /> }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} md={6} item style={{ display: "flex", alignItems: "center" }}>
            <Box textAlign="center" pr={3}>
              <img src={chartImg} style={{ width: "98%" }} alt="yes" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
