let handler = async (m, { bot, text, usedPrefix, command }) => {
  // Sound
  let name = m.from.username || m.from.first_name; // Adjust this for Telegram user details
  let img = 'https://i.imgur.com/s0SqG3g.jpeg';

  // Message content
  let messageContent = {
    text: '𝗨𝗟𝗧𝗥𝗔-𝗠𝗗 𝗜𝗦 𝗥𝗨𝗡𝗡𝗜𝗡𝗚',
    reply_markup: {
      inline_keyboard: [
        [{ text: "Join our channel", url: 'https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07' }]
      ],
    },
  };

  // Send the message with an inline button (channel link)
  await bot.sendMessage(m.chat, messageContent.text, messageContent);
};

// Define command and metadata for the handler
handler.help = ['alive'];
handler.tags = ['main'];
handler.command = /^(alive)$/i;

// Export the handler
export default handler;
