const chalk = require('chalk');
const { spawn } = require('child_process');
const express = require('express');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');

// Import the `connect` function from server.js
const connect = require('./server'); // Adjust the path to server.js if needed

figlet(
  'MEGA AI',
  {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  },
  (err, data) => {
    if (err) {
      console.error(chalk.red('Figlet error:', err));
      return;
    }
    console.log(chalk.yellow(data));
  }
);

figlet(
  'Advanced Telegram Bot',
  {
    horizontalLayout: 'default',
    verticalLayout: 'default',
  },
  (err, data) => {
    if (err) {
      console.error(chalk.red('Figlet error:', err));
      return;
    }
    console.log(chalk.magenta(data));
  }
);

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the 'assets' folder
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(port, () => {
  console.log(chalk.green(`Port ${port} is open`));
});

// Now we'll start the Telegram bot server using the connect function
let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = __filename;
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
        start.apply(this, arguments);
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
      // Here we call the connect function to initialize the server and bot
      // Assuming the bot instance is passed to `connect`
      connect(null, port, { keepalive: true });  // pass the bot instance if necessary
    } catch (e) {
      console.error(chalk.red('Error initializing Telegram bot.'));
    }
  });
}

start('index.js'); // Ensure to start index.js for the bot

process.on('unhandledRejection', () => {
  console.error(chalk.red('Unhandled promise rejection. Bot will restart...'));
  start('index.js');
});

process.on('exit', code => {
  console.error(chalk.red(`Exited with code: ${code}`));
  console.error(chalk.red('Bot will restart...'));
  start('index.js');
});
