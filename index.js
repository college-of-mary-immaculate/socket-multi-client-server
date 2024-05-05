import http from "http";
import { Server } from "socket.io";
import { io } from "socket.io-client";

const server = http.createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});

if (process.env.IS_CLIENT) {
  const socketClient = io(process.env.MASTER_HOST);

  socketClient.on("connect", () => {
    console.log(`[client] Client ID: ${socketClient.id}`)
    console.log("[client] connected to server");

    console.log("[client] sending initial message");
    socketClient.emit("message", "pasok!");
  });

  socketClient.on("message", (data) => console.log(`[client] message from server "${data}"`));
}

const ioServer = new Server(server);

ioServer.on("connection", (socket) => {
  console.log("[server] a user was connected");

  socket.emit("message", "welcome to server");

  socket.on("message", (data) => {
    if (process.env.IS_CLIENT) {
      console.log(`[client] received message from server "${data}"`);
    } else {
      console.log(`[server] client "${socket.id}" sent a message. Forwarding to all clients`);
      ioServer.emit("message", `forwarding ${data} from client ${socket.id}`);
    }
  });
});


server.listen(process.env.PORT, () => console.log('Server is running...'));