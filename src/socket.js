import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  socket = io(`${process.env.REACT_APP_BASE_URL}`, {
    query: `user_id=${user_id}`,
  });
}

export { socket, connectSocket };
