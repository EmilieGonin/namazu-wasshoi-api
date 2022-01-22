const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");

const { parse, format, isValid, getTime } = require('date-fns');
const fr = require('date-fns/locale/fr');

const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
const { embed, activities } = require('./embed');
const { roles, emojis } = require('./ressources');
const { getDiscordUser, userFound, react, getJob } = require('./functions');
const discordToken = process.env.WASSHOBOT_KEY;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});

client.once('ready', () => {
  console.log('Je suis prêt, wasshoi !');
})

client.on('messageCreate', msg => {
  const string = msg.content.toLowerCase();
  if (!msg.author.bot && (string.includes('wasshoi') && string.includes('gyoshoi'))) {
    msg.reply('Yes yes, wasshoi !');
  }
})

// !planning type date hour
client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  const isAdmin = msg.member.roles.cache.has(roles.test);
  // const isAdmin = true;

  if (string.includes('!planning') && isAdmin) {
    const event = {
      footer: {
        text: 'Consultez les messages épinglés pour obtenir de l\'aide.',
        icon_url: 'https://i.goopics.net/fc2ntk.png'
      }
    };

    const type = string.split(' ')[1];
    const hour = string.split(' ')[3];
    const parsedDate = parse(string.split(' ')[2] + ':' + hour, 'dd/MM/yyyy:HH', new Date())

    if (!type || !parsedDate || !hour) {
      msg.reply(':warning: Veuillez préciser un type de sortie, une date et une heure de départ.\n\n🔹**Exemple :** `!planning cartes 01/01/2022 21`')
      .then(() => {
        msg.delete();
      })
    } else if (parsedDate && !isValid(parsedDate)) {
      msg.reply(':warning: Le format de la date et/ou de l\'heure est incorrect.\n\n🔹**Exemple :** `!planning cartes 01/01/2022 21`')
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
      const date = format(parsedDate, 'E d MMMM', { locale: fr });

      for (let i in activities[type]) {
        event[i] = activities[type][i];
      }

      basicFields = [
        { name: '** **', value: '** **' },
        { name: ':calendar: Date', value: '`' + date + '`', inline: true },
        { name: ':clock1: Heure de départ', value: '`' + hour + ':00`', inline: true },
        { name: '<:Inscrits:933695822028226601> **Inscrits**', value: '`0`', inline: true },
      ]

      event.fields = basicFields;
      const file = new MessageAttachment('./assets/' + type + '.png');

      msg.delete();
      msg.channel.send({ embeds: [event], files: [file] })
      .then(msg => {
        DiscordEvent.create({
          discordId: msg.id,
          date: parsedDate
        }).then(discordEvent => {
          const datas = discordEvent.dataValues;
          react(msg, emojis.event);

          async function collector() {
            const filter = (reaction, user) => {
              return emojis.event.includes(
                `<:${reaction.emoji.name}:${reaction.emoji.id}>`
              ) && !user.bot;
            };

            const collector = msg.createReactionCollector({ filter, time: 100000 });

            collector.on('collect', (reaction, user) => {
              reaction.users.remove(user);
              const emoji = reaction.emoji.name.toLowerCase();
              const roleEmoji = 'roles_' + emoji;
              const stateEmoji = 'state_' + emoji;

              if (datas.hasOwnProperty(roleEmoji)) {
                discordEvent[roleEmoji]++;

                getDiscordUser(user.id, discordEvent.id).then(discordUser => {
                  if (discordUser) {
                    userFound(discordUser, discordEvent.id).then(userFound => {
                      if (userFound && user[emoji + 'Job']) {
                        //Get user job
                        discordEvent[roleEmoji]--;
                        reactions.users[i].role = emoji;

                        //Check if user has a state
                        // if (reactions.users[i].state) {
                        //   reactions.state[reactions.users[i].state]--;
                        //   reactions.users[i].state = '';
                        // }
                      } else if (userFound) {
                        //Ask job
                      } else if (user[emoji + 'Job']) {
                        //
                      } else {
                        //Ask job
                      }
                    })
                  } else {
                    //Ask job
                    discordEvent.createDiscordEventReaction({
                      role: emoji,
                      DiscordUser: {
                        discordId: user.id
                      }
                    }, {
                      include: [ DiscordUser ]
                    });
                  }
                })
              } else if (!userFound) {
                console.log("Sélectionnez d'abord un rôle."); //Ajouter mp
              } else {
                if (reactions.users[i].state) {
                  reactions.state[reactions.users[i].state]--;
                }
                reactions.state[emoji] ++;
                reactions.users[i].state = emoji;
              }

              // console.log(reactions);
              // console.log(reaction.emoji.name);
              // console.log(user.username);

              let newFields = [];
              let newField = { name: '** **', inline: true };

              // if (reactions.roles.tank) {
              //   const tankUsers = reactions.users.map(item => {
              //     if (item.role == "tank" && !item.state) {
              //       return item.username;
              //     }
              //   }).join('\n');
              //   newField.value = '<:Tank:933062548046106665> **Tanks** (' + reactions.roles.tank + ')\n' + tankUsers;
              //   newFields.push(newField);
              // }
              //
              // if (reactions.roles.healer) {
              //   newField.value = '<:Healer:933062562076057671> **Healers** (' + reactions.roles.healer + ')'
              //   newFields.push(newField);
              // }
              //
              // if (reactions.roles.melee_dps) {
              //   newField.value = '<:Melee_DPS:933062571836182548> **DPS de mêlée** (' + reactions.roles.melee_dps + ')'
              //   newFields.push(newField);
              // }
              //
              // if (reactions.roles.physical_ranged_dps) {
              //   newField.value = '<:Physical_Ranged_DPS:933062582326136872> **DPS à distance physiques** (' + reactions.roles.physical_ranged_dps + ')'
              //   newFields.push(newField);
              // }
              //
              // if (reactions.roles.magic_ranged_dps) {
              //   newField.value = '<:Magic_Ranged_DPS:933062594158276659> **DPS à distance magiques** (' + reactions.roles.magic_ranged_dps + ')'
              //   newFields.push(newField);
              // }

              // newFields.push({ name: '** **', value: '** **' });
              // basicFields[3] = { name: '<:Inscrits:933695822028226601> **Inscrits**', value: '`' + reactions.users.length + '`', inline: true };
              event.fields = [...basicFields, ...newFields];

              // const eventIndex = event.fields.findIndex(item => item.value.includes(reaction.emoji.name));
              // console.log(eventIndex);
              //
              // const map = reactions.users.map(item => item.username).join('\n');
              //
              // event.fields[eventIndex].value = event.fields[eventIndex].value + '\n' + map;
              //
              msg.edit({ embeds: [event] });
            });
          }
          collector();
        })
        .catch((e) => {
          console.error(e);
          msg.delete();
        })
      })
      .catch((e) => {
        console.error(e);
        msg.delete();
      })
    }
  }
})

client.login(discordToken);

module.exports = { client };
