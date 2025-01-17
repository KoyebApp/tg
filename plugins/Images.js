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

      // Ensure the data is an array and has at least 2 images
      if (!Array.isArray(data) || data.length < 2) {
         throw 'Not enough images in the data source.';
      }

      // Generate two random indices to select two images
      const randomIndex1 = Math.floor(Math.random() * data.length);
      let randomIndex2 = Math.floor(Math.random() * data.length);

      // Ensure the indices are different
      while (randomIndex1 === randomIndex2) {
         randomIndex2 = Math.floor(Math.random() * data.length);
      }

      // Get the image URLs
      const imageUrl1 = data[randomIndex1];
      const imageUrl2 = data[randomIndex2];

      // Send the images to the user
      bot.sendPhoto(m.chat.id, imageUrl1, { caption: 'Random Image 1' });
      bot.sendPhoto(m.chat.id, imageUrl2, { caption: 'Random Image 2' });

   } catch (error) {
      console.error('Error fetching images:', error);
      bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the images. Please try again later.');
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
