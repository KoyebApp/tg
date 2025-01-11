const { fileURLToPath } = require('url');
const { dirname } = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
// Instead of using require, use dynamic import for 'lowdb'
const { Low, JSONFile } = require('lowdb');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const { mongoDB, mongoDBV2 } = require('./lib/mongoDB');
const CloudDBAdapter = require('./lib/cloudDBAdapter');
const syntaxerror = require('syntax-error');
const chalk = require('chalk');

// Define __filename and __dirname manually for CommonJS
const __filename = fileURLToPath(require.resolve('./index.js'));
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Fetch secrets from environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const BOT_TOKEN = process.env.BOT_TOKEN;

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

    // Initialize LowDB with 'database.json'
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
