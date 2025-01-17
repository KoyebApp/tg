const fetch = require('node-fetch');  // Importing fetch to get the data from URLs

let handler = async ({ m, bot, command }) => {
   // List of text file URLs
   const urls = {
      'funfacts': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/FunFacts.txt',
      'techtips': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/TechTips.txt',
      'programmingtips': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/ProgrammingTips.txt',
      'motivational': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/Motivational.txt',
      'lifehacks': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/LifeHacks.txt',
      'quotes': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/TXT-DATA/Quotes.txt',
      'islamicquotes': 'https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/IslamicQuotes.txt',
   };

   // Ensure the provided command matches one of the cases
   if (!urls[command]) {
      return bot.sendMessage(m.chat.id, '❌ Command not recognized.');
   }

   try {
      // Fetch the text file from the appropriate URL
      const response = await fetch(urls[command]);
      const data = await response.text();

      // Split the text into an array of quotes/facts (each line is a separate fact)
      const facts = data.split('\n').map(fact => fact.trim()).filter(fact => fact.length > 0);

      // Ensure there are facts in the data
      if (facts.length === 0) {
         throw 'No facts found in the data source.';
      }

      // Generate a random index to select a fact
      const randomIndex = Math.floor(Math.random() * facts.length);
      
      // Get the selected random fact
      const randomFact = facts[randomIndex];

      // Send the fact to the user
      bot.sendMessage(m.chat.id, `💬 *Random Fact:*\n\n${randomFact}`);

   } catch (error) {
      console.error('Error fetching fact:', error);
      bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the fact. Please try again later.');
   }
}

// Define the list of commands for the handler
handler.command = [
   'funfacts', 'techtips', 'programmingtips', 'motivational', 'lifehacks', 'quotes', 'islamicquotes'
];

handler.help = [
   'funfacts', 'techtips', 'programmingtips', 'motivational', 'lifehacks', 'quotes', 'islamicquotes'
];

handler.tags = ['quote'];

module.exports = handler;
