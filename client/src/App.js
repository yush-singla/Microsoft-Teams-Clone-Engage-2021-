import React from "react";
import SocketProvider from "./utils/SocketProvider";
import Home from "./components/Home";
import VideoCallArea from "./TestingComponents/VideoCallArea";
import { BrowserRouter as Router, Switch, Route, useLocation, Redirect } from "react-router-dom";
import WaitingRoom from "./TestingComponents/WaitingRoom";

function ProtectedRoute({ children, ...rest }) {
  const { state } = useLocation();
  console.log(state);
  if (state && state.from === "/create") return <Route {...rest}>{children}</Route>;
  else return <Redirect to={`/waitingroom/${window.location.pathname.split("/")[2]}`} />;
}

export default function App() {
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <ProtectedRoute path="/join">
            <VideoCallArea />
          </ProtectedRoute>
          <Route path="/create" component={Home} />
          <Route path="/waitingroom">
            <WaitingRoom />
          </Route>
        </Switch>
      </Router>
    </SocketProvider>
  );
}
