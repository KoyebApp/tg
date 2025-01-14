const { exec } = require('child_process');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      const sanitizedQuery = query.trim().toLowerCase();

      if (sanitizedQuery === 'restart') {
        // Run pm2 restart Qasim by default
        exec('pm2 restart Qasim', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing pm2 restart: ${error}`);
            bot.sendMessage(chatId, "Failed to restart the bot with pm2. Please check the server logs.");
            return;
          }

          // If there's any stderr output
          if (stderr) {
            console.error(`pm2 restart stderr: ${stderr}`);
          }

          // Send the success message after pm2 restart
          console.log(`pm2 restart stdout: ${stdout}`);
          bot.sendMessage(chatId, "Bot restarted successfully using pm2 (Qasim)!");

          // Optionally, you can run npm start after pm2 restart if needed
          exec('npm start', { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing npm start: ${error}`);
              bot.sendMessage(chatId, "Failed to start the bot with npm start. Please check the server logs.");
              return;
            }

            // If there's any stderr output
            if (stderr) {
              console.error(`npm start stderr: ${stderr}`);
            }

            // Send the success message after npm start
            console.log(`npm start stdout: ${stdout}`);
            bot.sendMessage(chatId, "Npm start completed successfully!");
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
