const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const updateFlagPath = path.join(__dirname, 'isUpdating.flag');  // Path to store update flag file

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

// Check if the update flag file exists (indicating the bot is updating)
function isUpdatingInProgress() {
  return fs.existsSync(updateFlagPath);
}

// Set the flag file to indicate that an update is in progress
function setUpdatingInProgress() {
  fs.writeFileSync(updateFlagPath, 'true');
}

// Clear the flag file after update is complete
function clearUpdatingInProgress() {
  if (fs.existsSync(updateFlagPath)) {
    fs.unlinkSync(updateFlagPath);
  }
}

let handler = async ({ m, bot, text }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Ensure flag is cleared if no update is in progress
      if (isUpdatingInProgress()) {
        // If the flag exists, it means an update is still marked as in progress
        await bot.sendMessage(chatId, "Update is already in progress. Please wait...");
        return;
      }

      // Set flag to indicate that update is in progress
      setUpdatingInProgress();

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
      execSync(`${gitPath} pull`, { cwd: gitDirectory });

      // Reload plugins after update
      fs.readdirSync('plugins').forEach(v => global.reload && global.reload('', v));

      // Clear the update flag before restarting the bot
      clearUpdatingInProgress();

      // Restart the bot using pm2
      try {
        execSync('pm2 restart my-bot-name');  // Replace `my-bot-name` with your actual pm2 process name or ID
      } catch (err) {
        await bot.sendMessage(chatId, "Failed to restart the bot. Please check the server logs.");
      }

    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Clear the updating flag in case of any errors
    clearUpdatingInProgress();

    // Provide feedback to user
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while updating the bot. Please try again later.");
    }
  }
};

module.exports = handler;
