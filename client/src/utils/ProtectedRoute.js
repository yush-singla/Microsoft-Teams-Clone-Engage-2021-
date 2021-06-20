import { useLogin } from "./LoginProvider";
import { useLocation, Redirect, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
export default function ProtectedRoute({ component: Component, ...rest }) {
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const { state } = useLocation();
  const [verifiedFromServer, setVerifiedFromServer] = useState(false);
  console.log("rest", rest.location.pathname);
  useEffect(() => {
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
      if (response.data !== "unauthorised") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setVerifiedFromServer(true);
    });
  }, []);
  if (!verifiedFromServer) return <div>Loading......</div>;
  let url = window.location.pathname;
  const allow = url.split("/").length === 4;
  url = url = url.slice(0, url.lastIndexOf("/"));
  if (allow) {
    console.log(url);
    window.history.replaceState({}, "", url);
  }
  if (isLoggedIn === false) {
    console.log("going to sign in with state from as ", rest.location.pathname);
    return <Redirect to={{ pathname: "/signinfirst", state: { from: rest.location.pathname, prevFrom: state && state.from === "/" ? "home" : null } }} />;
  } else if (allow || (state && state.from === "/")) return <Route {...rest} render={(props) => <Component {...props} />}></Route>;
  else return <Redirect to={`/waitingroom/${window.location.pathname.split("/")[2]}`} />;
}
