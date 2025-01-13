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

// Database configuration and initialization
const dbConfig = {
  type: DATABASE_URL ? 'mongodb' : 'lowdb',    // 'mongodb' or 'lowdb' based on presence of DATABASE_URL
  version: 'v2',                                // Optional (if 'mongodb' is used, specify version 'v1' or 'v2')
  url: DATABASE_URL || 'database.json',         // MongoDB URL or LowDB file path
};

// Ensure the database.json file exists and create it if not
const ensureLowDbExists = async () => {
  const dbFilePath = path.join(__dirname, 'database.json');

  // Check if the database.json file exists
  if (!fs.existsSync(dbFilePath)) {
    // If not, create it with default structure
    const defaultData = { data: [] };
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2));
    console.log(chalk.green('database.json created successfully with default structure.'));
  }
};

// Database initialization function
const initDatabase = async () => {
  let db;

  if (!dbConfig.url || dbConfig.type === 'lowdb') {
    // Ensure the database.json file exists and create it if necessary
    await ensureLowDbExists();

    // Dynamically import LowDB (ESM Import inside async function)
    const { Low, JSONFile } = await import('lowdb');  // Use dynamic import
    db = new Low(new JSONFile('database.json'));
    await db.read();  // Read data from the file
    console.log(chalk.green('LowDB initialized successfully with database.json'));
  } else {
    try {
      // MongoDB or CloudDB initialization
      if (dbConfig.type === 'mongodb') {
        // MongoDB connection
        if (dbConfig.version === 'v2') {
          db = new mongoDBV2(dbConfig.url);  // Connect to MongoDB v2
        } else {
          db = new mongoDB(dbConfig.url);    // Connect to MongoDB v1
        }
      } else if (dbConfig.type === 'cloud') {
        // CloudDB connection
        db = await CloudDBAdapter(dbConfig.url);  // Connect to cloud DB
      }
      console.log(chalk.green('Database initialized successfully'));
    } catch (err) {
      console.error(chalk.red('Error initializing database:'), err);
      process.exit(1);  // Critical error: stop the process, PM2 will restart the bot
    }
  }

  return db;
};

// Initialize the database
let db = null;
initDatabase().then(database => {
  if (database) {
    db = database;
    console.log(chalk.green('Database initialized successfully'));
  } else {
    console.log(chalk.red('Failed to initialize database'));
  }
}).catch(err => {
  console.error(chalk.red('Error initializing database:'), err);
});


const loadPlugins = () => {
  const pluginFiles = fs.readdirSync(pluginsPath);
  const handlers = {};

  // Log the plugin files detected in the directory
  console.log(`Plugin files in directory:`, pluginFiles);

  pluginFiles.forEach(file => {
    const pluginName = path.basename(file, '.js');
    try {
      const pluginPath = path.join(pluginsPath, file);
      console.log(`Loading plugin from: ${pluginPath}`);  // Log the path being loaded

      const pluginHandler = require(pluginPath);

      if (pluginHandler.command && pluginHandler.handler) {
        pluginHandler.command.forEach(command => {
          handlers[command.toLowerCase()] = pluginHandler.handler;
          console.log(`Loaded command: ${command.toLowerCase()}`);  // Log each command loaded
        });
      } else {
        console.warn(`Plugin '${pluginName}' does not have both 'command' and 'handler' exports.`);
      }

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

  console.log('Final handlers:', handlers);  // Log the final handlers object
  return handlers;
};

// Load all plugin handlers
const plugins = loadPlugins();

// Log user activity
const logUserActivity = (chatId, command) => {
  const logMessage = `[${new Date().toISOString()}] User: ${chatId} executed command: ${command}\n`;
  fs.appendFileSync('activity.log', logMessage);
};

// Bot message handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();  // Get the full message text

  // Debug: Log the received message text
  console.log(`Received message: ${text}`);

  const usedPrefix = PREFIX.find(prefix => text.startsWith(prefix));  // Check if text starts with any of the prefixes

  // Debug: Log the used prefix
  console.log(`Used prefix: ${usedPrefix}`);

  if (usedPrefix) {
    const command = text.substring(usedPrefix.length).trim().toLowerCase();  // Extract the command after the prefix
    logUserActivity(chatId, command);  // Log user activity

    // If the message is a command
    if (command) {
      console.log(`Received command: ${command}`);  // Debug log

      // Debugging: List all loaded commands
      console.log('Loaded commands:', Object.keys(plugins));

      // If there's a plugin handler for this command, call it
      if (plugins[command]) {
        const context = {
          bot,
          text,
          query,
          usedPrefix,
          command,
          m: msg,  // Pass the full message object to the plugin
          db,  // Pass the database instance to the plugin
        };

        try {
          await plugins[command](context);  // Execute the handler with the context
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
