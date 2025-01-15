const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path'); // for handling paths

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    
    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      console.log("Starting git pull...");

      // Only proceed if there's no ongoing git pull
      let gitPullInProgress = false;
      
      // Check if git pull is running (for example, checking for a lock file or process flag)
      const lockFilePath = path.join(__dirname, 'git_pull.lock');
      if (fs.existsSync(lockFilePath)) {
        await bot.sendMessage(chatId, "Git pull is already in progress. Please wait.");
        return;
      }
      
      // Create a lock file to prevent concurrent git pulls
      fs.writeFileSync(lockFilePath, 'locked'); // Creating a lock file

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

      // Always restart PM2 process after git pull, regardless of success or failure
      console.log("Restarting PM2 process...");
      const currentDirectory = process.cwd();
      try {
        execSync('pm2 restart qasim', { cwd: currentDirectory });
        console.log("Successfully restarted PM2 process.");
      } catch (pm2Error) {
        console.error("Error restarting PM2:", pm2Error);
        await bot.sendMessage(chatId, "An error occurred while restarting PM2.");
      }

      // Remove the lock file to allow future git pulls
      fs.unlinkSync(lockFilePath);
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
