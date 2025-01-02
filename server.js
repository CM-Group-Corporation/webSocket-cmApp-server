const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

dotenv.config();

const io = new Server(server, {
  cors: {
    origin: [
      "http://192.168.0.69:3001",
      "http://localhost:3000",
      "https://cm-admin-web-app.up.railway.app" // Removed trailing slash
    ],
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"], 
    credentials: true, 
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("updated-table", (data) => {
    const { tableName, updatedData } = data;

    console.log("Entro a updated-table");
    console.log(
      `table Name: ${tableName} y Payload: ${JSON.stringify(updatedData)}`
    );

    socket.broadcast.emit("table-change", { tableName, updatedData });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const port = process.env.PORT || 3000;
const HOST = "0.0.0.0"; 
server.listen(port, HOST, () => {
  console.log(`Servidor WebSocket corriendo en http://${HOST}:${port}`);
});