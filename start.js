const chalk = require('chalk');
const { spawn } = require('child_process');
const express = require('express');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

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

// Using __filename and __dirname in CommonJS
const __filename = fileURLToPath(require('url').pathToFileURL(__filename).href);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.listen(port, () => {
  console.log(chalk.green(`Port ${port} is open`));
});

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = new URL(require('url').pathToFileURL(__filename).href).pathname;
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
      start('index.js'); // Replacing global.js with index.js
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
      // Removed Baileys logic, as we are now using Telegram Bot API
      console.log(chalk.yellow('Telegram bot is ready.'));
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
