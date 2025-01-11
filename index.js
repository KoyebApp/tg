const chalk = require('chalk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { mongoDB, mongoDBV2 } = require('./lib/mongoDB');
const CloudDBAdapter = require('./lib/cloudDBAdapter');
const syntaxerror = require('syntax-error');

// Load environment variables from .env file
dotenv.config();

// Fetch secrets from environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX ? process.env.PREFIX.split(',') : ['/', '!', '.', '#'];  // Default to multiple prefixes

// Ensure BOT_TOKEN is provided
if (!BOT_TOKEN) {
  console.error(chalk.red("Error: BOT_TOKEN is missing in environment variables"));
  process.exit(1); // Exit the process if the token is missing
}

// Initialize Telegram bot with token
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Get the path of the plugins folder
const pluginsPath = path.join(__dirname, 'plugins');

// Dynamically import all plugins from the plugins folder using require
const loadPlugins = () => {
  const pluginFiles = fs.readdirSync(pluginsPath);
  const handlers = {};

  pluginFiles.forEach(file => {
    const pluginName = path.basename(file, '.js');
    try {
      // Dynamically import the plugin handler using require (CommonJS)
      const pluginHandler = require(path.join(pluginsPath, file));  // No .default needed in CommonJS
      handlers[pluginName.toLowerCase()] = pluginHandler; // Store plugin with lowercase key
      console.log(chalk.blue(`Successfully loaded plugin: ${pluginName}`));
    } catch (error) {
      const err = syntaxerror(fs.readFileSync(path.join(pluginsPath, file), 'utf-8'), file);
      if (err) {
        console.error(chalk.red(`Syntax error in plugin '${pluginName}':`), err);
      } else {
        console.error(chalk.yellow(`Error loading plugin '${pluginName}':`), error);
      }
    }
  });

  return handlers;
};

// Load all plugin handlers
const plugins = loadPlugins();

// Log user activity
const logUserActivity = (chatId, command) => {
  const logMessage = `[${new Date().toISOString()}] User: ${chatId} executed command: ${command}\n`;
  fs.appendFileSync('activity.log', logMessage);
};

// Main message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();  // Get the full message text
  const usedPrefix = PREFIX.find(prefix => text.startsWith(prefix));  // Check if text starts with any of the prefixes

  if (usedPrefix) {
    const command = text.substring(usedPrefix.length).trim().toLowerCase();  // Extract the command after the prefix
    logUserActivity(chatId, command);  // Log user activity

    // If the message is a command
    if (command) {
      console.log(`Received command: ${command}`);  // Debug log

      // Debugging: List all loaded plugin names
      console.log('Loaded plugins:', Object.keys(plugins));

      // If there's a plugin handler for this command, call it
      if (plugins[command]) {
        const context = {
          bot,
          text,
          usedPrefix,
          command,
          m: msg,  // Pass the full message object to the plugin
        };

        try {
          plugins[command](context);  // Call the handler with the context
          console.log(chalk.green(`Executed plugin: ${command} for chatId: ${chatId}`));
        } catch (error) {
          console.error(chalk.red(`Error executing plugin '${command}':`), error);
          bot.sendMessage(chatId, `An error occurred while processing the command '${command}'. Please try again later.`);
        }
      } else {
        // If no plugin is found, send an error message
        bot.sendMessage(chatId, "Unknown command or no plugin available for that command.");
        console.error(chalk.red(`Unknown command: ${command} from chatId: ${chatId}`));
      }
    }
  }
});

// Listen to callback queries (inline button callback)
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;

  // Handle callback query here if needed (show image, etc.)
});
