const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path'); // for handling paths

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    
    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      console.log("Starting git pull...");
      
      // Execute the git pull command and capture any output or errors
      let stdout;
      let stderr;
      try {
        stdout = execSync('git pull' + (query ? ' ' + query : ''));
      } catch (error) {
        stderr = error.stderr.toString(); // Capture the stderr if there's an error
        console.error('Error during git pull:', stderr);
        stdout = error.stdout.toString(); // Capture the stdout in case of an error
      }

      // Send the git pull output to the chat
      const message = stdout || stderr;
      await bot.sendMessage(chatId, message);

      // Only restart PM2 after the message is sent
      console.log("Restarting PM2 process...");
      const currentDirectory = process.cwd();
      try {
        execSync('pm2 restart qasim', { cwd: currentDirectory });
        console.log("Successfully restarted PM2 process.");
      } catch (pm2Error) {
        console.error("Error restarting PM2:", pm2Error);
        await bot.sendMessage(chatId, "An error occurred while restarting PM2.");
      }

    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error occurred during update:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred during the update. Please try again later.");
    }
  }
};

// Define the necessary properties for the plugin
handler.command = ['update', 'actualizar', 'fix', 'fixed']; // Command list
handler.help = ['update'];  // Help message list
handler.tags = ['owner'];   // Tags for categorization

module.exports = handler;
