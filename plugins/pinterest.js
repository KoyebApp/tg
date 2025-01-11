const Qasim = require('api-qasim');

let handler = async (m, { bot, args, text, usedPrefix, command }) => {
    if (!args[0]) throw `✳️ Enter A Query\n\n📌 Example: ${usedPrefix + command} nature`;

    try {
        await bot.sendMessage(m.chat.id, "⏳ Searching for Pinterest images...");

        // Fetch Pinterest results based on the query
        let res = await Qasim.Pinterest2(args[0]);
        console.log(res); // Log the result for debugging

        // Check if the result contains images
        if (!res.result || res.result.length === 0) {
            return bot.sendMessage(m.chat.id, "✳️ No images found for your search query.");
        }

        // Extract the first 3 image URLs
        const imageUrls = res.result.slice(0, 3).map(item => item.images_url);

        // If there are images, send them
        let message = `Found images for query *${args[0]}*:\n\n`;

        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];

            // Check if the image URL is valid
            if (imageUrl && imageUrl.startsWith('http')) {
                // Send each image with a caption
                await bot.sendPhoto(m.chat.id, imageUrl, { caption: `${message}Image ${i + 1}` });
            } else {
                console.warn(`Skipping invalid URL: ${imageUrl}`);
            }
        }

        // Confirm the process is complete
        await bot.sendMessage(m.chat.id, "✅ Images sent successfully!");

    } catch (error) {
        console.error(error);
        await bot.sendMessage(m.chat.id, `✳️ An error occurred: ${error.message || error}`);
    }
}

handler.help = ['pinterest2', 'pinimg'];
handler.tags = ['search'];
handler.command = ['pinterest2', 'pinimg'];

module.exports = handler;
