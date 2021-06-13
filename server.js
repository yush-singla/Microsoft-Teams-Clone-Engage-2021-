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

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log("disconected", userId);
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
