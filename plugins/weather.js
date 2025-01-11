import axios from 'axios';

const handler = async (message, { bot, args }) => {
  if (!args[0]) throw "*Give a place to search*";

  try {
    // Fetch weather data from OpenWeatherMap API
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args.join(' ')}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
    const res = response.data;

    // Extract the weather data
    const name = res.name;
    const Country = res.sys.country;
    const Weather = res.weather[0].description;
    const Temperature = res.main.temp + "°C";
    const Minimum_Temperature = res.main.temp_min + "°C";
    const Maximum_Temperature = res.main.temp_max + "°C";
    const Humidity = res.main.humidity + "%";
    const Wind = res.wind.speed + "km/h";

    // Format the weather data into a readable message
    const wea = `ʜᴇʀᴇ ɪs ʏᴏᴜʀ ɢɪᴠᴇɴ ᴘʟᴀᴄᴇ ᴡᴇᴀᴛʜᴇʀ\n\n` +
      `「 🌅 」ᴘʟᴀᴄᴇ: ${name}\n` +
      `「 🗺️ 」ᴄᴏᴜɴᴛʀʏ: ${Country}\n` +
      `「 🌤️ 」ᴠɪᴇᴡ: ${Weather}\n` +
      `「 🌡️ 」 ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ: ${Temperature}\n` +
      `「 💠 」 ᴍɪɴɪᴍᴜᴍ ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ: ${Minimum_Temperature}\n` +
      `「 🔥 」 ᴍᴀxɪᴍᴜᴍ ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴇ: ${Maximum_Temperature}\n` +
      `「 💦 」 ʜᴜᴍɪᴅɪᴛʏ: ${Humidity}\n` +
      `「 🌬️ 」 ᴡɪɴᴅsᴘᴇᴇᴅ: ${Wind}`;

    // Send the weather data to the user
    await bot.sendMessage(message.chat.id, wea);
  } catch (error) {
    await bot.sendMessage(message.chat.id, "*ERROR*");
  }
};

handler.help = ['weather *<place>*'];
handler.tags = ['tools'];
handler.command = /^(climate|weather|mosam)$/i;

export default handler;
