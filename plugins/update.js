const { exec } = require('child_process');

let updateHandler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Check if the query is 'git pull'
      const sanitizedQuery = query.trim().toLowerCase();
      console.log('Received query for update:', sanitizedQuery);

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
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'git pull' for updates.");
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

module.exports = updateHandler;
