const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var morgan = require("morgan");
const url = "mongodb://localhost/Secure";
const app = express();
const http = require("http").Server(app);


const io = require("socket.io")(http);

// Serve web app directory
app.use(express.static("chatroom"));

io.on("connection", (socket) => {
  console.log(`User Connected - Socket ID ${socket.id}`);
  
  let currentRoom = "DEFAULT";

  socket.on("JOIN", () => {
    socket.join(currentRoom);

    io.to(socket.id).emit("ROOM_JOINED", currentRoom);

    socket.broadcast.to(currentRoom).emit("NEW_CONNECTION", null);
  });

  socket.on("MESSAGE", (msg,sign) => {
    console.log("New Message- ", msg,sign);
    socket.broadcast.to(currentRoom).emit("MESSAGE", msg,sign);
  });
  socket.on("PUBLIC_KEY", (key) => {
    socket.broadcast.to(currentRoom).emit("PUBLIC_KEY", key);
  });

  socket.on("disconnect", () => {
    socket.broadcast.to(currentRoom).emit("USER_DISCONNECTED", null);
  });
});

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("DATABASE CONNECTED...");
});

app.use(cors());

app.use(morgan("tiny"));
app.use(express.json());

const textRouter = require("./routes/texts");
app.use("/copvoid", textRouter);

http.listen(3000, () => {
  console.log("SERVER STARTED");
});
