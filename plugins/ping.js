import { exec } from 'child_process';
import speed from 'performance-now';

let handler = async (message, { bot }) => {
  let thumbnail = 'https://i.ibb.co/9HY4wjz/a4c0b1af253197d4837ff6760d5b81c0.jpg';

  // Simulate the "pinging..." message
  let pingMessage = await bot.sendMessage(message.chat.id, 'Pinging...', {
    reply_to_message_id: message.message_id,
  });

  let timestamp = speed();

  await exec('neofetch --stdout', async (error, stdout) => {
    let latency = (speed() - timestamp).toFixed(4);

    // Editing the "Pinging..." message with the latency value
    await bot.editMessageText(
      `*Mega AI 💘 running ping:* *${latency} ms*`,
      {
        chat_id: message.chat.id,
        message_id: pingMessage.message_id,
        parse_mode: 'Markdown',
      }
    );
  });
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'speed'];

export default handler;
