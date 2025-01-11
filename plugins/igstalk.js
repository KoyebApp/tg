const Qasim = require('api-qasim');

let handler = async (m, { bot, args, text, usedPrefix, command }) => {
    // Ensure the user has provided an Instagram username
    if (!args[0]) {
        await bot.sendMessage(m.chat.id, `✳️ Please provide an Instagram username.\n\n📌 Example: ${usedPrefix + command} truepakistanofficial`);
        return;
    }

    try {
        // Inform the user that we're fetching the Instagram profile
        await bot.sendMessage(m.chat.id, '⏳ Stalking Instagram profile...');

        // Call the Qasim API to fetch Instagram profile data
        let res = await Qasim.igStalk(args[0]);

        // Check if the response contains the profile data
        if (!res || !res.username) {
            return await bot.sendMessage(m.chat.id, `✳️ No profile found for *${args[0]}*. Please check the username and try again.`);
        }

        // Build the message to send with the profile details
        let message = `
┌──「 *STALKING INSTAGRAM PROFILE*」
▢ *🔖Name:* ${res.name || 'Unknown'} 
▢ *🔖Username:* ${res.username}
▢ *👥Followers:* ${res.followers || 'N/A'}
▢ *🫂Following:* ${res.following || 'N/A'}
▢ *📌Bio:* ${res.description || 'No bio available'}
▢ *🏝️Posts:* ${res.posts || 'N/A'}
▢ *🔗Link:* [Instagram Profile](https://instagram.com/${res.username.replace(/^@/, '')})
└────────────`;

        // Use a default image if no profile picture is available
        const profilePic = res.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png';

        // Send the profile picture and details to the user
        await bot.sendPhoto(m.chat.id, profilePic, { caption: message });

        // Notify the user that the profile has been fetched
        await bot.sendMessage(m.chat.id, '✅ Profile fetched successfully!');

    } catch (error) {
        // Log the error and notify the user
        console.error("Error:", error);
        await bot.sendMessage(m.chat.id, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

module.exports = handler;
