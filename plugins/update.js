const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const updateFlagPath = path.join(__dirname, 'isUpdating.flag');  // Path to store update flag file

// Function to log messages to a log file
function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync('update.log', `${timestamp} - ${message}\n`);
}

// Check if the update flag file exists (indicating the bot is updating)
function isUpdatingInProgress() {
  return fs.existsSync(updateFlagPath);
}

// Set the flag to indicate that an update is in progress
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
        await bot.sendMessage(chatId, "Update is already in progress. Please wait...");
        return;
      }

      // Set flag to indicate that update is in progress
      setUpdatingInProgress();
      logToFile('Update started.');

      // Notify user that the bot is updating
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Automatically detect the Git repository path (the directory where the bot is running)
      const gitDirectory = process.cwd();  // Using the current working directory as the repo path

      // Check if this directory is a Git repository by looking for the `.git` directory
      if (!fs.existsSync(path.join(gitDirectory, '.git'))) {
        throw new Error('This directory is not a valid Git repository.');
      }

      // Run git pull using spawn (asynchronous)
      const gitPull = spawn('git', ['pull'], { cwd: gitDirectory });

      // Handle the output of git pull
      gitPull.stdout.on('data', (data) => {
        logToFile(`Git pull output: ${data.toString()}`);
      });

      gitPull.stderr.on('data', (data) => {
        logToFile(`Git pull error: ${data.toString()}`);
      });

      gitPull.on('close', (code) => {
        if (code !== 0) {
          logToFile(`Git pull process exited with code ${code}`);
          throw new Error('Git pull failed');
        }

        logToFile('Git pull completed successfully.');

        // Run npm start using spawn (asynchronous)
        const npmStart = spawn('npm', ['start'], { cwd: gitDirectory });

        // Handle the output of npm start
        npmStart.stdout.on('data', (data) => {
          logToFile(`Npm start output: ${data.toString()}`);
        });

        npmStart.stderr.on('data', (data) => {
          logToFile(`Npm start error: ${data.toString()}`);
        });

        npmStart.on('close', (npmCode) => {
          if (npmCode !== 0) {
            logToFile(`Npm start process exited with code ${npmCode}`);
            throw new Error('npm start failed');
          }

          logToFile('Npm start completed successfully.');
          clearUpdatingInProgress();
          bot.sendMessage(chatId, "Bot has been updated and restarted successfully.");
        });
      });

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
    logToFile(`Error during update: ${error.message}`);
  }
};

module.exports = handler;
