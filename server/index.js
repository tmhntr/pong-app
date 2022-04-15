const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { initGame, purgeGames } = require("./game");
const app = express();
app.use(express.static(path.resolve(__dirname, "../build")));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  // ...
  // console.log("Connected");
  initGame(io, socket);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
  setInterval(() => {
    // TODO clean out games
    purgeGames();
  }, 10000);
});
