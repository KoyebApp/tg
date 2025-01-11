import { toDataURL } from 'qrcode';

const handler = async (message, { bot, text }) => {
  // Check if the user provided text
  if (!text) {
    await bot.sendMessage(message.chat.id, '✳️ Please provide text to convert into a QR code.');
    return;
  }

  try {
    // Generate the QR code from the text (limit to 2048 characters)
    const qrCodeDataUrl = await toDataURL(text.slice(0, 2048), { scale: 8 });

    // Send the QR code image
    await bot.sendPhoto(message.chat.id, qrCodeDataUrl, {
      caption: 'Here you go',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    await bot.sendMessage(message.chat.id, '⚠️ An error occurred while generating the QR code. Please try again later.');
  }
};

// Define command metadata
handler.help = ['qr', 'qrcode'].map(v => `${v} <text>`);
handler.tags = ['tools'];
handler.command = /^qr(code)?$/i;

export default handler;
