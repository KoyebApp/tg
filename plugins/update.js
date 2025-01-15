const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path'); // for handling paths

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    
    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Execute the git pull command
      console.log("Starting git pull...");
      let stdout = execSync('git pull' + (query ? ' ' + query : ''));

      // Reload plugins (make sure to access the correct directory)
      const pluginsPath = path.join(__dirname, '../plugins'); // Correct path to plugins folder
      console.log("Reloading plugins...");
      fs.readdirSync(pluginsPath).forEach((plugin) => {
        try {
          // Only require JavaScript files (.js) in the plugins folder
          if (plugin.endsWith('.js')) {
            const pluginPath = path.join(pluginsPath, plugin);
            delete require.cache[require.resolve(pluginPath)]; // Remove cached version
            require(pluginPath); // Require the new version of the plugin
            console.log(`Successfully reloaded plugin: ${plugin}`);
          }
        } catch (error) {
          console.error(`Error reloading plugin ${plugin}:`, error);
        }
      });

      // Send the git pull output to the chat
      bot.sendMessage(chatId, stdout.toString());

      // Restart PM2 process (using the current working directory)
      const currentDirectory = process.cwd();
      console.log("Stopping PM2 process...");
      execSync('pm2 stop qasim', { cwd: currentDirectory });
      console.log("Restarting PM2 process...");
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
