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

// Check if database.json exists, if not, create it
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

// Dynamically import all plugins from the plugins folder using require
const loadPlugins = () => {
  const pluginFiles = fs.readdirSync(pluginsPath);
  const handlers = {};

  pluginFiles.forEach(file => {
    const pluginPath = path.join(pluginsPath, file);

    // Check if it's a file (not a directory)
    const stat = fs.lstatSync(pluginPath);

    if (stat.isFile() && file.endsWith('.js')) {  // Ensure it's a .js file
      const pluginName = path.basename(file, '.js');
      try {
        // Dynamically import the plugin handler using require (CommonJS)
        const pluginHandler = require(pluginPath);  // No .default needed in CommonJS
        handlers[pluginName.toLowerCase()] = pluginHandler; // Store plugin with lowercase key
        console.log(chalk.blue(`Successfully loaded plugin: ${pluginName}`));
      } catch (error) {
        const err = syntaxerror(fs.readFileSync(pluginPath, 'utf-8'), file);
        if (err) {
          console.error(chalk.red(`Syntax error in plugin '${pluginName}':`), err);
        } else {
          console.error(chalk.yellow(`Error loading plugin '${pluginName}':`), error);
        }
      }
    } else {
      console.warn(chalk.yellow(`Skipping directory or non-JS file: ${file}`));
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
    // Extract the command and query
    const commandWithQuery = text.substring(usedPrefix.length).trim();
    const [command, ...queryArr] = commandWithQuery.split(' ');  // Split the command and query
    const query = queryArr.join(' ').trim();  // Join the remaining words as query
    const normalizedCommand = command.toLowerCase();

    // Log the loaded plugins and the handler we're trying to call
    console.log('Loaded plugins:', Object.keys(plugins));
    console.log(`Attempting to invoke handler for command: ${normalizedCommand}`);

    const handler = plugins[normalizedCommand];

    if (handler) {
      // Build context based on command type
      let context = { 
        bot, 
        m: msg, 
        text, 
        query, 
        usedPrefix, 
        command: normalizedCommand,
        db,
        args: queryArr  // Add args as the array of query parts
      };

      // Execute the plugin handler
      try {
        console.log(`Executing plugin for command: ${normalizedCommand}`);
        handler(context);  // Call the handler with the dynamic context
        console.log(chalk.green(`Executed plugin: ${normalizedCommand} for chatId: ${chatId}`));
      } catch (error) {
        console.error(chalk.red(`Error executing plugin '${normalizedCommand}':`), error);
        bot.sendMessage(chatId, `An error occurred while processing the command '${normalizedCommand}'. Please try again later.`);
      }
    } else {
      bot.sendMessage(chatId, "Unknown command or no plugin available for that command.");
      console.error(chalk.red(`Unknown command: ${normalizedCommand} from chatId: ${chatId}`));
    }
  }
});
