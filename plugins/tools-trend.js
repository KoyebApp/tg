const Qasim = require('api-qasim');  // Import the trendtwit function from the api-qasim package

let handler = async ({ bot, m, query, usedPrefix, command }) => {
    try {
        // If no query is provided, ask for a country name directly
        if (!query) {
            throw new Error(`Please provide a country name. Example: *${usedPrefix}${command} Pakistan*`);
        }

        // Fetch the trending topics using the trendtwit function
        let trendtwitResult = await Qasim.trendtwit(query);

        // Check if trendtwitResult is a valid string or object
        if (typeof trendtwitResult === 'string') {
            // If it's a string, send it as a message
            const data = {
                text: `Trending topics in ${query}:\n\n${trendtwitResult}`,
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
                text: `Trending topics in ${query}:\n\n${trends}\n\n*Powered by © ULTRA-MD*`,
            };
            await bot.sendMessage(m.chat.id, data.text, { reply_to_message_id: m.message_id });
        } else {
            // If no trends are found
            throw new Error("No trending data found for this country.");
        }
    } catch (e) {
        // Catch errors and handle them gracefully
        console.error('Error:', e);

        // Ensure that the error message is sent back properly
        const errorMessage = e.message || e || "Unknown error occurred.";
        await bot.sendMessage(m.chat.id, `❌ Error: ${errorMessage}`, { reply_to_message_id: m.message_id });
    }
};

// Command and help configuration
handler.help = ['trendtwit', 'trends', 'trendingtags', 'tweets', 'hashtags', 'trendtags'];
handler.tags = ['social'];
handler.command = ['trendtwit', 'trends', 'trendingtags', 'tweets', 'hashtags', 'trendtags'];

module.exports = handler;
