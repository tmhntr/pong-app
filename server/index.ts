import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import env from "dotenv";
import { initGame, purgeGames } from "./game";
// import {
//   ServerToClientEvents,
//   ClientToServerEvents,
// } from "../src/utils/events";

env.config();

const app = express();
app.use(express.static(path.resolve(__dirname, "../../build")));

app.get("/:gameId", function (req, res) {
  // var uid = req.params.uid;
  let reqpath = "index.html";
  res.sendFile(reqpath, { root: path.resolve(__dirname, "../../build") });
});

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
