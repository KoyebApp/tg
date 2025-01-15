const { exec } = require('child_process');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Ensure the query is empty or matches 'update'
      const sanitizedQuery = query.trim().toLowerCase();

      // If the query is 'update' (or empty), trigger 'git pull' by default
      if (sanitizedQuery === 'update' || sanitizedQuery === '') {
        // Execute the git pull command
        exec('git pull', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing git pull: ${error}`);
            bot.sendMessage(chatId, "An error occurred while executing git pull. Please try again later.");
          }

          // If there's any stderr output, log it
          if (stderr) {
            console.error(`git pull stderr: ${stderr}`);
          }

          // Split stdout into lines
          const outputLines = stdout.split('\n');
          
          // Prepare the message to be sent (limit to 10 lines)
          let message = outputLines.slice(0, 10).join('\n');
          if (outputLines.length > 10) {
            message += '\n... Read more';
          }

          // Send the message back to the chat
          console.log(`git pull stdout: ${stdout}`);
          bot.sendMessage(chatId, message);

          // Stop and restart the PM2 process (Qasim) regardless of the git pull result
          exec('pm2 stop Qasim', (stopError, stopStdout, stopStderr) => {
            if (stopError) {
              console.error(`Error stopping pm2 process: ${stopError}`);
              bot.sendMessage(chatId, "An error occurred while stopping the process. Please try again later.");
              return;
            }

            // Restart the PM2 process (Qasim)
            exec('pm2 start Qasim', (startError, startStdout, startStderr) => {
              if (startError) {
                console.error(`Error restarting pm2 process: ${startError}`);
                bot.sendMessage(chatId, "An error occurred while restarting the process. Please try again later.");
                return;
              }

              // Log successful restart if no errors
              console.log('PM2 process restarted successfully.');
            });
          });
        });
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'update' for updates.");
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

module.exports = handler;
