const uuid = require("uuid").v4;
const { SocketAddress } = require("net");
const Game = require("./game");
var io;
var gameSocket;

const currentGames = {};
const currentPlayers = {};

module.exports = function initGame(sio, socket) {
  io = sio;
  gameSocket = socket;
  // console.log(socket);
  gameSocket.emit("connected", { message: "Connected successfully" });

  gameSocket.on("action", (data) => {
    let game = currentPlayers[socket.id];
    let paddle = game.left == socket.id ? game.lpaddle : game.rpaddle;
    switch (data.action) {
      case 0:
        paddle.moveDown();
        break;
      case 1:
        paddle.stop();
        break;
      case 2:
        paddle.moveUp();
      default:
        break;
    }
    game.update();
    io.in(socket.id).emit("update", game.observe());
  });

  gameSocket.on("newGame", (gid) => {
    console.log(`player joined game ${gid}`);
    let game = new Game();
    currentGames[gid] = game;
    game.left = socket.id;
    currentPlayers[socket.id] = game;
    io.in(socket.id).socketsJoin(gid);
    // console.log(currentGames);
  });

  gameSocket.on("joinGame", (gid) => {
    console.log(`player joined game ${gid}`);
    let game = currentGames[gid];
    if (game.left) {
      game.right = socket.id;
    } else {
      game.left = socket.id;
    }
    console.log("adding socket");
    io.to(gid).emit("playerJoinedRoom", { playerName: socket.id.toString() });
    io.in(socket.id).socketsJoin(gid);
    currentPlayers[socket.id] = game;
    console.log(`left: ${game.left} right: ${game.right}`);
    if (game.left && game.right) {
      console.log(`Starting game ${gid}`);
      game.start();
      io.to(gid).emit("update", game.observe());
    }
  });

  gameSocket.on("disconnect", (reason) => {});

  // gameSocket.on("playerAnswer", playerAnswer);
  // gameSocket.on("playerRestart", playerRestart);
};
