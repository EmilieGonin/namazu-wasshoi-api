const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");

const { parse, format, isValid, isFuture, isBefore } = require('date-fns');
const fr = require('date-fns/locale/fr');

const { discordRoles, emojis, channels, activities } = require('./ressources');
const { setCollector, react, getDiscordTime, handlePlanning, handleReaction, handleEnd, createEmbed, createEventEmbed } = require('./functions');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { client } = require('./config');

client.once('ready', () => {
  console.log('Je suis prêt, wasshoi !');

  DiscordEvent.findAll().then(discordEvents => {
    const channel = client.channels.cache.get(channels.inscriptions);

    for (let event of discordEvents) {
      channel.messages.fetch(event.discordId).then(msg => {
        console.log('message found');
        setCollector(event, msg);
        if (msg.reactions.cache.size != 10) {
          console.log('some reactions are missing');
          msg.reactions.removeAll().then(() => {
            react(msg, emojis.event);
          })
        }
      }).catch(e => {
        if (e.httpStatus == 404) {
          console.log('message not found');

          const file = new MessageAttachment('./assets/' + event.type + '.png');
          createEventEmbed(event).then(embed => {
            channel.send({ content: `<@&${discordRoles.membres}> <@&${discordRoles.jeunes_membres}>`, embeds: [embed], files: [file] })
            .then(msg => {
              event.update({ discordId: msg.id });
              react(msg, emojis.event);
              handlePlanning();
              setCollector(event, msg);
            })
            .catch((e) => {
              console.error(e);
              msg.delete();
            })
          })
        }
      })
    }
  })
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
  const isAdmin = msg.member.roles.cache.has(discordRoles.officier);

  if (string.includes('!planning') && isAdmin) {
    const type = string.split(' ')[1];
    const hour = string.split(' ')[3];
    const parsedDate = parse(string.split(' ')[2] + ':' + hour, 'dd/MM/yyyy:HH', new Date());

    if (!type || !parsedDate || !hour) {
      const embed = createEmbed('Veuillez préciser un type de sortie, une date et une heure de départ.\n\n🔹**Exemple :** `!planning cartes 01/01/2022 21`', emojis.error + " Une erreur s'est produite");
      msg.reply({ embeds: [embed] })
      .then(() => {
        msg.delete();
      })
    } else if (parsedDate && !isValid(parsedDate)) {
      const embed = createEmbed('Le format de la date et/ou de l\'heure est incorrect.\n\n🔹**Exemple :** `!planning cartes 01/01/2022 21`', emojis.error + " Une erreur s'est produite");
      msg.reply({ embeds: [embed] })
      .then(() => {
        msg.delete();
      })
    } else if (parsedDate && isBefore(parsedDate, new Date())) {
      const embed = createEmbed('La date ne peut pas être antérieure à aujourd\'hui !', emojis.error + " Une erreur s'est produite")
      msg.reply({ embeds: [embed] })
      .then(() => {
        msg.delete();
      })
    } else if (!activities[type]) {
      const types = [];

      for (let type in activities) {
        types.push(' ' + type)
      }

      const embed = createEmbed('Le type de sortie "' + type +'" est incorrect.\n\n🔹**Liste des types acceptés :**' + types.toString(), emojis.error + " Une erreur s'est produite");

      msg.reply({ embeds: [embed] })
      .then(reply => {
        msg.delete();
      })
    } else {
      const date = format(parsedDate, 'E d MMMM', { locale: fr });

      const file = new MessageAttachment('./assets/' + type + '.png');
      const channel = client.channels.cache.get(channels.inscriptions);
      const event = { type, date, hour: hour + ':00' };

      createEventEmbed(event).then(embed => {
        msg.delete();

        channel.send({ content: `<@&${discordRoles.membres}> <@&${discordRoles.jeunes_membres}>`, embeds: [embed], files: [file] })
        .then(msg => {
          DiscordEvent.create({
            discordId: msg.id,
            title: embed.title,
            date: parsedDate,
            formattedDate: date,
            hour: hour + ':00',
            type: type
          }).then(discordEvent => {
            react(msg, emojis.event);
            handlePlanning();
            setCollector(discordEvent, msg);
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
      })
    }
  }
})
