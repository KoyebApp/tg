const Qasim = require('api-qasim');  // Import the trendtwit function from the api-qasim package

let handler = async ({ bot, m, text, usedPrefix, command }) => {
    const suggest = `Please provide a country name. Example: *${usedPrefix}${command} Pakistan*`;
    if (!text) throw suggest;

    try {
        await m.react('⌛');  // React with a waiting emoji to indicate fetching data

        console.log(`Fetching trends for country: ${text}`);

        // Fetch the trending topics using the trendtwit function
        let trendtwitResult = await trendtwit(text);

        // Check if trendtwitResult is a valid string or object
        if (typeof trendtwitResult === 'string') {
            // If it's a string, send it as a message
            const data = {
                text: `*Trending topics in ${text}:*\n\n${trendtwitResult}`,
            };
            await bot.sendMessage(m.chat.id, data.text, { reply_to_message_id: m.message_id });
        } else if (trendtwitResult && typeof trendtwitResult === 'object' && trendtwitResult.result && Array.isArray(trendtwitResult.result) && trendtwitResult.result.length > 0) {
            // If it's an object with trends
            const trends = trendtwitResult.result.map((trend, index) => {
                if (trend.hastag && trend.tweet) {
                    return `${index + 1}. ${trend.hastag} - ${trend.tweet}`;
                } else {
                    console.warn(`Unexpected trend format at index ${index}:`, trend);
                    return `Invalid trend format at index ${index}`;
                }
            }).join('\n');

            const data = {
                text: `*Trending topics in ${text}:*\n\n${trends}\n\n*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝚄𝙻𝚃𝚁𝙰-𝙼𝙳*`,
            };
            await bot.sendMessage(m.chat.id, data.text, { reply_to_message_id: m.message_id });
            m.react('✅');  // React with a success emoji
        } else {
            // If no trends are found
            throw "No trending data found for this country.";
        }

    } catch (e) {
        // Handle any errors that occur
        console.error('Error:', e);

        const errorMessage = e.message || e || "Unknown error occurred.";
        throw `An error occurred: ${errorMessage}`;
    }
};

// Command and help configuration
handler.help = ['trendtwit', 'trends', 'trendingtags', 'tweets', 'hashtags', 'trendtags'];
handler.tags = ['social'];
handler.command = ['trendtwit', 'trends', 'trendingtags', 'tweets', 'hashtags', 'trendtags'];

module.exports = handler;
