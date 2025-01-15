/* const { execSync, exec } = require('child_process');

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

      // Restart the bot after git pull
      console.log("Stopping and restarting the bot...");

      // Exit the current process
      process.exit(); // This stops the bot process

      // Spawning a new process to restart the bot
      exec('node index.js', (err, stdout, stderr) => {
        if (err) {
          console.error('Error restarting the bot:', err);
          return;
        }
        if (stderr) {
          console.error('stderr:', stderr);
        }
        console.log('Bot restarted successfully');
      });

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
*/
