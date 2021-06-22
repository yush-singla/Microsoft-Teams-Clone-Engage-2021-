import axios from "axios";
export default function handleSignIn(service, cameFrom, prev) {
  if (cameFrom) {
    const [extra, join, room] = cameFrom.split("/");
    if (prev) window.open(`/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
    else window.open(`/${service}?join=${join}&room=${room}`, "_self");
  } else window.open(`/auth/${service}`, "_self");
}
