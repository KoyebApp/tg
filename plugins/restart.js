const { exec } = require('child_process');

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
        // Stop the pm2 process for 'Qasim'
        exec('pm2 stop Qasim', { cwd: process.cwd() }, (stopError, stopStdout, stopStderr) => {
          if (stopError) {
            console.error(`Error stopping pm2 process: ${stopError}`);
            bot.sendMessage(chatId, "Failed to stop the bot with pm2. Please check the server logs.");
            return;
          }
          if (stopStderr) {
            console.error(`pm2 stop stderr: ${stopStderr}`);
            bot.sendMessage(chatId, "There was an issue stopping the bot with pm2.");
            return;
          }

          console.log(`pm2 stop stdout: ${stopStdout}`);

          // Now, restart the bot with pm2
          exec('pm2 start . --attach --name Qasim', { cwd: process.cwd() }, (startError, startStdout, startStderr) => {
            if (startError) {
              console.error(`Error executing pm2 start: ${startError}`);
              bot.sendMessage(chatId, "Failed to start the bot with pm2. Please check the server logs.");
              return;
            }

            if (startStderr) {
              console.error(`pm2 start stderr: ${startStderr}`);
              bot.sendMessage(chatId, "There was an issue starting the bot with pm2.");
              return;
            }

            // If everything works fine, send success message
            console.log(`pm2 start stdout: ${startStdout}`);
            bot.sendMessage(chatId, "Bot restarted successfully using pm2 (Qasim)!");
          });
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

module.exports = handler;
