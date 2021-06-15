import React, { useEffect, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import { Redirect } from "react-router";

export default function WaitingRoom() {
  const socket = useSocket();
  console.log("socket is used", socket);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    console.log("requesting access");
    const roomId = window.location.pathname.split("/")[2];
    socket.emit("req-join-room", roomId, ({ status }) => {
      if (status === "invalid room") {
        alert("Link is invalid");
        setStatus("invalid room");
      }
    });
    socket.on("you-are-admitted", () => {
      setStatus("allowed");
      alert("allowed");
    });
  }, []);
  if (status === "invalid room") {
    return <Redirect to="/create" />;
  }
  if (status === "allowed") {
    const link = `/join/${window.location.pathname.split("/")[2]}`;
    return (
      <Redirect
        to={{
          pathname: link,
          state: { from: "/create" },
        }}
      />
    );
  }
  return <div>Waiting for the host to let you in the meet!!</div>;
}
