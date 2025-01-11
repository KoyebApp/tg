const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    // Check if the username is provided in the command arguments
    if (!query) {
        await bot.sendMessage(chatId, `✳️ Please provide a TikTok username.\n\n📌 Example: ${usedPrefix + command} discoverpakistantv`);
        return;
    }

    try {
        await bot.sendMessage(chatId, '⏳ Fetching TikTok user details...');

        // Fetching the TikTok user details from the API
        let res = await Qasim.tiktokStalk(query);

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
▢ *🔗Link:* https://www.tiktok.com/@${username.replace(/^@/, '') || 'NoUsername'}
└────────────`;

        // Handle profilePic: If it's missing, use a default fallback image
        const imageToSend = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/8/85/TikTok_logo_2018.svg';
        
        // Send the formatted message and the profile picture (or default image)
        await bot.sendPhoto(chatId, imageToSend, { caption: message });

        // Send success message
        await bot.sendMessage(chatId, '✅ Profile details fetched successfully!');
        
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ Error: ${error.message || error}`);
    }
};

module.exports = handler;
