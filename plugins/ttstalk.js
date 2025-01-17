const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, `✳️ Please provide a TikTok username.\n\n📌 Example: ${usedPrefix + command} discoverpakistantv`);
    }

    try {
        // Fetching the TikTok user details from the API
        let res = await Qasim.tiktokStalk(query);

        // Extracting relevant data from the API response
        const { name, username, followers, following, description } = res.obj;

        // Formatting the message with relevant information
        let message = `
┌──「 STALKING TIKTOK 
▢ 🔖Name: ${name || 'No Username'} 
▢ 🔖Username: ${username || 'Unknown'}
▢ 👥Followers: ${followers || 'N/A'}
▢ 🫂Following: ${following || 'N/A'}
▢ 📌Bio: ${description || 'No bio available'}
▢ 🔗Link: [TikTok Profile](https://www.tiktok.com/@${username.replace(/^@/, '') || 'NoUsername'})
└────────────`;

        // Send the formatted message with details
        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

handler.command = ['ttstalk', 'tiktokstalk'];  // Command list
handler.help = ['ttstalk', 'tiktokstalk'];
handler.tags = ['stalk'];

module.exports = handler;
