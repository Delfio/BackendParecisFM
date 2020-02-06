import socket from 'socket.io';

export default function webSocket(server) {
  const io = socket(server);

  io.on('connection', socket => {
    console.log(socket.id)
  })
}