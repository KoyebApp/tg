const chalk = require('chalk');
const { spawn } = require('child_process');
const express = require('express');
const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

// Print ASCII Art for Bot Name
figlet(
  'MEGA',
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

// Print ASCII Art for Bot Description
figlet(
  'Telegram',
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

// Resolve the file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'Assets' folder
app.use(express.static(path.join(__dirname, 'Assets')));

// Route to redirect to `guru.html`
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(chalk.green(`Port ${port} is open`));
});

let isRunning = false;

// Function to start a file with child process
async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = __filename; // Use the current file for path resolution
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
      start('index.js'); // Replacing guru.js with index.js
    });
  });

  p.on('error', err => {
    console.error(chalk.red(`Error: ${err}`));
    p.kill();
    isRunning = false;
    start('index.js'); // Replacing guru.js with index.js
  });

  const pluginsFolder = path.join(path.dirname(currentFilePath), 'plugins');

  fs.readdir(pluginsFolder, async (err, files) => {
    if (err) {
      console.error(chalk.red(`Error reading plugins folder: ${err}`));
      return;
    }
    console.log(chalk.yellow(`Installed ${files.length} plugins`));

// Start the bot by running index.js
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
