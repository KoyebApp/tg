
const Qasim = require('api-qasim')

let handler = async (m, { bot, args, text, usedPrefix, command }) => {
    if (!args[0]) {
        await bot.sendMessage(m.chat.id, `✳️ Please provide an Instagram username.\n\n📌 Example: ${usedPrefix + command} truepakistanofficial`);
        return;
    }

    try {
        await bot.sendMessage(m.chat.id, '⏳ Stalking Instagram profile...');

        let res = await Qasim.igStalk(args[0]);

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

        // Send the profile picture with details
        const profilePic = res.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png';
        
        // Send the profile information along with the profile picture
        await bot.sendPhoto(m.chat.id, profilePic, { caption: message });
        await bot.sendMessage(m.chat.id, '✅ Profile fetched successfully!');

    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(m.chat.id, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

handler.help = ['igstalk'];
handler.tags = ['search'];
handler.command = ['igstalk'];

module.exports = handler;
