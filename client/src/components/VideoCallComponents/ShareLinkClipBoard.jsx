import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { DialogActions } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function ShareLinkClipBoard({ openShareLink, setOpenShareLink }) {
  return (
    <div>
      <Dialog
        open={openShareLink}
        onClose={() => {
          setOpenShareLink(false);
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Invite Others!!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Invite others to join the meet just by copying this link.</DialogContentText>
          <DialogContentText>
            <CopyToClipboard
              text={window.location.href}
              onCopy={() => {
                setOpenShareLink(false);
              }}
            >
              <Button color="primary">Copy Meeting Link</Button>
            </CopyToClipboard>
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenShareLink(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
