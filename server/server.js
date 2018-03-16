const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// register an event listener with on()
// listen for a new connection from the client
io.on('connection', (socket) => {
  console.log('New user connected');

  // emit a custom event to the client side
  socket.emit('newMessage', {
    from: 'server',
    text: 'Yo from server!',
    createdAt: new Date()
  });

  // listen for createMessage events
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
  });

  // Listen for when the client disconnects
  socket.on('disconnect', () => {
    console.log('User has been disconnected');
  });
}); 

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});