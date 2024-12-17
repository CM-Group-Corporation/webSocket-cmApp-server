const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://192.168.0.69:3001",
      "http://192.168.0.233:3002",
      "http://192.168.0.69:3003",
    ],
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Encabezados permitidos
    credentials: true, // Habilitar credenciales (cookies, etc.)
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

const port = 3000;
const HOST = "192.168.0.69"; //cambiar para que funcione para el pc de pipe 192.168.0.69
server.listen(port, HOST, () => {
  console.log(`Servidor WebSocket corriendo en http://${HOST}:${port}`);
});
