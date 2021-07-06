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
const GitHubStrategy = require("passport-github2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v4: uuidV4 } = require("uuid");
const MemoryStore = require("memorystore")(session);
app.use(
  session({
    secret: process.env.SECRET,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 },
  })
);
app.use(passport.initialize());
app.use(express.json());
app.use(passport.session());
app.use(cookieParser(process.env.SECRET));

mongoose.connect("mongodb+srv://yush:" + process.env.PASSWORD + "@cluster0.dgbfh.mongodb.net/microsoft_teams_clone?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

// const ContactSchema

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: [String],
  googleId: String,
  facebookId: String,
  picurL: String,
  name: String,
  githubId: String,
  uniqueId: String,
  rooms: [String], //stores only the roomId of the rooms this user is a part of
  // contacts: [{ Name: String, uniqueId: String }],
});
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const roomSchema = new mongoose.Schema({
  roomId: String,
  participants: [{ name: String, uniqueId: String, picurL: String }],
});
const chatSchema = new mongoose.Schema({
  roomDetails: String,
  messages: [{ from: { name: String, uniqueId: String, picurL: String }, content: String }],
});
const Chats = new mongoose.model("Chat", chatSchema);

const Rooms = new mongoose.model("room", roomSchema);

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
      callbackURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/auth/google/callback" : "https://hidden-beyond-12562.herokuapp.com/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
        },
        {
          name: profile.displayName,
          picurL: profile.photos[0].value,
          uniqueId: uuidV4(),
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
      callbackURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/auth/facebook/callback" : "https://hidden-beyond-12562.herokuapp.com/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          facebookId: profile.id,
        },
        {
          name: profile._json.first_name + " " + profile._json.last_name,
          picurL: profile.photos[0].value,
          uniqueId: uuidV4(),
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/auth/github/callback" : "https://hidden-beyond-12562.herokuapp.com/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          githubId: profile._json.id,
        },
        {
          name: profile._json.name,
          picurL: profile._json.avatar_url,
          uniqueId: uuidV4(),
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

const useDomain = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

app.get("/auth/google", (req, res, next) => {
  req.session.redirectDetails = { join: req.query.join, room: req.query.room, prev: req.query.prev };
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
  })(req, res, next);
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/home",
  }),
  function (req, res) {
    if (req.session.redirectDetails && req.session.redirectDetails.join && req.session.redirectDetails.prev) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}/${req.session.redirectDetails.prev}`);
    } else if (req.session.redirectDetails && req.session.redirectDetails.join) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}`);
    } else {
      res.redirect(`${useDomain}/`);
    }
  }
);

app.get("/auth/facebook", (req, res, next) => {
  req.session.redirectDetails = { join: req.query.join, room: req.query.room, prev: req.query.prev };
  passport.authenticate("facebook")(req, res, next);
});

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    scope: ["email"],
    failureRedirect: "/login",
  }),
  function (req, res) {
    if (req.session.redirectDetails && req.session.redirectDetails.join && req.session.redirectDetails.prev) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}/${req.session.redirectDetails.prev}`);
    } else if (req.session.redirectDetails && req.session.redirectDetails.join) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}`);
    } else {
      res.redirect(`${useDomain}/`);
    }
  }
);

app.get("/auth/github", (req, res, next) => {
  req.session.redirectDetails = { join: req.query.join, room: req.query.room, prev: req.query.prev };
  passport.authenticate("github")(req, res, next);
});

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    scope: ["email", "username"],
    failureRedirect: "/login",
  }),
  function (req, res) {
    if (req.session.redirectDetails && req.session.redirectDetails.join && req.session.redirectDetails.prev) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}/${req.session.redirectDetails.prev}`);
    } else if (req.session.redirectDetails && req.session.redirectDetails.join) {
      res.redirect(`${useDomain}/join/${req.session.redirectDetails.room}`);
    } else {
      res.redirect(`${useDomain}/`);
    }
  }
);

app.get("/authenticated", (req, res) => {
  if (req.isAuthenticated()) {
    // console.log(req.user.uniqueId);
    res.send({ picurL: req.user.picurL, name: req.user.name, uniqueId: req.user.uniqueId });
  } else {
    res.send("unauthorised");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") app.use(cors());

app.get("/api/join", (req, res) => {
  res.send({ link: uuidV4() });
});

app.get("/production", (req, res) => {
  res.send(process.env.NODE_ENV);
});

//these are some variables that store the essentials that are needed during vide call
let waitingRooms = {};
let getUserIdBySocketId = {};
let getSocketIdByUserId = {};
let getNameFromSocketId = {};
let getUniqueIdFromSocketId = {};
let getSocketIdFromUniqueId = {};
//sockets coding
io.on("connection", (socket) => {
  socket.on("check-valid-room", (roomId, cb) => {
    if (waitingRooms[roomId] === undefined) {
      cb({ status: "invalid room" });
    }
  });

  socket.on("req-join-room", (roomId, name, uniqueId) => {
    getNameFromSocketId[socket.id] = name;
    getUniqueIdFromSocketId[socket.id] = uniqueId;
    getSocketIdFromUniqueId[uniqueId] = socket.id;
    socket.to(waitingRooms[roomId]).emit("req-to-join-room", { socketId: socket.id, name }, "join");
    socket.on("disconnect", () => {
      if (getUserIdBySocketId[socket.id] === undefined) {
        socket.to(waitingRooms[roomId]).emit("req-to-join-room", { socketId: socket.id }, "leave");
        delete getNameFromSocketId[socket.id];
        delete getSocketIdFromUniqueId[getUniqueIdFromSocketId[socket.id]];
        delete getUniqueIdFromSocketId[socket.id];
      }
    });
  });

  socket.on("this-user-is-allowed", (socketId, cb) => {
    socket.to(socketId).emit("you-are-admitted");
  });

  socket.on("this-user-is-denied", (socketId) => {
    socket.to(socketId).emit("you-are-denied");
  });

  socket.on("join-room", (roomId, userId, { audio, video, picurL, name, uniqueId }) => {
    getUserIdBySocketId[socket.id] = userId;
    getSocketIdByUserId[userId] = socket.id;
    getNameFromSocketId[socket.id] = name;
    getUniqueIdFromSocketId[socket.id] = uniqueId;
    if (waitingRooms[roomId] === undefined) {
      waitingRooms[roomId] = socket.id;
    }
    Rooms.findOne({ roomId }, (err, room) => {
      if (err) console.log(err);
      if (room) {
        const roomSocketsSet = io.sockets.adapter.rooms.get(roomId);
        const roomSockets = [...roomSocketsSet];
        const roomUniqueIds = roomSockets.map((roomSocket) => getUniqueIdFromSocketId[roomSocket]);
        const otherIds = room.participants.map((participant) => participant.uniqueId);
        console.log(otherIds, roomUniqueIds);
        const finalParticipants = [...new Set([...roomUniqueIds, ...otherIds])];
        console.log(finalParticipants);
        User.find({ uniqueId: { $in: finalParticipants } }, (err, participants) => {
          const finalParticipants = participants.map((participant) => {
            return { name: participant.name, picurL: participant.picurL, uniqueId: participant.uniqueId };
          });
          Rooms.findByIdAndUpdate(room._id, { $set: { participants: finalParticipants } }, { new: true }, (err, doc) => {
            if (err) console.log(err);
            console.log(doc);
          });
          User.updateMany({ uniqueId: { $in: finalParticipants.map((x) => x.uniqueId) } }, { $addToSet: { rooms: roomId } }, (err, done) => {
            if (err) console.log(err);
          });
        });
      } else {
        const newRoom = new Rooms({
          roomId,
          participants: [{ uniqueId, name, picurL }],
        });
        newRoom.save();
        const newChats = new Chats({
          roomDetails: roomId,
        });
        newChats.save();
        User.updateMany({ uniqueId }, { $push: { rooms: roomId } }, (err, done) => {
          if (err) console.log(err);
        });
      }
    });

    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, socket.id, { audio, video, picurL, name });
    socket.on("disconnect", () => {
      if (waitingRooms[roomId] === socket.id) {
        delete waitingRooms[roomId];
      }
      socket.to(roomId).emit("user-disconnected", { userId, name: getNameFromSocketId[socket.id], audio, video });
      delete getSocketIdByUserId[getUserIdBySocketId[socket.id]];
      delete getUserIdBySocketId[socket.id];
      delete getNameFromSocketId[socket.id];
      delete getSocketIdFromUniqueId[getUniqueIdFromSocketId[socket.id]];
      delete getUniqueIdFromSocketId[socket.id];
    });
  });

  socket.on("get-chat-data", (roomId, cb) => {
    Chats.findOne({ roomDetails: roomId }, (err, chat) => {
      if (err) console.log(err);
      if (chat) {
        cb(chat);
      } else {
        console.log("not found the chat for the roomid got", roomId);
      }
    });
  });

  socket.on("acknowledge-connected-user", ({ screenShareStatus, socketId, video, audio, userId, roomId, picurL, name }) => {
    socket.to(socketId).emit("update-audio-video-state", { name, picurL, audio, video, userId: getUserIdBySocketId[socket.id], screenShareStatus });
  });
  socket.on("changed-audio-status", ({ status }) => {
    const roomId = Array.from(socket.rooms).pop();
    socket.to(roomId).emit("changed-audio-status-reply", { status, userId: getUserIdBySocketId[socket.id] });
  });
  socket.on("changed-video-status", ({ status }) => {
    const roomId = Array.from(socket.rooms).pop();
    socket.to(roomId).emit("changed-video-status-reply", { status, userId: getUserIdBySocketId[socket.id] });
  });
  //chats handling
  socket.on("send-chat", (chat) => {
    if (chat.all === true && chat.to && chat.to.roomId) {
      const roomSocketsSet = io.sockets.adapter.rooms.get(chat.to.roomId);
      const roomSockets = [...roomSocketsSet];
      const roomUniqueIds = roomSockets.map((roomSocket) => getUniqueIdFromSocketId[roomSocket]);
      User.find({ uniqueId: { $in: roomUniqueIds } }, (err, participants) => {
        Rooms.findOne({ roomId: chat.to.roomId }, (err, room) => {
          if (err) console.log(err);
          const fromId = getUniqueIdFromSocketId[getSocketIdByUserId[chat.from.userId]];
          let from = participants.find((participant) => participant.uniqueId === fromId);
          from = { name: from.name, uniqueId: from.uniqueId, picurL: from.picurL };
          if (room) {
            // if (room.participants)
            Chats.findOneAndUpdate({ roomDetails: room.roomId }, { $push: { messages: { from, content: chat.message } } }, { new: true }, (err, doc) => {
              if (err) {
                console.log(err);
              }
              console.log(doc);
            });
          } else {
            const room = new Rooms({
              roomId: chat.to.roomId,
              participants: participants.map((participant) => {
                return { name: participant.name, uniqueId: participant.uniqueId, picurL: participant.picurL };
              }),
            });
            room.save();
            User.updateMany({ uniqueId: { $in: roomUniqueIds } }, { $push: { rooms: room.roomId } }, (err, done) => {
              if (err) console.log(err);
            });
            const chatObj = new Chats({
              roomDetails: room.roomId,
              messages: [{ from, content: chat.message }],
            });
            chatObj.save();
          }
        });
      });

      socket.to(chat.to.roomId).emit("recieved-chat", chat);
    } else {
      if (chat.to && chat.to.userId) {
        const searchableIds = [getUniqueIdFromSocketId[getSocketIdByUserId[chat.from.userId]], getUniqueIdFromSocketId[getSocketIdByUserId[chat.to.userId]]];
        User.find({ uniqueId: { $in: searchableIds } }, (err, participants) => {
          Rooms.findOne({ roomId: { $in: [searchableIds.join(""), searchableIds.reverse().join("")] } }, (err, room) => {
            if (err) console.log(err);
            const fromId = getUniqueIdFromSocketId[getSocketIdByUserId[chat.from.userId]];
            let from = participants.find((participant) => participant.uniqueId === fromId);
            from = { name: from.name, uniqueId: from.uniqueId, picurL: from.picurL };
            console.log({ from, fromId });
            console.log("participants");
            if (room) {
              Chats.findOneAndUpdate({ roomDetails: room.roomId }, { $push: { messages: { from, content: chat.message } } }, { new: true }, (err, doc) => {
                if (err) {
                  console.log(err);
                }
                console.log(doc);
              });
            } else {
              const room = new Rooms({
                roomId: searchableIds.join(""),
                participants: participants.map((participant) => {
                  return { name: participant.name, uniqueId: participant.uniqueId, picurL: participant.picurL };
                }),
              });
              room.save();
              User.updateMany({ uniqueId: { $in: searchableIds } }, { $push: { rooms: room.roomId } }, (err, done) => {
                if (err) console.log(err);
              });
              const chatObj = new Chats({
                roomDetails: room.roomId,
                messages: [{ from, content: chat.message }],
              });
              chatObj.save();
              console.log(chatObj, room);
            }
          });
        });
        socket.to(getSocketIdByUserId[chat.to.userId]).emit("recieved-chat", chat);
      }
    }
  });

  //screen share start/stop
  socket.on("stopping-screen-share", ({ userId, roomId }) => {
    socket.to(roomId).emit("stopping-screen-share", userId);
  });
  socket.on("starting-screen-share", ({ userId, roomId }) => {
    socket.to(roomId).emit("starting-screen-share", userId);
  });

  //to apply sticker to the person's video
  socket.on("start-sticker", (userId, roomId, key) => {
    io.in(roomId).emit("start-sticker", userId, key);
  });
  socket.on("stop-sticker", (userId, roomId) => {
    io.in(roomId).emit("stop-sticker", userId);
  });
});

//for production build of react
const path = require("path");
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client", "build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
