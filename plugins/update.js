import { execSync } from 'child_process';
import fs from 'fs';

let handler = async (message, { bot, isOwner, text }) => {
  // Ensure that the command is executed by the owner
  if (!isOwner) {
    return bot.sendMessage(message.chat.id, 'You do not have permission to use this command.');
  }

  try {
    // Execute the git pull command
    let command = 'git pull';
    if (text) {
      command += ` ${text}`;
    }
    let stdout = execSync(command);

    // Reload all plugins
    fs.readdirSync('plugins').forEach(v => {
      // Assuming you have a function to reload plugins
      // For Telegram bots, this part may not be needed unless you're handling dynamic plugins
      // reload(v); 
    });

    // Reply with the output of the git command
    await bot.sendMessage(message.chat.id, `Git Pull Output:\n\n${stdout.toString()}`);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(message.chat.id, 'An error occurred while updating the bot.');
  }
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'fix', 'fixed'];

export default handler;
