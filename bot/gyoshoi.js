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
    // console.log(type);
    // console.log(date);
    // console.log(hour);
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
          return [
            '933062548046106665', /*Tank*/
            '933062562076057671', /*Healer*/
            '933062571836182548', /*Melee_DPS*/
            '933062582326136872', /*Physical_Ranged_DPS*/
            '933062594158276659', /*Magic_Ranged_DPS*/
            '933068148360487023', /*Dispo_si_besoin*/
            '933068124037709854', /*Maybe*/
            '933068138550018108' /*Pas_dispo*/
          ].includes(reaction.emoji.id) && !user.bot;
        };

        const reactions = {
          tank: 0,
          healer: 0,
          melee_dps: 0,
          physical_ranged_dps: 0,
          magic_ranged_dps: 0,
          dispo_si_besoin: 0,
          maybe: 0,
          pas_dispo: 0,
          users: []
        }

        const collector = msg.createReactionCollector({ filter, time: 100000, dispose: true});

        collector.on('collect', (reaction, user) => {
          const i = reactions.users.findIndex(item => item.id == user.id);

          if (i != -1) {
            reactions[reactions.users[i].role]--;
            reactions.users.splice(i, 1);
          }

          const emoji = reaction.emoji.name.toLowerCase();
          reactions[emoji] ++;
          reactions.users.push({ id: user.id, role: emoji});
          reaction.users.remove(user);
          console.log(reactions);
          console.log(reaction.emoji.name);
          console.log(user.username);
        });

        msg.react('<:Tank:933062548046106665>')
        .then(() => msg.react('<:Healer:933062562076057671>'))
        .then(() => msg.react('<:Melee_DPS:933062571836182548>'))
        .then(() => msg.react('<:Physical_Ranged_DPS:933062582326136872>'))
        .then(() => msg.react('<:Magic_Ranged_DPS:933062594158276659>'))
        .then(() => msg.react('<:Dispo_si_besoin:933068148360487023>'))
        .then(() => msg.react('<:Maybe:933068124037709854>'))
        .then(() => msg.react('<:Pas_dispo:933068138550018108>'))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
  }
})

client.login(token);

module.exports = { client };
