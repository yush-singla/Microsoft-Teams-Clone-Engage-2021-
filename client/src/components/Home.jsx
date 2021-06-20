import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Button, Box, Paper, makeStyles, TextField, Grid, IconButton, Typography } from "@material-ui/core";
import { ArrowForward, VideoCall } from "@material-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarouselComponent from "./CarouselComponent";
import Typewriter from "typewriter-effect";

const useStyles = makeStyles({
  joinButtons: {
    overflow: "hidden",
  },
  alignButtons: {
    flexDirection: "column-reverse",
  },
  buttonPadding: {
    paddingTop: "12px",
  },
});

export default function Home() {
  const classes = useStyles();
  const [link, setLink] = useState(null);
  const [inputLink, setinputLink] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1190);
  useEffect(() => {
    window.addEventListener("resize", updateIsDesktop);
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
    });
    return () => {
      window.removeEventListener("resize", updateIsDesktop);
    };
  }, []);
  const SearchButton = () => (
    <IconButton
      onClick={() => {
        handleJoin(inputLink);
      }}
    >
      <ArrowForward />
    </IconButton>
  );
  function updateIsDesktop() {
    console.log(window.innerWidth);
    setIsDesktop(window.innerWidth > 1190);
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
    <Box py={2} className={classes.joinButtons}>
      <Grid container spacing={1} className={classes.joinButtons}>
        <Grid item xs={12} md={8}>
          <Box pt={isDesktop ? 7 : 1} ml={isDesktop && 5} mr={isDesktop ? 20 : 1} textAlign="center">
            <Box pt={2} mx={4}>
              <Typography variant="h2">Welcome To Microsoft Teams!</Typography>
              <Box mt={4} mb={6}>
                <Typography variant="h4">Typewriter Typing comes here</Typography>
              </Box>
              {/* <Typewriter
                options={{ loop: true }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("<span>Just Create meeting!</span>")
                    .pauseFor(1000)
                    .deleteChars(15)
                    .typeString("<span>Share the link!</span>")
                    .pauseFor(1000)
                    .deleteChars(15)
                    .typeString("<span> Enjoy the meeting!</span>")
                    .deleteChars(18)
                    .start();
                }}
              /> */}
              <Typography>
                Excepteur ut in minim cillum exercitation culpa. Ex fugiat est irure occaecat mollit velit sit occaecat laborum in. Ex exercitation elit ipsum anim id fugiat cupidatat magna.
              </Typography>
            </Box>
            <Box px={isDesktop ? 2 : 0} overflow="hidden" textAlign="center">
              <Grid container>
                <Grid item xs={12} md={6} className={classes.buttonPadding}>
                  <Button size="large" startIcon={<VideoCall />} variant="contained" color="primary" onClick={handleCreate}>
                    Create New Meet
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box p={1}>
                    <TextField onChange={(e) => setinputLink(e.target.value)} placeholder="Join with Link" InputProps={{ endAdornment: <SearchButton /> }} />
                  </Box>
                </Grid>
                {/* <img style={{ borderRadius: "10%", margin: "auto" }} src="https://picsum.photos/490/240" alt=" is there" /> */}
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} md={4} item>
          <Box textAlign="center" pt={8} pr={3}>
            {/* <img src="https://picsum.photos/560/470" alt="yes" /> */}
            <CarouselComponent />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
