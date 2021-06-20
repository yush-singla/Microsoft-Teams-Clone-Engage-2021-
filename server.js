const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const passport = require("passport");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 },
  })
);
// app.use(cookieParser(process.env.SECRET));

mongoose.connect("mongodb+srv://yush:" + process.env.PASSWORD + "@cluster0.dgbfh.mongodb.net/microsoft_teams_clone?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: [String],
  googleId: String,
  facebookId: String,
  picurL: String,
});

const User = new mongoose.model("User", userSchema);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://mighty-bastion-60878.herokuapp.com/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          email: profile.emails[0].value,
        },
        {
          googleId: profile.id,
          picurL: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://mighty-bastion-60878.herokuapp.com/auth/facebook/secrets",
      profileFields: ["id", "emails", "name", "picture"],
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        {
          email: profile.emails[0].value,
        },
        {
          facebookId: profile.id,
          picurL: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/home",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    console.log(req.user);
    res.redirect("/");
  }
);

const { v4: uuidV4 } = require("uuid");

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/join", (req, res) => {
  res.send({ link: uuidV4() });
});

let waitingRooms = {};
let getUserIdBySocketId = {};
let getSocketIdByUserId = {};

//sockets coding
io.on("connection", (socket) => {
  socket.on("check-valid-room", (roomId, cb) => {
    console.log(roomId);
    if (waitingRooms[roomId] === undefined) {
      console.log("invalid room");
      cb({ status: "invalid room" });
    }
  });
  socket.on("req-join-room", (roomId, cb) => {
    console.log("req for joining by " + socket.id);

    console.log("sending a message to the" + waitingRooms[roomId]);
    socket.to(waitingRooms[roomId]).emit("req-to-join-room", socket.id, "join");

    socket.on("disconnect", () => {
      console.log("disconnected in the waiting area itself");
      socket.to(waitingRooms[roomId]).emit("req-to-join-room", socket.id, "leave");
    });
  });
  socket.on("this-user-is-allowed", (socketId) => {
    console.log("got allowed");
    socket.to(socketId).emit("you-are-admitted");
  });
  socket.on("this-user-is-denied", (socketId) => {
    socket.to(socketId).emit("you-are-denied");
  });
  socket.on("join-room", (roomId, userId, { audio, video }) => {
    getUserIdBySocketId[socket.id] = userId;
    getSocketIdByUserId[userId] = socket.id;
    console.log("joined a room " + socket.id);
    if (waitingRooms[roomId] === undefined) {
      waitingRooms[roomId] = socket.id;
    }
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, socket.id, { audio, video });
    socket.on("disconnect", () => {
      console.log("disconected", userId);
      if (waitingRooms[roomId] === socket.id) {
        delete waitingRooms[roomId];
      }
      socket.to(roomId).emit("user-disconnected", userId, { audio, video });
    });
  });
  socket.on("acknowledge-connected-user", ({ socketId, video, audio, userId, roomId }) => {
    console.log({ audio, video, roomId });
    console.log("sending to roomid now");
    socket.to(socketId).emit("update-audio-video-state", { audio, video, userId: getUserIdBySocketId[socket.id] });
  });
  socket.on("changed-audio-status", ({ status }) => {
    const roomId = Array.from(socket.rooms).pop();
    console.log("change", roomId);
    socket.to(roomId).emit("changed-audio-status-reply", { status, userId: getUserIdBySocketId[socket.id] });
  });
  socket.on("changed-video-status", ({ status }) => {
    const roomId = Array.from(socket.rooms).pop();
    console.log("change", roomId);
    socket.to(roomId).emit("changed-video-status-reply", { status, userId: getUserIdBySocketId[socket.id] });
  });
});

//for production build of react
const path = require("path");
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  console.log("came here");
  res.sendFile(path.join(__dirname, "./client", "build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
