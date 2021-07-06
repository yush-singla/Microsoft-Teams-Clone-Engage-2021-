
# Microsoft Teams Clone

## Free Video Calling App

Microsoft Teams Clone is a webRTC based project to enjoy free, Quality video conversations with friends and colleagues.


<!-- ![image](https://user-images.githubusercontent.com/70366079/123800040-7c195c00-d906-11eb-80af-9856360e4185.png) -->
<img src="https://user-images.githubusercontent.com/70366079/123800040-7c195c00-d906-11eb-80af-9856360e4185.png" width="800" > 

### Features

1. Video Meetings
2. Built In Chat
3. Waiting Rooms
4. User Authentication
5. Fun Face Masks
6. Screen Share

<img src="https://user-images.githubusercontent.com/70366079/124368483-10751d00-dc7f-11eb-8cb2-e48e412a8c03.png" width="200" >  <img src="https://user-images.githubusercontent.com/70366079/124368419-92187b00-dc7e-11eb-909e-1bdf232e3cee.png" width="200" style="margin:auto">  <img src="https://user-images.githubusercontent.com/70366079/124368406-65646380-dc7e-11eb-8d55-6645603677ad.png" width="200" >
<img src="https://user-images.githubusercontent.com/70366079/124368458-d7d54380-dc7e-11eb-99c5-8bcfd8d5be42.png" width="200" > <img src="https://user-images.githubusercontent.com/70366079/123799398-cfd77580-d905-11eb-9382-195bfeecfee0.png" width="200" >   <img src="https://user-images.githubusercontent.com/70366079/124368537-92654600-dc7f-11eb-842c-855efd363e55.png" width="200" > 
<img src="https://user-images.githubusercontent.com/70366079/124369189-b11b0b00-dc86-11eb-8fe2-0e2208f5f8e1.png" width="200" style="margin:auto">


## How to use

### Checkout the app [here](https://hidden-beyond-12562.herokuapp.com/)

### Or Wonna Run locally?

1. Clone the repository
2. Run the following commands in the command propmt

```
npm install
npm install --prefix client
npm run dev
```

3. Now the app will run on `localhost:3000`.


**Note**: *You need your own oauth credentials to login,and the feature won't work locally*!

## Table of Contents

1. [Tech Stack](#tech-stack)

- [Usage Explanation](#usage)

2. [Deep Dive into Features](deep-dive-into-features!)
   - Video Meetings
   - Chats
   - Screen Share
   - User Authentication
   - Fun Face Masks
3. [Design](#design)

- [High Level Design](#high-level-design)
  - Video Meetings
  - Chats
  - Screen Share
  - User Authentication
  - Fun Face Masks
- [Low Level Design](#low-level-design)
  - Video Meetings
  - Chats
  - Screen Share
  - User Authentication
  - Fun Face Masks

## Tech Stack

1. ReactJs
2. NodeJs
3. Socket.io
4. WebRTC(PeerJs)
5. PassPortJs

### Usage

1. ReactJs is used to make the entire front end, _since it allows me to use hooks and other modern features that make the website look smooth with no reloading whatsover like in a traditional Website_.
2. NodeJs is used for the server, it handles get/post requests through express and also handles socket events.
3. Socket.io is used for communication between the server and the client back and forth. It handles all the events like mute,cam off,etc and informs other peers in the meet to adjust the ui accordingly, thus maintaining a sync between all the users. _Since it is event driven, we have much more control and all we need to do to communicate is emit and listen for an event_.
4. WebRTC is used to transfer video streams, Peer to Peer basis, _It is one of the best ways to stream video using the resources of the browser only and not use any other service, the quality is simply awsome_.
5. PassPortJs is a middleware that is used to implement User authentication in NodeJs, _Since it open source I preffered to use it rather than any BAAS_ .

## Deep Dive into the Features

### 1. Video Meetings
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368537-92654600-dc7f-11eb-842c-855efd363e55.png) -->
<img src="https://user-images.githubusercontent.com/70366079/124368537-92654600-dc7f-11eb-842c-855efd363e55.png" width="600" > 


1. Supports upto 5 people.
2. Compatible on Mobile as well as the web.
3. Options, to turn cam on/off, mute,etc avaliable.

### 2. Chats
<!-- ![image](https://user-images.githubusercontent.com/70366079/123799398-cfd77580-d905-11eb-9382-195bfeecfee0.png) -->
<img src="https://user-images.githubusercontent.com/70366079/123799398-cfd77580-d905-11eb-9382-195bfeecfee0.png" width="600" > 


1. Can send message to individuals, as well as to everyone in the meeting.
2. Links can also be shared easily and become clickable.
3. Push Notifications are sent to the user, who recieves a message.

### 3. Screen Share
<img src="https://user-images.githubusercontent.com/70366079/124368458-d7d54380-dc7e-11eb-99c5-8bcfd8d5be42.png" width="600" style="margin:auto">
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368458-d7d54380-dc7e-11eb-99c5-8bcfd8d5be42.png) -->


1. A single user can share their screen at a time.
2. The video of the other users is also shown simentaneously

### 4. User Authentication

<img src="https://user-images.githubusercontent.com/70366079/124368406-65646380-dc7e-11eb-8d55-6645603677ad.png" width="600" > 
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368406-65646380-dc7e-11eb-8d55-6645603677ad.png) -->


1. No hassle of filling forms.
2. Login with your favourite social media
3. Supported
   *Google
   *Facebook
   \*Github

### 5. Fun Face Masks
<img src="https://user-images.githubusercontent.com/70366079/124368419-92187b00-dc7e-11eb-909e-1bdf232e3cee.png" width="600" style="margin:auto">
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368419-92187b00-dc7e-11eb-909e-1bdf232e3cee.png) -->
<!-- ![image](https://user-images.githubusercontent.com/70366079/124369189-b11b0b00-dc86-11eb-8fe2-0e2208f5f8e1.png) -->
<img src="https://user-images.githubusercontent.com/70366079/124369189-b11b0b00-dc86-11eb-8fe2-0e2208f5f8e1.png" width="600" style="margin:auto">


1. Virtual Face masks and Stickers for your face.
2. Chose from a large collection.

### 6. Waiting Rooms!
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368483-10751d00-dc7f-11eb-8cb2-e48e412a8c03.png) -->
<img src="https://user-images.githubusercontent.com/70366079/124368483-10751d00-dc7f-11eb-8cb2-e48e412a8c03.png" width="600" > 
<!-- ![image](https://user-images.githubusercontent.com/70366079/124368487-1d920c00-dc7f-11eb-98f9-7d16b8a8819f.png=200) -->
<!-- <img src="https://user-images.githubusercontent.com/70366079/124368487-1d920c00-dc7f-11eb-98f9-7d16b8a8819f.png" width="600" >  -->



1. The host of the meeting has full control of the meeting.
2. Whenever someone tries to join, the host can accept him or deny him entry.
3. He can also put him in the, and then admit him at a later point.
4. In the meantimes the person in the waiting room, can chose the status of his audio/video before he joins the meeting

## Design

### High Level Design

![image](https://user-images.githubusercontent.com/70366079/124369011-ea527b80-dc84-11eb-8406-7fd09756f25e.png)


#### Video Meetings

1. Video Meetings are created using the combination of WebRTC and Socket.io.
2. All the clients are connected to the server through websockets, while they are connected to each other throogh WebRTC.
3. All the communication between the clients is handled through the server only, like if someone mutes,etc except for the video streams that are transfered through webrtc.
4. Since it is a mesh topology, no of connections increase quadratically, hence it cannot support very large meetings.

#### Chat

1. Chat is made using socket.io. The user can chose whom to send the message ie an individual or everyone.
2. The server listens for the message, and on reception it broadcasts the message to the users applicable per the request from the persom.

#### Screen Share

1. WebRTC allows us to capture the screen.
2. We emit an event informing the other that we are sharing the screen so that they can adjust the ui accordingly.
3. The current connection with all other clients is broken and a new one is established with the stream containing the screen.

#### Fun Face Masks

1. Face masks are added using the tensorflowJs' faceapi.
2. It detects, static images and draws over them.
3. We repeat this after every 100 ms to get the desired mask which follows your face.

#### Waiting Rooms

1. They are implemented by having the meeting link protected using the react router dom.
2. Whenever a person tries to join the meeting, he is first redirected to the waiting room, and an emmited event informs the host about the new person.
3. Now the host if accepts emits an event that allows the other user to join the meeting, similary if rejects another event firest that rejects the person.

#### User Authentication

1. User Authetication is implemented through the use of Oauth 2.0
2. The details fetched from the provider includes the name,profile photo only, since we don't need anything else in the app.

### Low Level Design

![image](https://user-images.githubusercontent.com/70366079/124369092-b0ce4000-dc85-11eb-9235-f970f66731ad.png)


#### Video Meetings

#### Client Side

```javascript
function setUpSocketsAndPeerEvents({ socket, myPeer, stream, myPic }, cb) {
    myPeer.on("open", (userId) => {
      setVideos((prev) => {
         videoStatus.current, picurL: myPicRef.current, userName: titleCase(myNameRef.current) }];
      });
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("join-room", roomId, userId, { audio: audioStatus.current,  myNameRef.current });
    });
    socket.on("user-connected", (userId, socketId, { audio: userAudio, video: userVideo, picurL: userPicUrl, name: userName }) => {
      const call = myPeer.call(userId, stream);
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { userAudio, userVideo, userName, userPicUrl });
        const roomId = window.location.pathname.split("/")[2];
        setVideo((prev) => {
          console.log("the state of video is", prev);
          return prev;
        });
        socket.emit("acknowledge-connected-user", {
          video: videoStatus.current,
          audio: audioStatus.current,
          socketId,
          userId,
          roomId,
          picurL: myPicRef.current,
          name: myNameRef.current,
          screenShareStatus: someOneSharingScreenRef.current,
        });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
    socket.on("user-disconnected", ({ userId, name }) => {
      connectedPeers.current[userId].close();
      setOpenSnackBar({ value: true, name });
      if (someOneSharingScreenRef.current.userId === userId) {
        setSomeOneSharingScreen({ value: false, userId: null });
        someOneSharingScreenRef.current = { value: false, userId: null };
      }
      delete connectedPeers[userId];
    });
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        if (connectedPeers.current[call.peer]) {
          return;
        }
        connectedPeers.current[call.peer] = call;
        addVideoStream(userVideoStream, call.peer, { useraudio: true, userVideo: false });
      });
      call.on("close", () => {
        setVideos((prev) => {
          return prev.filter((video) => video.userId !== call.peer);
        });
      });
    });
  }
```

1. Here when a user connects to the meet, we capture his video/audio and emit an event asking all the people in the room to call this user.
2. When other call this user, he answers that with his stream ans a peer to peer connection is established.

#### Server Side

```javascript
socket.on("join-room", (roomId, userId, { audio, video, picurL, name }) => {
  if (waitingRooms[roomId] === undefined) {
    waitingRooms[roomId] = socket.id;
  }
  socket.join(roomId);
  socket.to(roomId).emit("user-connected", userId, socket.id, { audio, video, picurL, name });
  socket.on("disconnect", () => {
    if (waitingRooms[roomId] === socket.id) {
      delete waitingRooms[roomId];
    }
    socket.to(roomId).emit("user-disconnected", { userId, name: getNameFromSocketId[socket.id], audio, video });
  });
});
```

1. Here we setup the meeting such that, we listen for new user connection through join room and then emit an event user connected that informs the peer about the user id of the user they need to call and connect to.

#### Chat

#### Client Side

```javascript
//to send a message with all the required information
const chat = {
  from: {
    name: myNameRef.current,
    userId: myId,
    picurL: myPicRef.current,
  },
  all: sendTo === "all",
  to: sendTo === "all" ? { roomId: window.location.pathname.split("/")[2] } : JSON.parse(sendTo),
  message: chatMessage,
};
setChatMessage("");
setChatMessagges((prev) => [...prev, chat]);
socket.emit("send-chat", chat);

//to listen for reception
socket.on("recieved-chat", (chat) => {
  if (chatOpenRef.current === false) setShowChatPopUp((prev) => prev + 1);
  else setShowChatPopUp(0);
  setChatMessagges((prev) => [...prev, chat]);
});
```

1. The code is basically just emit to the server the message along with the scoketId/roomdId depending on whether we need to send it to everyone or an individual only.
2. The other event listener listens for recieiving any message and uses that to give push notification, and add the message to the chatbox.

#### Server Side

```javascript
socket.on("send-chat", (chat) => {
  if (chat.all === true && chat.to && chat.to.roomId) {
    socket.to(chat.to.roomId).emit("recieved-chat", chat);
  } else {
    if (chat.to && chat.to.userId) {
      socket.to(getSocketIdByUserId[chat.to.userId]).emit("recieved-chat", chat);
    }
  }
});
```

1. This code listens for the event chat fired from the client, and broadcasts the messsage to everyone else in the meet.

#### Protected Routes(Waiting Rooms And User Authentication)

1. They are implemented by having the meeting link protected using the react router dom.
2. The concept of protect routes is used where the meeting link act as a protected route, protecting both the user who are not authenticated and those who are not yet admitted to the meeting.
3. The url is given some extra paramenter to identify from where it is coming and then the user is redirected based on that to different routes and the parameter is removed from the url so that anyone else is not able to misuse it to come to our meetings

```javascriipt
function ProtectedRoute({ component: Component, ...rest }) {
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const { state } = useLocation();
  const [verifiedFromServer, setVerifiedFromServer] = useState(false);

  useEffect(() => {
    axios.get("/authenticated").then((response) => {
      console.log(response.data);
      if (response.data !== "unauthorised") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setVerifiedFromServer(true);
    });
  }, []);

  if (!verifiedFromServer)
    return (
      <div style={{ position: "absolute", top: "45vh", left: "44vw", textAlign: "center" }}>
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );

  //since the url has an extra parameter when it comes from the server,after verification we take care
  //of that here
  let url = window.location.pathname;
  const allow = url.split("/").length === 4;
  url = url = url.slice(0, url.lastIndexOf("/"));
  if (allow) {
    window.history.replaceState({}, "", url);
  }
  if (isLoggedIn === false) {
    return <Redirect to={{ pathname: "/signinfirst", state: { from: rest.location.pathname, prevFrom: state && state.from === "/" ? "home" : null } }} />;
  } else if (allow || (state && state.from === "/")) return <Route {...rest} render={(props) => <Component {...props} />}></Route>;
  else return <Redirect to={`/waitingroom/${window.location.pathname.split("/")[2]}`} />;
}
```

1. The redirects here are based on the fact from where the person is coming and where he intends to go to.

#### Uaer Authenticaion

1. It is implemented using PassportJs in NodeJs
2. The session is maintained using express-session and the memoryStore is used to make the app scalable, since the session is stored on the server side.

```javascript
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
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
```

1. It is basically the passport strategy where it authenticates the user and provides us with the details and also stores them.

```javascript
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
```

1. The user requests to login and is redirected and logged in through the passport middleware after which he comes to the callback. We also store details about where to redirect him in the session.
2. From here he is redirected to the correct page depending on the redirect details stored in his/her session.

##### Client Side

```javascript
axios.get("/production").then((response) => {
  const useDomain = response.data === "development" ? "http://localhost:5000" : "";
  if (cameFrom) {
    //since we need the second and third argument we destructure the array in such a way
    const [extra, join, room] = cameFrom.split("/");
    if (prev) window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}&prev=${prev}`, "_self");
    else window.open(`${useDomain}/auth/${service}?join=${join}&room=${room}`, "_self");
  } else window.open(`${useDomain}/auth/${service}`, "_self");
});
```

1. This is a utility function that is used to send request to the server, it takes in the service to use and from where the user is coming and where he needs to be redirected and converts all those things to parameters in the url.

### Waiting Rooms

1. The user gets to see the waiting room screen where he can select status of his audio, video when he joins the meet.
2. These details are stored in the user session which is broadcasted to all others when he is admitted to the meeting.

```javascript
useEffect(() => {
  showUserVideo();
  const roomId = window.location.pathname.split("/")[2];
  socket.emit("check-valid-room", roomId, ({ status }) => {
    if (status === "invalid room") {
      alert("Link is invalid");
      setStatus("invalid room");
    }
  });
  socket.on("you-are-admitted", () => {
    setStatus("allowed");
  });
  socket.on("you-are-denied", () => {
    setStatus("denied");
    alert("host denied entry to the meeting");
  });
  return () => {
    socket.off("you-are-admitted");
    socket.off("you-are-denied");
  };
}, []);
function askToJoin() {
  axios.get("/authenticated").then((response) => {
    if (response.data !== "unauthorized") {
      setHasAskedToJoin(true);
      const roomId = window.location.pathname.split("/")[2];
      socket.emit("req-join-room", roomId, response.data.name);
    } else {
      alert("you are not logged in");
      setStatus("denied");
    }
  });
}
```

1. All these are set up to send and recieve events to the server and actions are executed as explained above.

### Fun Face Masks

1. They are made using tensorFlow faceApi to detect facial landmarks and get their coordinates.
2. Now we place a canvas on top of the video to draw on top of the canvas.
3. We use setInterval and run the faceApi on the image to get the detections and draw accordingly on the canvas to give a mask effect.
4. For our stream on other user's screen we draw the mask locally on their screen, and this behaviour is also controlled by the socket events which inform the client where to draw which masks.

```javascript
async function startCanvasDrawing() {
    const myId = videoStream.userId;
    if (videoRefs.current[myId] === undefined) return;
    videoRefs.current[myId].canvasRef.innerHTML = await faceapi.createCanvasFromMedia(videoRefs.current[myId].videoRef);
    const displaySize = videoRefs.current[myId].videoRef.getBoundingClientRect();
    faceapi.matchDimensions(videoRefs.current[myId].canvasRef, displaySize);
    startInterval.current = () => {
      clearMe.current = setInterval(async () => {
        try {
          const detections = await faceapi.detectAllFaces(videoRefs.current[myId].videoRef, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
          if (detections && detections.length > 0) {
            errCnt.current = 0;
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const headCoods = resizedDetections[0].landmarks.getLeftEyeBrow();
            const jawCoods = resizedDetections[0].landmarks.getJawOutline();
            videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
            videoRefs.current[myId].canvasRef
              .getContext("2d")
              .drawImage(
                img.current,
                jawCoods[4].x - (jawCoods[16].x - jawCoods[0].x) * 0.48,
                jawCoods[0].y - (jawCoods[8].y - headCoods[3].y) * 0.9,
                (jawCoods[16].x - jawCoods[0].x) * 1.7,
                (jawCoods[8].y - headCoods[3].y) * 1.8
              );
            // faceapi.draw.drawDetections(videoRefs.current[myId].canvasRef, resizedDetections);
            // faceapi.draw.drawFaceLandmarks(videoRefs.current[myId].canvasRef, resizedDetections);
          } else {
            if (errCnt.current > 10) {
              videoRefs.current[myId].canvasRef.getContext("2d").clearRect(0, 0, videoRefs.current[myId].canvasRef.width, videoRefs.current[myId].canvasRef.height);
              errCnt.current = 0;
            }
            errCnt.current++;
          }
        } catch (err) {
          console.log(err);
        }
      }, 200);
```

1. The detections are used to draw an image on top of the face of the person to be able to give a mask like effect.
2. They cannot be run more than 10 FPS since the detections algo takes that much time.
3. But for performance betterment we have kept it at 5FPS, but if you feel it is laggy you can change it to 10 FPS as well.

```javascript
useEffect(() => {
    if (typeof stopInterval.current === "function") {
      stopInterval.current();
    }
    socket.on("start-sticker", (userId, key) => {
      if (userId === videoStream.userId) {
        if (typeof stopInterval.current === "function") stopInterval.current();
        if (img.current) {
          const currImg = allStickers[key];
          const currImgName = Object.keys(currImg)[0];
          img.current.src = currImg[currImgName];
        }
        if (typeof startInterval.current === "function") startInterval.current();
      }
    });
    socket.on("stop-sticker", (userId) => {
      if (userId === videoStream.userId) {
        stopInterval.current();
      }
    });
    }
```

1. These are the events that start/stop sticker in the videostream.
2. These are using refs which are actually fucntions that are used to start/stop the sticker.
