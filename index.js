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
const PREFIX = process.env.PREFIX ? process.env.PREFIX.split(',') : ['/', '!', '.', '*', '"', ':', ';', '?', '(', ')', '+', '-', '&', '_', '$', '#'];

// Ensure BOT_TOKEN is provided
if (!BOT_TOKEN) {
  console.error(chalk.red("Error: BOT_TOKEN is missing in environment variables"));
  process.exit(1); // Exit the process if the token is missing
}

const bot = new TelegramBot(BOT_TOKEN, {
  polling: {
    enabled: true,
    params: {
      timeout: 10, // Define the polling timeout (in seconds)
    }
  }
});

// Get the path of the plugins folder
const pluginsPath = path.join(__dirname, 'plugins');

// Database configuration and initialization
const dbConfig = {
  type: DATABASE_URL ? 'mongodb' : 'lowdb',
  version: 'v2',
  url: DATABASE_URL || 'database.json',
};

// Check if database.json exists, if not, create it
const ensureLowDbExists = async () => {
  const dbFilePath = path.join(__dirname, 'database.json');

  if (!fs.existsSync(dbFilePath)) {
    const defaultData = { data: [] };
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2));
    console.log(chalk.green('database.json created successfully with default structure.'));
  }
};

// Database initialization function
const initDatabase = async () => {
  let db;

  if (!dbConfig.url || dbConfig.type === 'lowdb') {
    await ensureLowDbExists();

    const { Low, JSONFile } = await import('lowdb');
    db = new Low(new JSONFile('database.json'));
    await db.read();
    console.log(chalk.green('LowDB initialized successfully with database.json'));
  } else {
    try {
      if (dbConfig.type === 'mongodb') {
        db = dbConfig.version === 'v2' ? new mongoDBV2(dbConfig.url) : new mongoDB(dbConfig.url);
      } else if (dbConfig.type === 'cloud') {
        db = await CloudDBAdapter(dbConfig.url);
      }
      console.log(chalk.green('Database initialized successfully'));
    } catch (err) {
      console.error(chalk.red('Error initializing database:'), err);
      process.exit(1);
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

    const stat = fs.lstatSync(pluginPath);

    if (stat.isFile() && file.endsWith('.js')) {
      const pluginName = path.basename(file, '.js');
      try {
        const pluginHandler = require(pluginPath);
        
        if (pluginHandler.command) {
          pluginHandler.command.forEach(command => {
            handlers[command.toLowerCase()] = pluginHandler;
          });
        }

        if (pluginHandler.callbackQuery) {
          pluginHandler.callbackQuery.forEach(callbackData => {
            handlers[`callback_${callbackData.toLowerCase()}`] = pluginHandler;
          });
        }

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
  const text = msg.text?.trim(); // Optional chaining to ensure it's not undefined
  if (!text) return; // If no text, return early

  const usedPrefix = PREFIX.find(prefix => text.startsWith(prefix));
  if (usedPrefix) {
    const commandWithQuery = text.substring(usedPrefix.length).trim();
    const [command, ...queryArr] = commandWithQuery.split(' ');
    const query = queryArr.join(' ').trim();
    const normalizedCommand = command.toLowerCase();

    console.log('Loaded plugins:', Object.keys(plugins));
    console.log(`Attempting to invoke handler for command: ${normalizedCommand}`);

    const handler = plugins[normalizedCommand];

    if (handler) {
      let context = { 
        bot, 
        m: msg, 
        text, 
        query, 
        usedPrefix, 
        command: normalizedCommand,
        db,
        args: queryArr
      };

      try {
        console.log(`Executing plugin for command: ${normalizedCommand}`);
        handler(context);
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

// Polling error handler
bot.on('polling_error', (error) => {
  console.error('Polling error occurred:', error);
  
  setTimeout(() => {
    try {
      bot.stopPolling();
      bot.startPolling();
      console.log('Polling restarted after error.');
    } catch (err) {
      console.error('Error restarting polling:', err);
    }
  }, 3000); // Retry after 3 seconds.
});

// Callback query handler
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const callbackData = callbackQuery.data;
  const normalizedCallbackData = callbackData.toLowerCase();

  console.log(`Handling callback query: ${normalizedCallbackData}`);

  const handler = plugins[`callback_${normalizedCallbackData}`];

  if (handler) {
    let context = {
      bot,
      callbackQuery,
      chatId,
      callbackData: normalizedCallbackData,
      message: callbackQuery.message,
    };

    try {
      console.log(`Executing plugin for callback query: ${normalizedCallbackData}`);
      await handler(context);
      console.log(chalk.green(`Executed callback handler: ${normalizedCallbackData} for chatId: ${chatId}`));
    } catch (error) {
      console.error(chalk.red(`Error executing callback handler '${normalizedCallbackData}':`), error);
      bot.sendMessage(chatId, `An error occurred while processing the callback query '${normalizedCallbackData}'. Please try again later.`);
    }
  } else {
    console.error(chalk.red(`Unknown callback query: ${normalizedCallbackData} from chatId: ${chatId}`));
  }
});
