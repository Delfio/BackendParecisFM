import socket from 'socket.io';

let io;
const connections = []

export function webSocket(server) {
  io = socket(server);

  io.on('connection', socket => {
    const { radio_id } = socket.handshake.query
    connections.push({
      id: socket.id,
      radio_id: radio_id
    })
  })
}

export function findUser(radio_id){
  return connections.filter( connection => {
    return connection.radio_id === radio_id ? connection.radio_id : null
  } )
}

export function sendNotification(to, message, data) {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}