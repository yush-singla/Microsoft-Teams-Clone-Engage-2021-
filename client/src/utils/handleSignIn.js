import axios from "axios";
export default function handleSignIn(service, cameFrom, prev) {
  console.log("called");
  axios.get("/production").then((response) => {
    // console.log(response.data);
    const useDomain = response.data === "development" ? "http://localhost:5000" : "";
    // console.log(useDomain);
    if (cameFrom) {
      const [extra, join, room] = cameFrom.split("/");
      if (prev) window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
      else window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}`, "_self");
    } else window.open(`${useDomain}/auth/${service}`, "_self");
  });
}
