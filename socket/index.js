const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔵 User connected:', socket.id);

  // User joins with their ID
  socket.on('user-connected', (userData) => {
    onlineUsers.set(userData.userId, { 
      socketId: socket.id, 
      name: userData.name 
    });
    socket.userId = userData.userId;
    
    // Broadcast online status to all
    io.emit('user-status', { 
      userId: userData.userId, 
      online: true,
      name: userData.name 
    });
    
    console.log(`👤 ${userData.name} is online`);
  });

  // Join private chat room
  socket.on('join-chat', ({ userId, receiverId }) => {
    const roomId = [userId, receiverId].sort().join('-');
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Send message
  socket.on('send-message', (message) => {
    const roomId = [message.senderId, message.receiverId].sort().join('-');
    
    // Emit to room
    io.to(roomId).emit('receive-message', message);
    console.log(`💬 Message sent: ${message.content}`);
    
    // Send notification if receiver is online
    const receiverData = onlineUsers.get(message.receiverId);
    if (receiverData) {
      io.to(receiverData.socketId).emit('new-notification', {
        type: 'MESSAGE',
        title: 'New Message',
        body: `${message.senderName}: ${message.content}`,
        data: message
      });
    }
  });

  // Typing indicator
  socket.on('typing', ({ userId, receiverId, isTyping }) => {
    const roomId = [userId, receiverId].sort().join('-');
    socket.to(roomId).emit('user-typing', { userId, isTyping });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('user-status', { userId: socket.userId, online: false });
      console.log(`🔴 User ${socket.userId} disconnected`);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log('🚀 Socket server running on port 3001');
  console.log('📍 Waiting for connections...');
});