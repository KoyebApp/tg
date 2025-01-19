const { toDataURL } = require('qrcode');

let handler = async (m, bot, query) => {
  // Check if the user has provided the text in the command directly
  if (!query) {
    // If not, ask the user for a query
    await bot.sendMessage(m.chat.id, "Please provide the text to generate the QR code.");
    // Assuming that you are storing the next response from the user as `query`
    bot.on('message', async (response) => {
      // Ensure it's a valid response and belongs to the same user/chat
      if (response.chat.id === m.chat.id && response.text) {
        query = response.text; // Store the response as the query

        try {
          // Generate the QR code from the provided query text (limit length to 2048 characters)
          const qrCodeDataUrl = await toDataURL(query.slice(0, 2048), { scale: 8 });

          // Send the generated QR code to the user
          await bot.sendPhoto(
            m.chat.id,
            qrCodeDataUrl,
            'qrcode.png',
            'Here you go!',
            m
          );
        } catch (err) {
          // Handle any errors in generating the QR code
          await bot.sendMessage(m.chat.id, `Error generating QR code: ${err.message}`);
        }
      }
    });
  } else {
    try {
      // Generate the QR code from the provided query text (limit length to 2048 characters)
      const qrCodeDataUrl = await toDataURL(query.slice(0, 2048), { scale: 8 });

      // Send the generated QR code to the user
      await bot.sendPhoto(
        m.chat.id,
        qrCodeDataUrl,
        'qrcode.png',
        'Here you go!',
        m
      );
    } catch (err) {
      // Handle any errors in generating the QR code
      await bot.sendMessage(m.chat.id, `Error generating QR code: ${err.message}`);
    }
  }
};

handler.help = ['qr <text>', 'qr code <text>'];
handler.tags = ['tools'];

// Define the command to match (qr or qrcode)
handler.command = /^qr(code)?$/i;

module.exports = handler;
