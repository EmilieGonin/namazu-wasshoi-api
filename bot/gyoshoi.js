const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");

const { parse, format, isValid, isFuture } = require('date-fns');
const fr = require('date-fns/locale/fr');

const { activities } = require('./embed');
const { discordRoles, emojis } = require('./ressources');
const { react, getDiscordTime, handleReaction, handleEnd } = require('./functions');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { client } = require('./config');

client.once('ready', () => {
  console.log('Je suis prêt, wasshoi !');
})

client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  if (string == '!wasshoi' || (string.includes('wasshoi') && string.includes('gyoshoi'))) {
    msg.reply('Yes yes, wasshoi !');
  }
})

// !planning type date hour
client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  const isAdmin = msg.member.roles.cache.has(discordRoles.test);
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
      msg.channel.send({ content: `<@&${discordRoles.membres}> <@&${discordRoles.jeunes_membres}>`, embeds: [event], files: [file] })
      .then(msg => {
        DiscordEvent.create({
          discordId: msg.id,
          date: parsedDate
        }).then(discordEvent => {
          react(msg, emojis.event);

          async function setCollector() {
            const filter = (reaction, user) => {
              return emojis.event.includes(
                `<:${reaction.emoji.name}:${reaction.emoji.id}>`
              ) && !user.bot;
            };

            const collector = msg.createReactionCollector({ filter, time: getDiscordTime(parsedDate) });

            collector.on('collect', (reaction, user) => {
              reaction.users.remove(user);
              handleReaction(reaction, user, discordEvent)
              .then(newFields => {
                console.log("function ended");
                if (newFields) {
                  discordEvent.countDiscordEventReactions({
                    where: {
                      role: { [Op.not]: null },
                      state: { [Op.is]: null }
                    }
                  }).then(total => {
                    basicFields[3].value = `\`${total}\``;
                    event.fields = [...basicFields, ...newFields];
                    msg.edit({ embeds: [event] });
                  })
                }
              })
            });

            collector.on('end', () => {
              console.log('ended');
              if (isFuture(parsedDate)) {
                console.log('reset');
                setCollector();
              } else {
                handleEnd(discordEvent).then(msgContent => {
                  if (msgContent) {
                    msg.channel.send(msgContent);
                  }
                  msg.delete();
                })
              }
            })
          }
          setCollector();
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
