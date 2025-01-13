const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Common paths to look for git and bash
const GIT_PATHS = [
  '/usr/bin/git',
  '/usr/local/bin/git',
  '/bin/git',
  '/usr/sbin/git',
  '/sbin/git'
];

const SHELL_PATHS = [
  '/usr/bin/bash',
  '/bin/bash',
  '/usr/local/bin/bash',
  '/usr/sbin/bash',
  '/sbin/bash'
];

// Get executable path by checking possible locations
function getExecutablePath(paths) {
  for (let execPath of paths) {
    if (fs.existsSync(execPath)) {
      return execPath;
    }
  }
  throw new Error('Executable not found in any of the specified paths.');
}

let handler = async ({ m, bot, text }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    console.log('Received chatId:', chatId);

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Notify user that the bot is updating
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Try to find the correct git and bash paths
      const gitPath = getExecutablePath(GIT_PATHS);
      const shellPath = getExecutablePath(SHELL_PATHS);

      // Automatically detect the Git repository path (the directory where the bot is running)
      const gitDirectory = process.cwd();  // Using the current working directory as the repo path

      // Check if this directory is a Git repository by looking for the `.git` directory
      if (!fs.existsSync(path.join(gitDirectory, '.git'))) {
        throw new Error('This directory is not a valid Git repository.');
      }

      // Run git pull directly
      let stdout = execSync(`${gitPath} pull`, { cwd: gitDirectory });

      // Reload plugins after update (assumes reload logic is correct)
      fs.readdirSync('plugins').forEach(v => global.reload && global.reload('', v));

      // Send the output of git pull command
      await bot.sendMessage(chatId, stdout.toString());

      // Restart the bot using pm2
      execSync('pm2 restart Qasim');  // Replace <your-bot-name> with the actual name of your bot process in pm2
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error("Error during update:", error);
    if (error.message.includes("chatId is undefined")) {
      console.error("The chatId is not being passed correctly. Check your message format.");
    }
    // Ensure chatId is available for sending error message
    if (chatId) {
      await bot.sendMessage(chatId, "An error occurred while updating the bot. Please try again later.");
    } else {
      console.error("chatId is not available to send error message.");
    }
  }
};

module.exports = handler;
