const { Client, Intents } = require("discord.js");
const token = process.env.WASSHOBOT_KEY;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]
});

client.once("ready", () => {
  console.log("Je suis prêt, wasshoi !");
})

client.on("messageCreate", msg => {
  const string = msg.content.toLowerCase();
  if (!msg.author.bot && (string.includes("wasshoi") && string.includes("gyoshoi"))) {
    msg.reply("Yes yes, wasshoi !");
  }
})

client.login(token);

module.exports = { client };
