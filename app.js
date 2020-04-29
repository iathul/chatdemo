const path          = require('path');
const http          = require('http');
const express       = require('express');
const socketio      = require('socket.io');

const { msgFormat } = require('./controllers/message')
const { userJoin,
      getCurrentUser,
      left,
      getRoomUsers
    }               = require('./controllers/user')

const app       = express();
const server    = http.createServer(app);
const io        = socketio(server);

// Using Static folders
app.use(express.static(path.join(__dirname, 'public')));


const bot = 'Discussbot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('message', msgFormat(bot, 'Welcome to ChatCord!'));
  
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          msgFormat(bot, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('chatMsg', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', msgFormat(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = left(socket.id);  
  
      if (user) {
        io.to(user.room).emit(
          'message',
          msgFormat(bot, `${user.username} left `)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

const PORT    = 8080;

server.listen(PORT,() => console.log(`Server started at PORT: ${PORT}`));