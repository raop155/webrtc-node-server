const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const PORT = process.env.PORT || 3000;
const users = {};

app.get('/', (req, res) => {
  res.send('Hello world! ' + PORT);
});

io.on('connection', (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit('yourID', socket.id);
  io.sockets.emit('allUsers', users);
  socket.on('disconnect', () => {
    delete users[socket.id];
  });

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(PORT, () => console.log('Server is running on port ' + PORT));
