const uploadImage = require('../lib/uploadImage');  // Import uploadImage
const fetch = require('node-fetch');  // Fetch for making API calls

let handler = async ({ m, bot, text, usedPrefix, command }) => {
  try {
    // Check if the message has a quoted image or the main image
    let q = m.quoted ? m.quoted : m;
    console.log('Quoted:', m.quoted ? true : false);  // Log if it's a quoted message

    let mime = (q.msg || q).mimetype || '';  // Get mime type of the message media
    console.log('Mime type:', mime);  // Log mime type for debugging
    
    // Case 1: If mime is not an image, we throw an error
    if (!mime || !mime.startsWith('image/')) {
      throw '*Respond to a QR code image!*';  // If no mime type or it's not an image, throw error
    }

    // Case 2: Download the image from the message
    let img = await q.download?.();  // Download the image file
    console.log('Image download success:', !!img);  // Log if image was successfully downloaded

    if (!img) {
      throw '*Failed to download the image, please try again!*';  // Ensure image was downloaded
    }

    // Case 3: Upload the image to get its URL
    let url = await uploadImage(img);  // Upload the image to get its URL
    console.log('Uploaded image URL:', url);  // Log the uploaded image URL

    // Case 4: Fetch the result from the QR code reading API
    let anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=GataDios&img=${url}`);
    let json = await anu.json();  // Parse the response

    // Case 5: If the QR code is unreadable, throw an error
    if (json.status !== 200) {
      throw `Error: ${json.message || 'Unable to read the QR code.'}`;  // Handle API errors
    }

    // Case 6: Send the decoded QR code data back to the user
    await bot.sendMessage(m.chat.id, `*Here you go:* ${json.result}`);
  } catch (error) {
    console.error('Error in readqr handler:', error);  // Log the error for debugging
    await bot.sendMessage(m.chat.id, `*Error occurred:* ${error.message || error}`);
  }
};

// Command to trigger the QR code reading
handler.command = ['readqr'];  
handler.help = ['readqr'];
handler.tags = ['qr'];

module.exports = handler;  // Export the handler to be used by the bot
