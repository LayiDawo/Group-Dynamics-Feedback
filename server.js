const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Enable CORS
  server.use(cors());

  // Setup Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("game_message", (msg) => {
      socket.broadcast.emit("game_message", msg);
    });
  });

  // ✅ This is the correct catch-all for modern Express + Next.js
  server.all("/*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`✅ Ready on http://localhost:${port}`);
  });
});
