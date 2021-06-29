import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Icon, Menu, MenuItem, Button, Box, Paper, makeStyles, TextField, Grid, IconButton, Typography, Modal, AppBar, Toolbar, Divider } from "@material-ui/core";
import { ArrowForward, VideoCall } from "@material-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarouselComponent from "./CarouselComponent";
// import Typewriter from "typewriter-effect";
import GTranslateIcon from "@material-ui/icons/GTranslate";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import { useLogin } from "../utils/LoginProvider";
import handleSignIn from "../utils/handleSignIn";
import chartImg from "../assets/images/chart.png";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const profileIconRef = useRef();
  useEffect(() => {
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
      if (response.data !== "unauthorised") {
        setImgUrl(response.data.picurL);
        // console.log({ isLoggedIn, setIsLoggedIn });
        setIsLoggedIn(true);
      }
      // console.log(isLoggedIn);
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
  function handleLogOut() {
    axios.get("/logout").then((response) => {
      setImgUrl(null);
      setIsLoggedIn(false);
    });
  }

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
  function handleJoin(url) {
    if (isValidHttpUrl(url)) {
      url = new URL(url);
      setLink({ to: url.pathname, created: false });
    } else {
      alert("the link is invalid");
    }
    // console.log(inputLink);
    console.log(link);
  }
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
            <Box pt={isDesktop ? 5 : 1} ml={isDesktop && 5} mr={isDesktop ? 3 : 1} textAlign="left">
              <Box pt={2} pl={3}>
                <Typography variant="h2">Welcome To Microsoft Teams</Typography>
                <Box mt={4} mb={6} style={{ fontSize: "1.6rem", fontWeight: "bolder" }}>
                  <Typography variant="h4">Keeping You Connected</Typography>
                  {/* <Typewriter
                    options={{ loop: true }}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString("<span>Create new Meet!</span>")
                        .pauseFor(1000)
                        .deleteChars(16)
                        .typeString("<span>Share the link!</span>")
                        .pauseFor(1000)
                        .deleteChars(15)
                        .typeString("<span> Enjoy the meeting!</span>")
                        .deleteChars(18)
                        // .typeString("<span>Share your screen</span>")
                        // .deleteChars(17)
                        // .typeString("<span>Built in Chat!</span>")
                        // .deleteChars(14)
                        // .typeString("<span>Cool Stickers</span>")
                        // .deleteChars(13)
                        .start();
                    }}
                  /> */}
                </Box>
                <Typography>
                  Whether it’s chat, calls, or video, anyone can engage at any time, bringing everyone closer. So rest assured your next video call is a slam dunk with a lot of fun.
                </Typography>
              </Box>
              <Box px={isDesktop ? 2 : 0} mt={1} overflow="hidden" textAlign="center">
                <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Grid item xs={12} md={6} className={classes.buttonPadding} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button size="large" startIcon={<VideoCall />} variant="contained" color="primary" onClick={handleCreate}>
                      Create New Meet
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TextField onChange={(e) => setinputLink(e.target.value)} placeholder="Join with Link" InputProps={{ endAdornment: <SearchButton /> }} />
                  </Grid>
                  {/* <img style={{ borderRadius: "10%", margin: "auto" }} src="https://picsum.photos/490/240" alt=" is there" /> */}
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} md={6} item style={{ display: "flex", alignItems: "center" }}>
            <Box textAlign="center" pr={3}>
              <img src={chartImg} style={{ width: "98%" }} alt="yes" />
              {/* <CarouselComponent /> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
