const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");

const { parse, format, isValid, isFuture, isBefore } = require('date-fns');
const fr = require('date-fns/locale/fr');
const cloudinary = require('cloudinary').v2;

const { discordRoles, emojis, channels, activities } = require('./ressources');
const { setCollector, react, getDiscordTime, handlePlanning, handleReaction, handleEnd, createEmbed, createEventEmbed, confirm } = require('./functions');

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
        if ((activities[event.type].yesno && msg.reactions.cache.size != 4) || (!activities[event.type].yesno && msg.reactions.cache.size != 10)) {
          console.log('some reactions are missing');
          msg.reactions.removeAll().then(() => {
            react(msg, event.type);
          })
        }
      }).catch(e => {
        if (e.httpStatus == 404) {
          console.log('message not found');

          createEventEmbed(event).then(embed => {
            channel.send({ content: `<@&${discordRoles.membres}> <@&${discordRoles.jeunes_membres}>`, embeds: [embed] })
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
// !shoi add type date hour
client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  const isAdmin = msg.member.roles.cache.has(discordRoles.officier);

  if (string.startsWith('!shoi add') && isAdmin) {
    const type = string.split(' ')[2];
    const hour = string.split(' ')[4];
    const parsedDate = parse(string.split(' ')[3] + ':' + hour, 'dd/MM/yyyy:HH', new Date());

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
      let typeList = [];

      for (let category of activities.categories) {
        let types = [];
        for (let type in activities) {
          if (activities[type].category == category.name) {
            types.push(type);
          }
        }
        types = `${category.emoji} **${category.name}**\n${types.join('\n')}`;
        typeList.push(types);
      }

      typeList = typeList.join('\n\n');
      const embed = createEmbed('Le type de sortie "' + type +'" est incorrect.\n\n🔹**Liste des types acceptés :**\n\n' + typeList, emojis.error + " Une erreur s'est produite");

      msg.reply({ embeds: [embed] })
      .then(reply => {
        msg.delete();
      })
    } else {
      const date = format(parsedDate, 'E d MMMM', { locale: fr });

      const channel = client.channels.cache.get(channels.inscriptions);
      const event = { type, date, hour: hour + ':00' };

      createEventEmbed(event, msg.channel).then(
        ([embed, customImage, customImageId, fields, subtitle]) => {
        msg.delete();

        channel.send({ content: `<@&${discordRoles.membres}> <@&${discordRoles.jeunes_membres}>`, embeds: [embed] })
        .then(msg => {
          embed.footer = {
            text: embed.footer.text + `\nID : ${msg.id}`,
            icon_url: 'https://i.goopics.net/fc2ntk.png'
          }
          msg.edit({ embeds: [embed] });
          DiscordEvent.create({
            discordId: msg.id,
            title: embed.title,
            subtitle: subtitle ? subtitle : null,
            date: parsedDate,
            formattedDate: date,
            hour: hour + ':00',
            type: type,
            fields: fields ? Buffer.from(JSON.stringify(fields)) : null,
            customImage: customImage ? Buffer.from(JSON.stringify(customImage)) : null,
            customImageId: customImageId ? customImageId : null
          }).then(discordEvent => {
            react(msg, type);
            handlePlanning().then(() => {
              setCollector(discordEvent, msg);
            })
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
// !shoi cancel messageId
client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  const isAdmin = msg.member.roles.cache.has(discordRoles.officier);
  if (isAdmin && (string.startsWith('!shoi cancel'))) {
    const messageId = string.split(' ')[2];
    msg.delete();

    if (messageId) {
      const channel = client.channels.cache.get(channels.inscriptions);
      DiscordEvent.findOne({ where: { discordId: messageId } }).then(event => {
        if (event) {
          if (event.customImageId) {
            cloudinary.uploader.destroy(event.customImageId);
          }
          event.destroy();
        }
        channel.messages.fetch(messageId).then(message => {
          message.delete()
          .catch(e => {
            console.error(e);
          })
        })
      })
    }
  }
})
// !shoi clear
client.on('messageCreate', msg => {
  if (msg.author.bot || msg.channel.type == 'DM') { return };
  const string = msg.content.toLowerCase();
  const isAdmin = msg.member.roles.cache.has(discordRoles.officier);
  if (isAdmin && (string == '!shoi clear')) {
    confirm(msg, string).then(confirmed => {
      if (confirmed) {
        msg.channel.bulkDelete(100);
      } else {
        msg.delete();
      }
    })
  }
})
