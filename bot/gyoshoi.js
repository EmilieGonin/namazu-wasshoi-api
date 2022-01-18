const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
const { embed, event, activities } = require('./embed');
const token = process.env.WASSHOBOT_KEY;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

const roles = {
  officier: '674204890054131712',
  test: '932934305552941066'
}

client.once('ready', () => {
  console.log('Je suis prêt, wasshoi !');
})

client.on('messageCreate', msg => {
  const string = msg.content.toLowerCase();
  if (!msg.author.bot && (string.includes('wasshoi') && string.includes('gyoshoi'))) {
    msg.reply('Yes yes, wasshoi !');
  }
})

//Planning
client.on('messageCreate', msg => {
  const isAdmin = msg.member.roles.cache.has(roles.test);
  // const isAdmin = true;
  const string = msg.content.toLowerCase();
  if (!msg.author.bot && isAdmin && string.includes('!planning')) {
    const type = string.split(' ')[1];
    const date = string.split(' ')[2];
    const hour = string.split(' ')[3];
    console.log(type);
    console.log(date);
    console.log(hour);
    const file = new MessageAttachment('./assets/' + type + '.png');

    if (!type || !date || !hour) {
      msg.reply(':warning: Veuillez préciser un type de sortie, une date et une heure de départ.\n\n🔹**Exemple :** `!planning cartes 01/01/2022 21`')
      .then(() => {
        msg.delete();
      })
    } else if (!activities[type]) {
      const types = [];

      for (let type in activities) {
        types.push(' ' + type)
      }

      msg.reply(':warning: Le type de sortie "' + type +'" est incorrect.\n\n🔹**Liste des types acceptés :**' + types.toString())
      .then(reply => {
        msg.delete();
      })
    } else {
      for (let i in activities[type]) {
        event[i] = activities[type][i];
      }

      event.fields[1].value = '`' + date + '`';
      event.fields[2].value = '`' + hour + '`';

      msg.delete();
      msg.channel.send({ embeds: [event], files: [file] })
      .then(msg => {
        const filter = (reaction, user) => {
          return ['901253049077612584'].includes(reaction.emoji.id) && !user.bot;
        };

        const collector = msg.createReactionCollector({ filter, time: 10000});

        collector.on('collect', (reaction, user) => {
          console.log(reaction.emoji.name);
          console.log(user.username);
        });

        msg.react('<:Tank:674261754225754152>')
        .then(() => msg.react('<:Healer:674261739239637003>'))
        .then(() => msg.react('<:DPS:674261714870468610>'))
        .catch(error => console.error(error));
      })
    }
  }
})

client.login(token);

module.exports = { client };
