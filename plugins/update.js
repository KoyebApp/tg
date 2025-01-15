const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path'); // for handling paths

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    
    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Execute the git pull command
      let stdout = execSync('git pull' + (query ? ' ' + query : ''));

      // Reload plugins (similar to the functionality in the original code)
      const pluginsPath = path.join(__dirname, 'plugins');
      fs.readdirSync(pluginsPath).forEach((plugin) => {
        try {
          delete require.cache[require.resolve(path.join(pluginsPath, plugin))];
          require(path.join(pluginsPath, plugin));
        } catch (error) {
          console.error(`Error reloading plugin ${plugin}:`, error);
        }
      });

      // Send the git pull output to the chat
      bot.sendMessage(chatId, stdout.toString());

      // PM2 restart to apply any changes
      const currentDirectory = process.cwd();
      execSync('pm2 stop qasim', { cwd: currentDirectory });
      execSync('pm2 start qasim', { cwd: currentDirectory });

      console.log("Successfully updated and restarted PM2 process.");
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
handler.command = ['update', 'actualizar', 'fix', 'fixed']; // Command list
handler.help = ['update'];  // Help message list
handler.tags = ['owner'];   // Tags for categorization

module.exports = handler;
