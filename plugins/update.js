const { exec } = require('child_process');

// Define the handler function that processes the update command
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
        // Use the current working directory for both git pull and pm2
        const currentDirectory = process.cwd();

        // Execute the git pull command
        exec('git pull', { cwd: currentDirectory }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error during git pull: ${error.message}`);
            bot.sendMessage(chatId, "An error occurred while updating. Please try again later.");
            return;
          }

          if (stderr) {
            console.error(`git pull stderr: ${stderr}`);
          }

          // Split stdout into lines (git pull output)
          const outputLines = stdout.split('\n');
          
          // Prepare the message to be sent (limit to 10 lines)
          let message = outputLines.slice(0, 10).join('\n');
          if (outputLines.length > 10) {
            message += '\n... Read more';
          }

          // Send the message back to the chat with the output of the git pull
          console.log(`git pull stdout: ${stdout}`);
          bot.sendMessage(chatId, message);

          // Stop the PM2 process (Qasim) using the same directory
          exec('pm2 stop qasim', { cwd: currentDirectory }, (stopError, stopStdout, stopStderr) => {
            if (stopError) {
              console.error(`Error stopping pm2 process: ${stopError.message}`);
              bot.sendMessage(chatId, "An error occurred while stopping the process. Please try again later.");
              return;
            }
            console.log("PM2 stop output:", stopStdout);

            // Restart the PM2 process (Qasim) using the same directory
            exec('pm2 start qasim', { cwd: currentDirectory }, (startError, startStdout, startStderr) => {
              if (startError) {
                console.error(`Error restarting pm2 process: ${startError.message}`);
                bot.sendMessage(chatId, "An error occurred while restarting the process. Please try again later.");
                return;
              }
              console.log("PM2 start output:", startStdout);
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

// Define the necessary properties for the plugin
  handler.help: ['update'],  // List of commands that trigger this plugin
  handler.tags: ['owner'],   // Tags for categorization
  handler.command: ['update'], // Command that this plugin responds to
  module.exports = handler,
