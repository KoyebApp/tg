// alive.js plugin example
const handler = async ({ bot, m, db }) => {
  const photoPath = '../assets/A.jpg';  // Path to your photo

  // Send a photo with a caption
  await bot.sendPhoto(m.chat.id, { source: photoPath }, { caption: 'Bot Is Alive And Running!' });

};

module.exports = handler;
