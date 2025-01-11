const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, `✳️ Please provide a GitHub username.\n\n📌 Example: ${usedPrefix + command} GlobalTechInfo`);
    }

    try {
        // Log the query for debugging
        console.log('GitHub Stalking Query:', query);

        // Fetch GitHub details for the user
        let res = await Qasim.githubStalk(query);

        // Log the response to see the data returned by the API
        console.log('GitHub Stalking API Response:', res);

        // Extracting relevant data from the API response
        const {
            username,
            nickname,
            bio,
            profile_pic,
            url,
            company,
            location,
            blog,
            followers,
            following,
            public_repo,
            public_gists
        } = res.results;

        // Formatting the message with relevant information
        let message = `
┌──「 STALKING GITHUB 
▢ *🔖Name:* ${nickname || 'Unknown'} 
▢ *🔖Username:* ${username}
▢ *👥Followers:* ${followers || 'N/A'}
▢ *🫂Following:* ${following || 'N/A'}
▢ *📌Bio:* ${bio || 'No bio available'}
▢ *🏝️Public Repos:* ${public_repo || 'N/A'}
▢ *📚Public Gists:* ${public_gists || 'N/A'}
▢ *🧳Location:* ${location || 'Unknown'}
▢ *🏢Company:* ${company || 'No company info'}
▢ *🔗Link:* [GitHub Profile](${url || 'No URL available'})
└────────────`;

        // Set default profile picture URL if not available
        const profilePic = profile_pic || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

        // Send the profile picture with details
        await bot.sendPhoto(chatId, profilePic, { caption: message });
        await bot.sendMessage(chatId, '✅ Profile fetched successfully!');
        
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

module.exports = handler;
