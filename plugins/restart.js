import { exec } from 'child_process';

let handler = async (message, { bot, isOwner }) => {
  if (!isOwner) {
    return bot.sendMessage(message.chat.id, 'You do not have permission to use this command.');
  }

  try {
    // Sending a restart message to the user
    await bot.sendMessage(message.chat.id, '🔄 Restarting Bot...\nPlease wait a moment.');

    // Using exec to restart the bot
    exec('pm2 restart bot', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restarting bot: ${error.message}`);
        return bot.sendMessage(message.chat.id, 'Failed to restart the bot.');
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return bot.sendMessage(message.chat.id, 'An error occurred while restarting the bot.');
      }

      console.log(`stdout: ${stdout}`);
      bot.sendMessage(message.chat.id, 'Bot restarted successfully!');
    });
  } catch (error) {
    console.error('Error in restarting the bot:', error);
    await bot.sendMessage(message.chat.id, 'An error occurred while trying to restart the bot.');
  }
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart'];

handler.owner = true;

export default handler;
