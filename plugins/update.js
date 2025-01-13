const simpleGit = require('simple-git');
const chalk = require('chalk');

const git = simpleGit();  // Initialize simple-git

const handler = async ({ bot, chatId, command, query, db, m }) => {
  // Authorized users for executing the update command (Replace with actual Telegram user IDs)
  const authorizedUsers = ['123456789', '987654321']; // Example Telegram user IDs

  // Check if the user is authorized to use the update command
  if (!authorizedUsers.includes(chatId.toString())) {
    bot.sendMessage(chatId, "You are not authorized to perform this action.");
    return;
  }

  if (command === 'update') {
    try {
      // Send a message indicating that the update process is starting
      bot.sendMessage(chatId, "Starting the update process... Please wait.");

      // Perform the git pull operation to fetch the latest changes from the repository
      const updateResult = await git.pull('origin', 'main');  // Change 'main' to the appropriate branch if necessary

      if (updateResult && updateResult.summary.changes === 0) {
        // No changes were pulled, the repository is already up-to-date
        bot.sendMessage(chatId, "The bot is already up to date. No changes found.");
        return;
      }

      // If there are changes, get the log of recent commits
      const log = await git.log();

      let commitMessages = 'Here are the recent changes made:\n';
      log.all.forEach((commit, index) => {
        commitMessages += `\n${index + 1}. ${commit.date} - ${commit.message} (by ${commit.author_name})`;
      });

      // Send the commit messages to the user
      bot.sendMessage(chatId, commitMessages);

      // Optionally: Restart the bot after the update
      console.log(chalk.green('Bot updated. Restarting...'));
      bot.sendMessage(chatId, "Update completed successfully. Restarting the bot...");
      process.exit(0);  // This will cause the process to exit, which should trigger the bot manager (like PM2) to restart the bot.

    } catch (error) {
      console.error(chalk.red('Error during update: '), error);
      bot.sendMessage(chatId, `An error occurred while updating: ${error.message}`);
    }
  } else {
    // Handle cases where the command is not 'update'
    bot.sendMessage(chatId, `Unknown command: ${command}`);
  }
};
module.exports = handler;
