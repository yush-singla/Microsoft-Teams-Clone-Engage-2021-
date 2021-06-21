import axios from "axios";
export default function handleSignIn(service, cameFrom, prev) {
  if (cameFrom) {
    const [extra, join, room] = cameFrom.split("/");
    if (prev) window.open(`http://localhost:5000/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
    else window.open(`http://localhost:5000/auth/${service}?join=${join}&room=${room}`, "_self");
  } else window.open(`http://localhost:5000/auth/${service}`, "_self");
}
