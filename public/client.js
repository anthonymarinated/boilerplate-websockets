$(document).ready(function () {
  // Form submittion with new message in field with id 'm'
  let socket = io();
  
  socket.on('user', function(data){
    $('#num-users').text(data.currentUsers + ' users online');
    let message = 
      data.username + (data.connected ? ' has joined the chat.' : ' has left the chat.');
    $('#messages').append($('<li>').html('<b>' + message + '</b>'));    
  });
  //listening for event 'chat message and when received
    //append a list item to #messages with the username and the message
  socket.on('chat message', function(data){
    console.log('socket.on 1');
    $('#messages').append($('<li>').text(`${data.username}: ${data.message}`));
  });

  //allows clients to send a chat messag eto the server to emit to all the clients
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    //sends message to server here
    socket.emit('chat message', messageToSend);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});

