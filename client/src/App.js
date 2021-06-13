import React from "react";
import SocketProvider from "./utils/SocketProvider";
import Home from "./components/Home";
import VideoCallArea from "./TestingComponents/VideoCallArea";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <Route path="/join" component={VideoCallArea} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </SocketProvider>
  );
}
