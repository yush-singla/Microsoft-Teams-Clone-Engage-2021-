import axios from "axios";
export default function handleSignIn(service, cameFrom, prev) {
  axios.get("/production").then((response) => {
    const useDomain = response.data === "development" ? "http://localhost:5000" : "";
    if (cameFrom) {
      //since we need the second and third argument we destructure the array in such a way
      const [extra, join, room] = cameFrom.split("/");
      if (prev) window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
      else window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}`, "_self");
    } else window.open(`${useDomain}/auth/${service}`, "_self");
  });
}
