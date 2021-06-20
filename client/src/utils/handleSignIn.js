import axios from "axios";
export default function handleSignIn(service, cameFrom, prev) {
  const [extra, join, room] = cameFrom.split("/");
  if (cameFrom && prev) window.open(`http://localhost:5000/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
  else if (cameFrom) window.open(`http://localhost:5000/auth/${service}?join=${join}&room=${room}`, "_self");
  else window.open(`http://localhost:5000/auth/${service}`, "_self");
}
