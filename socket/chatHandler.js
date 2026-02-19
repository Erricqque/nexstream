// chatHandler.js - Advanced Chat with Delivery Confirmation
const { supabase } = require('../backend/supabaseClient');

const onlineUsers = new Map();
const messageQueue = new Map(); // Store messages for offline users

function setupChatHandlers(io, socket) {
  console.log('Setting up chat handlers for socket:', socket.id);
  
  // User comes online
  socket.on('user-connected', (userId) => {
    console.log(`User ${userId} connected`);
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast online status
    io.emit('user-status', { userId, online: true });
    
    // Deliver queued messages
    deliverQueuedMessages(userId, socket);
  });

  // Join private chat room
  socket.on('join-chat', ({ userId, receiverId }) => {
    const roomId = [userId, receiverId].sort().join('-');
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Send message with delivery confirmation
  socket.on('send-message', async (message) => {
    try {
      const roomId = [message.sender_id, message.receiver_id].sort().join('-');
      
      // Add delivery status
      message.status = 'sent';
      message.delivered_at = null;
      
      // Save to database
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          status: 'sent',
          created_at: new Date()
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const savedMessage = data;
      
      // Check if receiver is online
      const receiverSocketId = onlineUsers.get(message.receiver_id);
      
      if (receiverSocketId) {
        // Send to online user
        io.to(roomId).emit('receive-message', {
          ...savedMessage,
          status: 'delivered'
        });
        
        // Update status to delivered
        await supabase
          .from('messages')
          .update({ status: 'delivered', delivered_at: new Date() })
          .eq('id', savedMessage.id);
          
      } else {
        // Queue for offline user
        queueOfflineMessage(message.receiver_id, savedMessage);
        
        // Confirm to sender that message is queued
        io.to(socket.id).emit('message-queued', {
          id: savedMessage.id,
          status: 'queued'
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message-error', { error: error.message });
    }
  });

  // Mark messages as read
  socket.on('mark-read', async ({ messageIds }) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true, read_at: new Date() })
        .in('id', messageIds);
        
      // Notify sender that messages were read
      io.emit('messages-read', { messageIds });
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Typing indicator
  socket.on('typing', ({ userId, receiverId, isTyping }) => {
    const roomId = [userId, receiverId].sort().join('-');
    socket.to(roomId).emit('user-typing', { userId, isTyping });
  });

  // User disconnects
  socket.on('disconnect', () => {
    if (socket.userId) {
      console.log(`User ${socket.userId} disconnected`);
      onlineUsers.delete(socket.userId);
      io.emit('user-status', { userId: socket.userId, online: false });
    }
  });
}

function queueOfflineMessage(userId, message) {
  if (!messageQueue.has(userId)) {
    messageQueue.set(userId, []);
  }
  messageQueue.get(userId).push(message);
  console.log(`Message queued for offline user ${userId}`);
}

async function deliverQueuedMessages(userId, socket) {
  const queued = messageQueue.get(userId);
  if (!queued || queued.length === 0) return;
  
  console.log(`Delivering ${queued.length} queued messages to user ${userId}`);
  
  for (const message of queued) {
    socket.emit('receive-message', {
      ...message,
      status: 'delivered'
    });
    
    // Update status in database
    await supabase
      .from('messages')
      .update({ status: 'delivered', delivered_at: new Date() })
      .eq('id', message.id);
  }
  
  messageQueue.delete(userId);
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

module.exports = { 
  setupChatHandlers, 
  getOnlineUsers 
};