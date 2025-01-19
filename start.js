const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');

// Import the `connect` function from server.js (no need to deal with express setup here)
const connect = require('./server'); // Ensure you are calling this properly for server-side logic

// Display the welcome banner
figlet('MEGA AI', { font: 'Ghost', horizontalLayout: 'default', verticalLayout: 'default' }, (err, data) => {
  if (err) {
    console.error(chalk.red('Figlet error:', err));
    return;
  }
  console.log(chalk.yellow(data));
});

figlet('Advanced Telegram Bot', { horizontalLayout: 'default', verticalLayout: 'default' }, (err, data) => {
  if (err) {
    console.error(chalk.red('Figlet error:', err));
    return;
  }
  console.log(chalk.magenta(data));
});

let isRunning = false;

// Start the application and spawn a new process
async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = __filename; // Get the current file path
  const args = [path.join(path.dirname(currentFilePath), file), ...process.argv.slice(2)];

  const p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  p.on('message', data => {
    console.log(chalk.cyan(`✔️ RECEIVED ${data}`));
    switch (data) {
      case 'reset':
        p.kill();
        isRunning = false;
        start.apply(this, arguments); // Restart the app if required
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', code => {
    isRunning = false;
    console.error(chalk.red(`❌ Exited with code: ${code}`));

    if (code === 0) return;

    // Watch for file changes and restart the app if necessary
    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0]);
      start('index.js');
    });
  });

  p.on('error', err => {
    console.error(chalk.red(`Error: ${err}`));
    p.kill();
    isRunning = false;
    start('index.js');
  });

  const pluginsFolder = path.join(path.dirname(currentFilePath), 'plugins');

  fs.readdir(pluginsFolder, async (err, files) => {
    if (err) {
      console.error(chalk.red(`Error reading plugins folder: ${err}`));
      return;
    }
    console.log(chalk.yellow(`Installed ${files.length} plugins`));

    try {
      console.log(chalk.yellow('Telegram bot is ready.'));
      // Call the connect function to start the server and the bot
      connect(null, process.env.PORT || 5000, { keepalive: true }); // Assuming you want the server to keep alive
    } catch (e) {
      console.error(chalk.red('Error initializing Telegram bot.'));
    }
  });
}

// Start the bot server with the main file
start('index.js');

process.on('unhandledRejection', () => {
  console.error(chalk.red('Unhandled promise rejection. Bot will restart...'));
  start('index.js');
});

process.on('exit', code => {
  console.error(chalk.red(`Exited with code: ${code}`));
  console.error(chalk.red('Bot will restart...'));
  start('index.js');
});
