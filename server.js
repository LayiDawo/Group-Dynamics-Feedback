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

  const io = new Server(httpServer, {
    cors: {
      origin: "https://group-dynamics-feedback.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");
    // Your socket.io event handling here
  });

  // Enable CORS middleware for Express routes as well
  server.use(
    cors({
      origin: "https://group-dynamics-feedback.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  // Let Next.js handle all frontend routes with a wildcard route
  server.all("/*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
