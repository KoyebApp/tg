const { ImgurClient } = require('imgur');
const fs = require('fs');

// Initialize Imgur client with your Client ID
const client = new ImgurClient({ clientId: 'a0113354926015a' });

/**
 * Upload an image to Imgur
 * @param {string} imagepath The local path of the image to upload
 * @return {Promise<string>} The URL of the uploaded image
 */
async function uploadtoimgur(imagepath) {
  try {
    // Upload the image from the file system
    const response = await client.upload({
      image: fs.createReadStream(imagepath),  // Stream the image
      type: 'stream',  // The type of the image (since we're streaming it from a file)
    });

    // Extract and return the URL of the uploaded image
    let url = response.data.link;
    console.log(url);  // Log the URL
    return url;
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    throw error;
  }
}

// Export the function for use in other modules
module.exports = uploadtoimgur;
