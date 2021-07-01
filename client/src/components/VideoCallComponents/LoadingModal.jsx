import React from "react";
import { Modal, Typography } from "@material-ui/core";
import Loader from "react-loader-spinner";
export default function LoadingModal({ loadingScreen }) {
  return (
    <Modal open={loadingScreen}>
      <div style={{ position: "absolute", top: "35vh", left: "43vw", textAlign: "center" }}>
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={100000} />
        <Typography style={{ color: "white" }}>Admitting new Participant</Typography>
      </div>
    </Modal>
  );
}
