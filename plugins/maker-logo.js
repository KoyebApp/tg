const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, bot, usedPrefix, command, text }) => {
   let tee = `✳️ Provide Some Text With Command 📌 Example: ${usedPrefix + command} MEGA AI`;  // Fixed string closing

   let apiUrl;
   switch (command) {
      case 'papercut':
      case 'logomaker':
      case 'cartoon':
      case 'writetext':
      case 'glossy':
      case 'bpstyle':
      case 'pixelglitch':
      case 'advancedglow':
      case 'lighteffect':
      case 'texteffect':
      case 'galaxy':
      case 'beach':
      case 'clouds':
         if (!text) throw tee;
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/${command}?apikey=gifted-md&text=${encodeURIComponent(text)}`;
         break;

      default:
         throw 'Command not recognized.';
   }

   // Fetch the image URL from the API
   try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result && data.result.image_url) {
         // Send the image URL to the user
         await bot.sendDocument(m.chat.id, data.result.image_url, { caption: '𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸' });
      } else {
         throw 'Failed to generate the image. Please try again later.';
      }
   } catch (error) {
      console.error('Error fetching image:', error);
      await bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the image. Please try again later.');
   }
};

// List of supported commands
handler.command = [
   'papercut', 'logomaker', 'bpstyle', 'writetext', 'glossy', 'cartoon', 'pixelglitch', 'advancedglow', 
   'lighteffect', 'texteffect', 'galaxy', 'beach', 'clouds'
]; 

handler.help = [
   'papercut', 'logomaker', 'bpstyle', 'writetext', 'glossy', 'cartoon', 'pixelglitch', 'advancedglow', 
   'lighteffect', 'texteffect', 'galaxy', 'beach', 'clouds'
];

handler.tags = ['maker'];

module.exports = handler;
