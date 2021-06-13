import React, { useContext, createContext } from "react";
import { io } from "socket.io-client";

const socket = io.connect("/");
const SocketContext = createContext();
console.log(socket);

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
