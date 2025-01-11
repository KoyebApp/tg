const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, `✳️ Please provide a TikTok username.\n\n📌 Example: ${usedPrefix + command} discoverpakistantv`);
    }

    try {
        // Log the query for debugging
        console.log('TikTok Stalking Query:', query);

        // Fetching TikTok user details from the API
        let res = await Qasim.tiktokStalk(query);

        // Log the response to see the data returned by the API
        console.log('TikTok Stalking API Response:', res);

        // Extracting relevant data from the API response
        const { name, username, followers, following, description, profilePic } = res.obj;

        // Formatting the message with relevant information
        let message = `
┌──「 *STALKING TIKTOK* 
▢ *🔖Name:* ${name || 'No Username'} 
▢ *🔖Username:* ${username || 'Unknown'}
▢ *👥Followers:* ${followers || 'N/A'}
▢ *🫂Following:* ${following || 'N/A'}
▢ *📌Bio:* ${description || 'No bio available'}
▢ *🔗Link:* [TikTok Profile](https://www.tiktok.com/@${username.replace(/^@/, '') || 'NoUsername'})
└────────────`;

        // Set default profile picture URL if not available
        const profilePicToSend = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/8/85/TikTok_logo_2018.svg';

        // Send the profile picture with details
        await bot.sendPhoto(chatId, profilePicToSend, { caption: message });
        await bot.sendMessage(chatId, '✅ Profile fetched successfully!');

    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

module.exports = handler;
