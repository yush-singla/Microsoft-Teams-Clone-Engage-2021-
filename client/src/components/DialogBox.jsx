import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
//end

export default function AlertDialog(props) {
  const handleClose = () => {
    props.setOpenDialogBox(false);
  };
  return (
    <div>
      {console.log(props)}
      <Dialog open={props.openDialogBox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{`${props.name} want to join the meet`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.name} has been added to the waiting area, what should be done</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.admitToMeeting({ socketId: props.id });
              handleClose();
            }}
            color="primary"
          >
            Admit
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            keep in waiting room o
          </Button>
          <Button
            onClick={() => {
              props.denyMeeting({ socketId: props.id });
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Deny
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
