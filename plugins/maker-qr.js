const { toDataURL } = require('qrcode');

let handler = async ({ m, bot, query, usedPrefix, command }) => {
  const chatId = m.chat.id;

  // Extract the query text (everything after the command)
  query = query.trim();

  // Check if the query is provided
  if (!query) {
    // If no query, ask the user to provide text for the QR code
    await bot.sendMessage(chatId, "Please provide the text to generate the QR code.");
    return; // Exit early if no query
  }

  try {
    // Generate the QR code from the provided query text (limit length to 2048 characters)
    const qrCodeDataUrl = await toDataURL(query.slice(0, 2048), { scale: 8 });

    // Send the generated QR code to the user as an image using the correct Base64 string
    await bot.sendPhoto(chatId, qrCodeDataUrl, { caption: 'Here you go!' });
  } catch (err) {
    // Handle any errors in generating the QR code
    await bot.sendMessage(chatId, `Error generating QR code: ${err.message}`);
  }
};

handler.help = ['qr <text>', 'qr code <text>'];
handler.tags = ['tools'];

// Define the command to match (qr or qrcode)
handler.command = ['qrcode', 'qr'];

module.exports = handler;
