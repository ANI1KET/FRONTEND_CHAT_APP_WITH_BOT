import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  socket = io("http://192.168.1.127:3001", {
    // socket = io("http://localhost:3001", {
    // socket = io("http://10.6.63.219:3001", {
    query: `user_id=${user_id}`,
  });
}

export { socket, connectSocket };
