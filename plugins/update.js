const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const updateFlagPath = path.join(__dirname, 'isUpdating.flag');  // Path to store update flag file

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
  try {
    if (fs.existsSync(updateFlagPath)) {
      fs.unlinkSync(updateFlagPath);  // Remove the flag file
    }
  } catch (error) {
    console.error('Error while clearing the update flag:', error);
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
      // Check if update is already in progress
      if (isUpdatingInProgress()) {
        // If the flag exists, it means an update is still marked as in progress
        await bot.sendMessage(chatId, "Update is already in progress. Please wait...");
        return;
      }

      // Set flag to indicate that update is in progress
      setUpdatingInProgress();

      // Notify user that the update is starting
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Run git pull to update the repo
      try {
        execSync('git pull', { stdio: 'inherit' });
      } catch (err) {
        throw new Error('Git pull failed: ' + err.message);
      }

      // Run npm start to restart the bot
      try {
        execSync('npm start', { stdio: 'inherit' });
      } catch (err) {
        throw new Error('npm start failed: ' + err.message);
      }

      // Clear the update flag after successful update
      clearUpdatingInProgress();

      // Notify user about the successful update
      await bot.sendMessage(chatId, "Bot updated and restarted successfully.");
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Handle errors and clear the update flag
    clearUpdatingInProgress();
    console.error('Error during update process:', error);

    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while updating the bot. Please try again later.");
    }
  }
};

module.exports = handler;
