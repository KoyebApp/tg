import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import CloudDBAdapter from './lib/cloudDBAdapter.js';
import syntaxerror from 'syntax-error';
import chalk from 'chalk'; // Importing Chalk for colored console logs

// Initialize Telegram bot with token
const token = '7671426273:AAGr3rG4-8lWdP-nh1Xgat4wVYFF5X99MgA';
const bot = new TelegramBot(token, { polling: true });

// Get the path of the plugins folder
const pluginsPath = path.join(__dirname, 'plugins');

// Database configuration and initialization
const dbConfig = {
  type: 'mongodb',    // 'mongodb', 'cloud', or 'lowdb'
  version: 'v2',      // Optional (if 'mongodb' is used, specify version 'v1' or 'v2')
  url: 'YOUR_MONGO_URL',   // MongoDB URL or Cloud DB URL or LowDB file path
};

// Database initialization function
const initDatabase = async () => {
  let db;

  if (dbConfig.url && dbConfig.type === 'mongodb') {
    // MongoDB connection
    if (dbConfig.version === 'v2') {
      db = await mongoDBV2(dbConfig.url);  // Connect to MongoDB v2
    } else {
      db = await mongoDB(dbConfig.url);    // Connect to MongoDB v1
    }
  } else if (dbConfig.type === 'cloud') {
    // CloudDB connection
    db = await CloudDBAdapter(dbConfig.url);  // Connect to cloud DB
  } else {
    // Use LowDB (local file storage)
    db = new Low(new JSONFile('database.json'));  // Default to 'database.json'
    await db.read();  // Read data from the file
  }

  return db;
};

// Initialize the database
let db = null;
initDatabase().then(database => {
  db = database;
  console.log(chalk.green('Database initialized successfully'));
}).catch(err => {
  console.error(chalk.red('Error initializing database:'), err);
});

// Dynamically import all plugins from the plugins folder
const loadPlugins = () => {
  const pluginFiles = fs.readdirSync(pluginsPath);
  const handlers = {};

  pluginFiles.forEach(file => {
    const pluginName = path.basename(file, '.js');
    try {
      const pluginHandler = require(path.join(pluginsPath, file)).default;
      handlers[pluginName] = pluginHandler;
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

// Handle scheduled jobs (e.g., daily reminders)
schedule.scheduleJob('0 9 * * *', () => {
  const chatId = 'your_chat_id'; // Replace with a valid chatId
  bot.sendMessage(chatId, "Good morning! Don't forget to check your tasks for today!");
});

// Main message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.toLowerCase();  // Convert the command to lowercase

  logUserActivity(chatId, command);  // Log user activity

  // If the message is a command (starts with '/')
  if (command.startsWith('/')) {
    // Remove '/' from the command and get the plugin name (e.g., '/alive' -> 'alive')
    const pluginName = command.split(' ')[0].substring(1); // '/alive' -> 'alive'

    // If there's a plugin handler for this command, call it
    if (plugins[pluginName]) {
      // Create the context object to pass to the plugin handler
      const context = {
        bot,
        text: msg.text,
        usedPrefix: '/',  // You can define a different prefix if needed
        command: pluginName,
        m: msg,  // Pass the full message object to the plugin
        db,  // Pass the database instance to the plugin
      };

      // Call the plugin handler with the context
      plugins[pluginName](context);
      console.log(chalk.green(`Executed plugin: ${pluginName} for chatId: ${chatId}`));
    } else {
      // If no plugin is found, send an error message
      bot.sendMessage(chatId, "Unknown command or no plugin available for that command.");
      console.error(chalk.red(`Unknown command: ${pluginName} from chatId: ${chatId}`));
    }
  }
});

// Listen to callback queries (inline button callback)
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
   
  // Handle callback query here if needed (show image, etc.)
});
