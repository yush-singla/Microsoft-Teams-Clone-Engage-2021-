import React from "react";
import SocketProvider from "./utils/SocketProvider";
import Home from "./components/Home/Home";
import VideoCallArea from "./components/VideoCallArea";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WaitingRoom from "./components/WaitingRoom";
import LoginProvider from "./utils/LoginProvider";
import SignInFirst from "./components/Home/SignInFirst";
import ProtectedRoute from "./utils/ProtectedRoute";
import MyMeetings from "./components/My Meetings/MyMeetings";
import MeetingDetails from "./components/My Meetings/MeetingDetails";
import HomeL from "./components/LearnMore/pages";

export default function App() {
  return (
    <SocketProvider>
      <LoginProvider>
        <Router>
          <Switch>
            <ProtectedRoute path="/join" component={VideoCallArea} />
            <Route path="/invite" component={MeetingDetails} />
            <Route path="/waitingroom">
              <WaitingRoom />
            </Route>
            <Route path="/signinfirst" component={SignInFirst} />
            <Route path="/mymeetings" component={MyMeetings} />
            <Route path="/learnmore" component={HomeL} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </LoginProvider>
    </SocketProvider>
  );
}
