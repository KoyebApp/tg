const { toDataURL } = require('qrcode');

let handler = async ({ m, text, bot }) => {
  if (!text) throw `*Give a text to convert*`;

  try {
    const qrCodeDataUrl = await toDataURL(text.slice(0, 2048), { scale: 8 });
    
    bot.sendPhoto(
      m.chat.id,
      qrCodeDataUrl,
      'qrcode.png',
      'Here you go',
      m
    );
  } catch (err) {
    throw `Error generating QR code: ${err.message}`;
  }
};

// Define help command and command tags
handler.help = ['', 'code'].map(v => 'qr' + v + ' <text>');
handler.tags = ['tools'];
handler.command = /^qr(code)?$/i;

module.exports = handler;
