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
          // If there's any stderr output from git pull, log it
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

          // Use the full path to pm2 (adjust the path according to your system)
          const pm2Path = '/usr/bin/pm2'; // Adjust to the correct path for pm2 in your system

          // Stop the PM2 process (Qasim)
          exec(`${pm2Path} stop qasim`, (stopError, stopStdout, stopStderr) => {
            console.log("Stopping PM2 process...");
            if (stopError) {
              console.error(`Error stopping pm2 process: ${stopError}`);
              bot.sendMessage(chatId, "An error occurred while stopping the process. Please try again later.");
              return;
            }
            console.log("PM2 stop output:", stopStdout);
            console.error("PM2 stop error:", stopStderr);

            // Restart the PM2 process (Qasim)
            exec(`${pm2Path} start qasim`, (startError, startStdout, startStderr) => {
              console.log("Restarting PM2 process...");
              if (startError) {
                console.error(`Error restarting pm2 process: ${startError}`);
                bot.sendMessage(chatId, "An error occurred while restarting the process. Please try again later.");
                return;
              }
              console.log("PM2 start output:", startStdout);
              console.error("PM2 start error:", startStderr);
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
