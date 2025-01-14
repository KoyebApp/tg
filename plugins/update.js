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
  console.log('Setting update flag...');
  fs.writeFileSync(updateFlagPath, 'true');
}

// Clear the flag file after update is complete
function clearUpdatingInProgress() {
  if (fs.existsSync(updateFlagPath)) {
    console.log('Clearing update flag...');
    fs.unlinkSync(updateFlagPath);
  } else {
    console.log('No update flag found to clear.');
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
      console.log('Checking if update is in progress...');
      if (isUpdatingInProgress()) {
        // If the flag exists, it means an update is still marked as in progress
        await bot.sendMessage(chatId, "Update is already in progress. Please wait...");
        return;
      }

      console.log('Setting update in progress...');
      setUpdatingInProgress();

      // Notify user that the bot is updating
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Run git pull and npm start in the current directory
      const gitDirectory = process.cwd();  // Using the current working directory as the repo path

      try {
        console.log('Running git pull...');
        execSync('git pull', { cwd: gitDirectory });

        console.log('Running npm start...');
        execSync('npm start', { cwd: gitDirectory });

        console.log('Update completed successfully.');
        await bot.sendMessage(chatId, "Bot update completed successfully!");
      } catch (err) {
        console.error('Error during git pull or npm start:', err);
        await bot.sendMessage(chatId, "There was an error during the update. Please check the logs.");
      }

      // Clear the update flag after the update process is complete
      clearUpdatingInProgress();

    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Ensure the flag is cleared even if an error occurs
    clearUpdatingInProgress();
    console.error('Error during update process:', error);

    // Provide feedback to the user
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while updating the bot. Please try again later.");
    }
  }
};

module.exports = handler;
