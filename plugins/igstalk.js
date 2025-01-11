const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, "Please provide a search query.");
    }

    try {
        // Call the Instagram profile stalking API with the username
        let res = await Qasim.igStalk(query);

        let message = `
┌──「 *STALKING INSTAGRAM PROFILE* 
▢ *🔖Name:* ${res.name || 'Unknown'} 
▢ *🔖Username:* ${res.username}
▢ *👥Followers:* ${res.followers || 'N/A'}
▢ *🫂Following:* ${res.following || 'N/A'}
▢ *📌Bio:* ${res.description || 'No bio available'}
▢ *🏝️Posts:* ${res.posts || 'N/A'}
▢ *🔗Link:* [Instagram Profile](https://instagram.com/${res.username.replace(/^@/, '')})
└────────────`;

        // Set default profile picture URL if not available
        const profilePic = res.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png';
        
        // Send the profile picture with details
        await bot.sendPhoto(chatId, profilePic, { caption: message });
        await bot.sendMessage(chatId, '✅ Profile fetched successfully!');

    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

module.exports = handler;
