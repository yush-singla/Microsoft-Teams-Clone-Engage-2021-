const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// const io = require("socket.io")(server);
const cors = require("cors");

const { v4: uuidV4 } = require("uuid");

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/join", (req, res) => {
  res.send({ link: uuidV4() });
});

let waitingRooms = {};
let participants = {};

io.on("connection", (socket) => {
  participants[socket.id] = { waiting: true, inMeeting: false };
  socket.on("req-join-room", (roomId, cb) => {
    console.log("req for joining by " + socket.id);
    if (waitingRooms[roomId] === undefined) {
      console.log("invalid room");
      cb({ status: "invalid room" });
    } else {
      console.log("sending a message to the" + waitingRooms[roomId]);
      socket.to(waitingRooms[roomId]).emit("req-to-join-room", socket.id, "join");
    }
    socket.on("disconnect", () => {
      // console.log(participants[socket.id]);
      // if (participants[socket.id] === undefined || participants[socket.id].inMeeting) return;
      console.log("disconnected in the waiting area itself");
      socket.to(waitingRooms[roomId]).emit("req-to-join-room", socket.id, "leave");
    });
  });
  socket.on("this-user-is-allowed", (socketId) => {
    participants[socket.id] = { waiting: false, inMeeting: true };
    console.log("after change", participants[socket.id]);
    console.log("got allowed");
    socket.to(socketId).emit("you-are-admitted");
  });
  socket.on("this-user-is-denied", (socketId) => {
    socket.to(socketId).emit("you-are-denied");
  });
  socket.on("join-room", (roomId, userId) => {
    console.log("joined a room " + socket.id);
    if (waitingRooms[roomId] === undefined) {
      waitingRooms[roomId] = socket.id;
    }
    // console.log(roomId, userId);
    //
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      // if (participants[socket.id] === undefined || participants[socket.id].waiting) return;
      console.log("disconected", userId);
      if (waitingRooms[roomId] === socket.id) {
        delete waitingRooms[roomId];
      }
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});
const path = require("path");
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  console.log("came here");
  res.sendFile(path.join(__dirname, "./client", "build", "index.html"));
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`listening on port ${PORT}`);
});
