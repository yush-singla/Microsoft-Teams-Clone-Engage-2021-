import Peer from "peerjs";
import { useSocket } from "./SocketProvider";

export default async function VideoCallProvider() {
  //   const socket = useSocket();
  const myVideo = {};
  const myPeer = new Peer();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  return stream;
  //   myPeer.on("open", () => {
  //     socket.emit("user-connected");
  //   });
  // console.log(myVideo);
}
