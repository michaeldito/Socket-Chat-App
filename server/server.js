const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
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
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
  
  // emit a message to every connection, while io.emit 
  // is just for one connection.
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // listen for createMessage events
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server.');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // Listen for when the client disconnects
  socket.on('disconnect', () => {
    console.log('User has been disconnected');
  });
}); 

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});