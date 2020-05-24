import { Socket } from "socket.io";

export function socketListener(socket: Socket) {
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECTED.");
  });
}
