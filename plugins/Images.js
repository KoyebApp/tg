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

      // Ensure the data has the 'images' property (array of image URLs)
      if (!data || !Array.isArray(data.images) || data.images.length < 2) {
         throw 'Not enough images in the data source.';
      }

      // Generate two random indices to select two images
      const randomIndex1 = Math.floor(Math.random() * data.images.length);
      let randomIndex2 = Math.floor(Math.random() * data.images.length);

      // Ensure the indices are different
      while (randomIndex1 === randomIndex2) {
         randomIndex2 = Math.floor(Math.random() * data.images.length);
      }

      // Fetch the image URLs
      const imageUrl1 = data.images[randomIndex1];
      const imageUrl2 = data.images[randomIndex2];

      // Fetch the images using their URLs
      const imageResponse1 = await fetch(imageUrl1);
      const imageBuffer1 = await imageResponse1.buffer();

      const imageResponse2 = await fetch(imageUrl2);
      const imageBuffer2 = await imageResponse2.buffer();

      // Send the images to the user
      bot.sendPhoto(m.chat.id, imageBuffer1, { caption: 'Random Image 1' });
      bot.sendPhoto(m.chat.id, imageBuffer2, { caption: 'Random Image 2' });

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
