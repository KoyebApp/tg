const { exec } = require('child_process');

let restartHandler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Check if the query is 'npm start'
      const sanitizedQuery = query.trim().toLowerCase();
      console.log('Received query for restart:', sanitizedQuery);

      if (sanitizedQuery === 'npm start') {
        console.log('Running npm start command...');
        // Run npm start command
        exec('npm start', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing npm start: ${error}`);
            bot.sendMessage(chatId, "Failed to start the bot. Please check the server logs.");
            return;
          }
          if (stderr) {
            console.error(`npm start stderr: ${stderr}`);
          }
          console.log(`npm start stdout: ${stdout}`);
          bot.sendMessage(chatId, "Bot restarted successfully with 'npm start'!");
        });
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'npm start' to restart the bot.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error occurred during restart:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred during the restart. Please try again later.");
    }
  }
};

module.exports = restartHandler;
