import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default function Home() {
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
    <div>
      <button onClick={handleJoin}>Create New Meet</button>
    </div>
  );
}
