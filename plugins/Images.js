const fetch = require('node-fetch');  // Importing fetch to get the data from URLs

let handler = async ({ m, bot, command }) => {
   // List of JSON URLs
   const urls = {
      'cyberspace': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/CyberSpace.json',
      'technology': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Technology.json',
      'islamic': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Islamic.json',
      'gamewallp': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Gamewallp.json',
      'mountain': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Mountain.json',
      'programming': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Programming.json',
   };

   // Ensure the provided command matches one of the cases
   if (!urls[command]) {
      return bot.sendMessage(m.chat.id, '❌ Command not recognized.');
   }

   try {
      // Fetch the JSON from the appropriate URL
      const response = await fetch(urls[command]);
      const data = await response.json();

      // Ensure the data is an array and has at least one image
      if (!Array.isArray(data) || data.length < 1) {
         throw 'Not enough images in the data source.';
      }

      // Generate a random index to select an image
      const randomIndex = Math.floor(Math.random() * data.length);
      
      // Get the image URL
      const imageUrl = data[randomIndex];

      // Send the image to the user
      bot.sendPhoto(m.chat.id, imageUrl, { caption: 'Random Image' });

   } catch (error) {
      console.error('Error fetching image:', error);
      bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the image. Please try again later.');
   }
}

// Define the list of commands for the handler
handler.command = [
   'cyberspace', 'technology', 'islamic', 'gamewallp', 'mountain', 'programming'
];

handler.help = [
   'cyberspace', 'technology', 'islamic', 'gamewallp', 'mountain', 'programming'
];

handler.tags = ['fun'];

module.exports = handler;
