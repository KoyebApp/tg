const { exec } = require('child_process');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Check what query is coming in for debugging purposes
      console.log('Received query:', query);

      const sanitizedQuery = query.trim().toLowerCase();
      console.log('Sanitized query:', sanitizedQuery);

      if (sanitizedQuery === 'git pull') {
        console.log('Running git pull command...');
        // Run git pull command
        exec('git pull', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing git pull: ${error}`);
            bot.sendMessage(chatId, "An error occurred while executing git pull. Please try again later.");
            return;
          }
          if (stderr) {
            console.error(`git pull stderr: ${stderr}`);
          }
          console.log(`git pull stdout: ${stdout}`);
          bot.sendMessage(chatId, "Git pull completed successfully!");
        });
      } else if (sanitizedQuery === 'npm start') {
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
          bot.sendMessage(chatId, "Npm start completed successfully!");
        });
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'git pull' or 'npm start'.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Provide feedback to user and log the error
    console.error('Error occurred:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred. Please try again later.");
    }
  }
};

module.exports = handler;
