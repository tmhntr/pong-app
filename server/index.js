const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "../build")));

var server = require("http").createServer(app).listen(PORT);

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
  //console.log('client connected');
  game.initGame(io, socket);
});
