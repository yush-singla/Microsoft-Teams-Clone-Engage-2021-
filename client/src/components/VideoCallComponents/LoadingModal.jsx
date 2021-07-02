import React from "react";
import { Modal, Typography } from "@material-ui/core";
import Loader from "react-loader-spinner";
export default function LoadingModal({ loadingScreen, content }) {
  return (
    <Modal open={loadingScreen}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={100000} />
        <Typography style={{ color: "white" }}>{content}</Typography>
      </div>
    </Modal>
  );
}
