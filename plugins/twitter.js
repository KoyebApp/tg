import pkg from 'api-qasim';
const { xdown } = pkg;

let handler = async (m, { bot, text, args, usedPrefix, command }) => {
    if (!text) {
        await bot.sendMessage(m.chat.id, '✳️ You need to provide the URL of any X (Twitter) video, post, reel, or image.');
        return;
    }

    await bot.sendMessage(m.chat.id, '⏳ Processing your request...'); // Send loading message

    let res;
    try {
        res = await xdown(text); // Get the download link from the API
    } catch (error) {
        await bot.sendMessage(m.chat.id, `❌ An error occurred while fetching the media: ${error.message}`);
        return;
    }

    // Check if response contains media
    if (!res || !res.media || res.media.length === 0) {
        await bot.sendMessage(m.chat.id, '❌ No media found for the provided URL.');
        return;
    }

    // Process the media array
    const mediaArray = res.media;

    for (const mediaData of mediaArray) {
        const mediaType = mediaData.type;
        const mediaURL = mediaData.url;

        let caption = `Here is the ${mediaType.toUpperCase()}\n\n*Powered by © Mega-AI*`;

        // Send media based on type
        if (mediaType === 'video') {
            await bot.sendVideo(m.chat.id, mediaURL, { caption: caption });
        } else if (mediaType === 'image') {
            await bot.sendPhoto(m.chat.id, mediaURL, { caption: caption });
        } else {
            // If the media type is unknown
            await bot.sendMessage(m.chat.id, `❌ Unsupported media type: ${mediaType}`);
        }
    }

    await bot.sendMessage(m.chat.id, '✅ Media sent successfully!'); // Send success message
};

handler.help = ['Twitter', 'xdl'];
handler.tags = ['downloader'];
handler.command = /^(twitter|xdl)$/i;

export default handler;
