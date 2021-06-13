import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Home() {
  let history = useHistory();
  function handleJoin() {
    axios
      .get("http://localhost:5000/api/join")
      .then((response) => {
        history.push(`/join/${response.data.link}`);
      })
      .catch((error) => console.log(error));
  }
  return (
    <div>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}
