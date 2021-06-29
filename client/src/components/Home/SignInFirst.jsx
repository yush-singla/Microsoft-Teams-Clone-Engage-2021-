import React from "react";
import { Paper, Grid, Box, Typography, Divider, Button, makeStyles } from "@material-ui/core";
import GTranslateIcon from "@material-ui/icons/GTranslate";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import handleSignIn from "../../utils/handleSignIn";
const useStyles = makeStyles({
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
});

export default function SignInFirst(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.Modal}>
      <Box textAlign="center">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Sign In </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              className={classes.signInButtons}
              color="secondary"
              variant="contained"
              startIcon={<GTranslateIcon />}
              onClick={() => handleSignIn("google", props.location.state.from, props.location.state.prevFrom)}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              className={classes.signInButtons}
              color="primary"
              variant="contained"
              startIcon={<FacebookIcon />}
              onClick={() => handleSignIn("facebook", props.location.state.from, props.location.state.prevFrom)}
            >
              Facebook
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              className={classes.signInButtons}
              color="default"
              variant="contained"
              startIcon={<GitHubIcon />}
              onClick={() => handleSignIn("github", props.location.state.from, props.location.state.prevFrom)}
            >
              Github
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
