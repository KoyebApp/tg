const fetch = require('node-fetch');  // Import fetch
const { fileTypeFromBuffer } = require('file-type');  // Import file-type

/**
 * Upload image to telegra.ph
 * Supported mimetypes:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
module.exports = async (buffer) => {
  // Dynamically import formdata-node
  const { FormData, Blob } = await import('formdata-node');  

  const { ext, mime } = await fileTypeFromBuffer(buffer);  // Get file extension and mime type
  let form = new FormData();  // Create FormData instance
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime });  // Create Blob from buffer
  form.append('file', blob, 'tmp.' + ext);  // Append file to form data
  
  // Send POST request to telegra.ph to upload image
  let res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form,  // Send form data as the body
  });

  let img = await res.json();  // Parse the JSON response
  if (img.error) throw img.error;  // Throw error if there's any problem with the upload
  
  // Return the URL of the uploaded image
  return 'https://telegra.ph' + img[0].src;
};
