const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction, DiscordMessage, DiscordGuild, Minion } = require("../models/index");

const { parse, format, isValid, isFuture, isBefore } = require('date-fns');
const fr = require('date-fns/locale/fr');
const cloudinary = require('cloudinary').v2;

const { discordRoles, emojis, channels, activities } = require('./ressources');
const { setCollector, react, getDiscordTime, handlePlanning, handleReaction, handleEnd, createEmbed, createEventEmbed, confirm, checkEvents, getRarity, getMinion, createInventory, isAdmin, updateMinions, error } = require('./functions');

const main = require('./gyoshoi-main');
const music = require('./gyoshoi-music');

const { MessageEmbed, MessageAttachment } = require('discord.js');
const { client } = require('./config');

client.once('ready', () => {
  console.log('Je suis prêt, wasshoi !');
  checkEvents().then(() => {
    console.log('events checked');
    handlePlanning().then(() => {
      console.log('planning handled');
    })
  })
  updateMinions().then(() => {
    console.log('minions updated');
  })
})
client.on('messageCreate', async msg => {
  if (!msg.author.bot && msg.channel.type != 'DM') {
    const string = msg.content.toLowerCase();
    const content = msg.content;
    let command;
    if (string.startsWith('!')) {
      command = string.replace('!', '').replace('shoi', '');
      if (command.startsWith(' ')) {
        command = command.replace(' ', '');
      }
      command = command.split(' ')[0];
      console.log(`Commande utilisée : ${command}`);
    }
    const [guild] = await DiscordGuild.findOrCreate({
      where: { discordId: msg.guildId }
    });
    if (string.startsWith('!wasshoi')) {
      // !wasshoi
      msg.reply('Yes yes, wasshoi !');
    } else if (string.startsWith('!shoi add') && isAdmin(msg.member)) {
      // !shoi add type date hour
      const type = string.split(' ')[2];
      const hour = string.split(' ')[4];
      const parsedDate = parse(string.split(' ')[3] + ':' + hour, 'dd/MM/yyyy:HH', new Date());

      if (!type || !parsedDate || !hour) {
        const embed = createEmbed('Veuillez préciser un type de sortie, une date et une heure de départ.\n\n🔹**Exemple :** `!shoi add cartes 01/01/2022 21`', emojis.error + " Une erreur s'est produite");
        msg.reply({ embeds: [embed] })
        .then(() => {
          msg.delete();
        })
      } else if (parsedDate && !isValid(parsedDate)) {
        const embed = createEmbed('Le format de la date et/ou de l\'heure est incorrect.\n\n🔹**Exemple :** `!shoi add cartes 01/01/2022 21`', emojis.error + " Une erreur s'est produite");
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

        createEventEmbed(event, msg.channel, msg.author).then(
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
    } else if (string.startsWith('!shoi cancel') && isAdmin(msg.member)) {
      // !shoi cancel messageId
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
    } else if (main.hasOwnProperty(command) && isAdmin(msg.member)) {
      // !shoi clear
      main[command](msg);
    } else if (string == '!shoi minion' || string == '!shoimon' || string == '!pokeshoi') {
      // !shoi minion || !shoimon || !pokeshoi
      const channel = msg.channel;
      const user = msg.author;
      msg.delete();
      getMinion(channel, user);
    } else if (string == '!shoi collection' || string == '!shoi list') {
      // !shoi collection || !shoi list
      const channel = msg.channel;
      const user = msg.author;
      msg.delete();
      createInventory(channel, user);
    } else if ((string == '!shoi update') && isAdmin(msg.member)) {
      // !shoi update
      const channel = msg.channel;
      msg.delete();
      console.log("update");
      updateMinions(channel);
    } else if (music.hasOwnProperty(command)) {
      const song = content.split(' ')[2];

      if (!msg.member.voice.channelId) {
        error(msg.channel, 'Vous devez être dans un salon vocal pour utiliser cette commande.');
      } else {
        music[command](guild, msg, song);
      }

      msg.delete();
    }
  };
})
