import http from "http";
import { Server } from "socket.io";
import { io } from "socket.io-client";

const server = http.createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});

const ioServer = new Server(server);

ioServer.on("connection", (socket) => {
  console.log("[server] a user was connected");

  socket.emit("message", "welcome to server");

  socket.on("message", (data) => {
    ioServer.emit("message", `forwarding ${data} from client ${socket.id}`);
  });
});

if (process.env.IS_CLIENT) {
  const socketClient = io(process.env.MASTER_HOST);

  socketClient.on("connect", () => {
    console.log(`[client] Client ID: ${socketClient.id}`)
    console.log("[client] connected to server");

    socketClient.emit("message", "pasok!");
  });

  socketClient.on("message", (data) => console.log(`[client] message from server "${data}"`));
}

server.listen(process.env.PORT, () => console.log('Server is running...'));