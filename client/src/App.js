import React from "react";
import SocketProvider from "./utils/SocketProvider";
import Home from "./components/Home";
import VideoCallArea from "./TestingComponents/VideoCallArea";
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect } from "react-router-dom";
import WaitingRoom from "./TestingComponents/WaitingRoom";
import Authenticate from "./components/Authenticate";
import LoginProvider from "./utils/LoginProvider";
import { useLogin } from "./utils/LoginProvider";
import SignInFirst from "./components/SignInFirst";
import axios from "axios";
import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  return (
    <SocketProvider>
      <LoginProvider>
        <Router>
          <Switch>
            <ProtectedRoute path="/join" component={VideoCallArea} />
            <Route path="/waitingroom">
              <WaitingRoom />
            </Route>
            <Route path="/signinfirst" component={SignInFirst} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </LoginProvider>
    </SocketProvider>
  );
}
