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
      "https://cm-web-app-next.up.railway.app/",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"], 
    credentials: true, 
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Escuchar el evento 'updated-table'
  socket.on("updated-table", (data) => {
    const { tableName, updatedData } = data;

    console.log("Entro a updated-table");
    console.log(
      `table Name: ${tableName} y Payload: ${JSON.stringify(updatedData)}`
    );

    // Ejemplo: Emitir el cambio a todos los demás clientes conectados
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
