// This is our client side javascript
var socket = io();

// this event fires when the connection starts
socket.on('connect', function () {
  console.log('Connected to server');

  // emit a message to the server
  socket.emit('createMessage', {
    from: 'client',
    text: 'Yo from client!'
  });
});

// this event fires when the connection drops
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage:', message);
});

// we can't use arrow functions because some browsers can't 
// handle them