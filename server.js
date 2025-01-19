const express = require('express');
const { createServer } = require('http');
const socketIo = require('socket.io');
const fetch = require('node-fetch');

// Import the Telegram bot from index.js
const { bot } = require('./index');  // Assuming the bot is initialized in index.js

// Define the keep-alive function directly inside server.js
function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;  // Adjust the URL for your platform
  if (/(\/\/|\.)undefined\./.test(url)) return;  // Avoid invalid URLs
  
  setInterval(() => {
    fetch(url).catch(console.error);  // Send a request to keep the server awake
  }, 5 * 1000 * 60);  // Ping every 5 minutes
}

function connect(conn, PORT, opts = {}) {
  const app = express();
  const server = createServer(app);
  const io = socketIo(server);  // Initialize Socket.IO

  // Handle incoming Telegram messages
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Emit the new message to all connected clients via Socket.IO
    io.emit('newMessage', { chatId, text });

    // Respond to the user
    bot.sendMessage(chatId, 'You sent: ' + text);
  });

  // Start the server
  server.listen(PORT, () => {
    console.log('App is listening on port', PORT);
    if (opts.keepalive) keepAlive();  // Keep the server alive if the option is set
  });

  // Handle WebSocket connections
  io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send a welcome message to the client
    socket.emit('welcome', 'Welcome to the server!');
    
    // Handle client disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = connect;
