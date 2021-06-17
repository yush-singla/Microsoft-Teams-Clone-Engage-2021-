import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Button, Box, Paper, makeStyles, TextField, Grid, IconButton, Typography } from "@material-ui/core";
import { ArrowForward, VideoCall } from "@material-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarouselComponent from "./CarouselComponent";

const useStyles = makeStyles({
  joinButtons: {
    overflow: "hidden",
  },
  alignButtons: {
    flexDirection: "column-reverse",
  },
  buttonPadding: {
    paddingTop: "24px",
  },
});
export default function Home() {
  const SearchButton = () => (
    <IconButton>
      <ArrowForward />
    </IconButton>
  );
  const classes = useStyles();
  const [link, setLink] = useState(null);
  function handleJoin() {
    axios
      .get("/api/join")
      .then((response) => {
        setLink(`/join/${response.data.link}`);
      })
      .catch((error) => console.log(error));
  }
  if (link) {
    return (
      <Redirect
        to={{
          pathname: link,
          state: { from: "/create" },
        }}
      />
    );
  }
  return (
    <Box py={2} className={classes.joinButtons}>
      <Grid container spacing={1} className={classes.joinButtons}>
        <Grid item xs={12} md={6}>
          <Box textAlign="center">
            <Box pt={2}>
              <Typography variant="h2">Welcome To Yush meet</Typography>
              <Typography>
                Excepteur ut in minim cillum exercitation culpa. Ex fugiat est irure occaecat mollit velit sit occaecat laborum in. Ex exercitation elit ipsum anim id fugiat cupidatat magna.
              </Typography>
            </Box>
            <Box pt={2} pr={4} overflow="hidden">
              <Grid container p={5}>
                <Grid item xs={12} md={6} className={classes.buttonPadding}>
                  <Button startIcon={<VideoCall />} variant="contained" color="primary" onClick={handleJoin}>
                    Create New Meet
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box p={1}>
                    <TextField label="Join with code or link" InputProps={{ endAdornment: <SearchButton /> }} />
                  </Box>
                </Grid>
              </Grid>
              <img style={{ borderRadius: "10%" }} src="https://picsum.photos/490/240" alt=" is there" />
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} md={6} item>
          <Box textAlign="center" pt={10}>
            {/* <img src="https://picsum.photos/560/470" alt="yes" /> */}
            <CarouselComponent />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
// import React from "react";
// import IconButton from "@material-ui/core/IconButton";
// import SearchIcon from "@material-ui/icons/Search";
// import TextField from "@material-ui/core/TextField";

// export default function CustomizedTextField() {

//   return <TextField id="standard-name" label="Name" value="hello" InputProps={{ endAdornment: <SearchButton /> }} />;
// }
