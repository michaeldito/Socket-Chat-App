const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

// register an event listener with on()
// listen for a new connection from the client
io.on('connection', (socket) => {
  console.log('New user connected');

  
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    // socket.leave('some room');
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // emit a custom event to the client side
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
      
    // emit a message to every connection, while io.emit 
    // is just for one connection.
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));


    callback();
  });
  // listen for createMessage events
  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
  
    callback('This is from the server.');
  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  // Listen for when the client disconnects
  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    console.log('User has been disconnected');
  });
  
}); 

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});