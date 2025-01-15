/*const { exec } = require('child_process');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Normalize the query and default to 'restart' if no query is provided
      const sanitizedQuery = (query && query.trim().toLowerCase()) || 'restart';  // Default to 'restart' if query is empty
      console.log(`Received query: "${sanitizedQuery}"`);  // Log query for debugging

      // If the query is 'restart' or empty (default)
      if (sanitizedQuery === 'restart') {
        // Inform the user that the bot will restart
        bot.sendMessage(chatId, "Bot will restart. Please wait...");

        // Exit the process to trigger a restart
        console.log('Bot restart initiated...');
        process.exit();  // This will stop the bot process, which will trigger a restart if handled by a wrapper or external script

        // After exiting, spawn a new bot process (make sure to replace 'node bot.js' with your start command)
        exec('node index.js', (err, stdout, stderr) => {
          if (err) {
            console.error('Error restarting bot:', err);
            return;
          }
          if (stderr) {
            console.error('stderr:', stderr);
            return;
          }
          console.log('Bot restarted successfully');
        });
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'restart' to restart the bot.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error occurred during restart:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred during restart. Please try again later.");
    }
  }
};

handler.command = ['restart']; // Command list
handler.help = ['update'];  // Help message list
handler.tags = ['owner'];   // Tags for categorization

module.exports = handler;
*/
