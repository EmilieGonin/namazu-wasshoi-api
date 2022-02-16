const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction, DiscordMessage, Minion, DiscordUserMinion, DiscordVote, sequelize } = require("../models/index");
const { discordRoles, emojis, roles, states, channels, link, activities, rarities } = require('./ressources');
const { differenceInMilliseconds, formatDistanceToNowStrict, addHours, subHours, isBefore, isFuture, isEqual, format, formatDuration, intervalToDuration } = require('date-fns');
const fr = require('date-fns/locale/fr');
const cloudinary = require('cloudinary').v2;
const { MessageAttachment } = require('discord.js');
const { client } = require('./config');
const { xivapi } = require("../helpers/xivapi");
const axios = require("axios");

async function setCollector(discordEvent, msg) {
  const filter = (reaction, user) => {
    if (activities[discordEvent.type].yesno) {
      return emojis.event.yesno.includes(
        `<:${reaction.emoji.name}:${reaction.emoji.id}>`
      ) && !user.bot;
    } else {
      return emojis.event.default.includes(
        `<:${reaction.emoji.name}:${reaction.emoji.id}>`
      ) && !user.bot;
    }
  };

  const collector = msg.createReactionCollector({ filter, time: getDiscordTime(discordEvent) });

  collector.on('collect', (reaction, user) => {
    reaction.users.remove(user);
    handleReaction(reaction, user, discordEvent)
    .then(newFields => {
      console.log("function ended");
      if (newFields) {
        handlePlanning();
        createEventEmbed(discordEvent, msg.channel, '', newFields).then(([embed]) => {
          msg.edit({ embeds: [embed] });
        })
      }
    })
  });

  collector.on('end', () => {
    console.log('ended');
    DiscordEvent.findOne({
      where: { discordId: msg.id }
    }).then(discordEvent => {
      if (discordEvent && isFuture(discordEvent.date)) {
        console.log('reset');
        setCollector(discordEvent, msg);
      } else if (discordEvent) {
        handleEnd(discordEvent).then(msgContent => {
          if (msgContent) {
            const channel = client.channels.cache.get(channels.rassemblement);
            channel.send(msgContent);
          }
          msg.delete();
          if (discordEvent.customImageId) {
            cloudinary.uploader.destroy(discordEvent.customImageId);
          }
          discordEvent.destroy().then(() => {
            handlePlanning();
          })
        })
      } else {
        handlePlanning();
      }
    })
    // handleEnd(discordEvent).then(msgContent => {
    //   if (msgContent) {
    //     msg.channel.send(msgContent);
    //   }
    //   console.log('deleting message');
    //   msg.delete();
    // })
  })
}
async function react(msg, type, reactions) {
  try {
    if (reactions) {
      for (let reaction of reactions) {
        await msg.react(reaction);
      }
    } else if (activities[type].yesno) {
      for (let reaction of emojis.event.yesno) {
        await msg.react(reaction);
      }
    } else {
      for (let reaction of emojis.event.default) {
        await msg.react(reaction);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
function getDiscordTime(discordEvent) {
  const time = differenceInMilliseconds(discordEvent.date, new Date());
  const twentyfourHours = 86400000;
  const threeHours = 10800000;
  const oneHour = 3600000;

  if (time > twentyfourHours) {
    //return the time - 24h
    //to make sure logs and notifications are activated on time
    if ((time - twentyfourHours) > twentyfourHours) {
      return twentyfourHours;
    } else {
      return time - twentyfourHours;
    }
  } else if (time <= twentyfourHours && time > threeHours) {
    //activate logs
    if (!discordEvent.logs) {
      discordEvent.update({ logs: true });
    }

    if (!discordEvent.notifications_24h) {
      console.log('sending notifications_24h');
      discordEvent.update({ notifications_24h: true });
      sendNotification('24h', discordEvent);
    }

    //return the time - 3h
    // to make sure notifications are activated on time
    return time - threeHours;
  } else if (time <= threeHours && time > oneHour) {
    if (!discordEvent.notifications_3h) {
      console.log('sending notifications_3h');
      discordEvent.update({ notifications_3h: true });
      sendNotification('3h', discordEvent);
    }

    //return the time - 1h
    // to make sure notifications are activated on time
    return time - oneHour;
  } else if (time <= oneHour) {
    if (!discordEvent.notifications_1h) {
      console.log('sending notifications_1h');
      discordEvent.update({ notifications_1h: true });
      sendNotification('1h', discordEvent);
    }

    return time;
  }
}
function getJob(user, role) {
  return new Promise((resolve, reject) => {
    const jobs = emojis[role].map((item, index) => `\`${index + 1}\` ${item}`).join('\n');
    const embed = createEmbed("Répondez avec le numéro du job de votre choix.\n\n" + jobs, emojis.edit + " Sélection du job");
    user.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot;
      const collector = user.dmChannel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        if (emojis[role][m.content - 1]) {
          collector.stop();
          resolve(emojis[role][m.content - 1]);
        } else {
          const embed = createEmbed("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise + '\n\n' + jobs, emojis.error + " Une erreur s'est produite");

          user.send({ embeds: [embed] });
          collector.resetTimer();
        }
      })
    })
  })
}
// function getSubtype(channel) {
//   return new Promise((resolve, reject) => {
//     const embed = createEmbed("Veuillez m'indiquer le nom du jeu pour cette soirée jeux.", emojis.edit + " Configuration de la sortie");
//     channel.send({ embeds: [embed] }).then(msg => {
//       const filter = m => !m.author.bot;
//       const collector = channel.createMessageCollector({ filter, time: 600000 });
//
//       collector.on('collect', m => {
//         if (m.attachments) {
//           collector.stop();
//           resolve(m.attachments);
//         } else {
//           const embed = createEmbed("Je n'ai pas réussi à récupérer d'image ! " + emojis.shoi.surprise + " Veuillez en uploader une.", emojis.error + " Une erreur s'est produite");
//
//           user.send({ embeds: [embed] });
//           collector.resetTimer();
//         }
//       })
//     })
//   });
// }
function getImage(channel, user) {
  return new Promise((resolve, reject) => {
    const embed = createEmbed("Veuillez uploader une image pour la sortie.", emojis.edit + " Configuration de la sortie");
    channel.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot && m.author == user;
      const collector = channel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        if (m.attachments.size) {
          const file = m.attachments.first().attachment;
          cloudinary.uploader.upload(file, { folder: "Gyoshoi" }, (e, upload) => {
            if (e) {
              const embed = createEmbed("Je n'ai pas réussi à récupérer d'image ! " + emojis.shoi.surprise + " Veuillez en uploader une.", emojis.error + " Une erreur s'est produite");

              channel.send({ embeds: [embed] });
              collector.resetTimer();
            } else {
              msg.delete();
              m.delete();
              collector.stop();
              resolve({ url: upload.url, id: upload.public_id });
            }
          })
        } else {
          const embed = createEmbed("Je n'ai pas réussi à récupérer d'image ! " + emojis.shoi.surprise + " Veuillez en uploader une.", emojis.error + " Une erreur s'est produite");

          channel.send({ embeds: [embed] });
          collector.resetTimer();
        }
      })
    })
  });
}
function activityPrompt(channel, user, field) {
  return new Promise(function(resolve, reject) {
    const embed = createEmbed(`Veuillez m'indiquer le texte à afficher pour le champ **${field}**.`, emojis.edit + " Configuration de la sortie");
    channel.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot && m.author == user;
      const collector = channel.createMessageCollector({ filter, max: 1, time: 600000 });

      collector.on('collect', m => {
        const prompt = m.content;
        msg.delete();
        m.delete();
        resolve(prompt);
      })
    })
  });
}
async function handleReaction(reaction, user, discordEvent) {
  console.log("function started");
  const emoji = reaction.emoji.name.toLowerCase();
  console.log("emoji used : " + emoji);
  const emojiCode = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
  const roleEmoji = discordEvent.dataValues.hasOwnProperty('roles_' + emoji);
  const stateEmoji = discordEvent.dataValues.hasOwnProperty('state_' + emoji);

  // const nickname = (await reaction.emoji.guild.members.fetch(user.id)).nickname;
  const [discordUser] = await DiscordUser.findOrCreate({
    where: { discordId: user.id },
    defaults: { discordName: user.username }
  });

  const [discordEventReaction] = await DiscordEventReaction.findOrCreate({
    where: {
      DiscordUserId: discordUser.id,
      DiscordEventId: discordEvent.id
    }
  });

  if (!activities[discordEvent.type].hasOwnProperty('yesno') && (stateEmoji || emoji == 'changer_job') && emoji != 'pas_dispo' && !discordEventReaction.role) {
    console.log('no role');
    const embed = createEmbed("Vous devez d'abord choisir un rôle.", emojis.error + " Une erreur s'est produite");
    user.send({ embeds: [embed] });
    return;
  } else if (emoji == 'changer_job' && discordEventReaction.role) {
    console.log('change job');
    const job = await getJob(user, discordEventReaction.role);
    console.log('job checked');
    const embed = createEmbed(`Désormais, votre rôle de ${roles[discordEventReaction.role].emoji} sera automatiquement lié au job ${job}.`, emojis.update + " Mise à jour du job");

    user.send({ embeds: [embed] });
    discordUser[discordEventReaction.role + 'Job'] = job;
  }

  if (emoji == 'rappel_par_mp') {
    console.log('rappel');
    await handleNotifications(user, discordUser);
  }

  if (emoji == 'pas_dispo' && discordEventReaction.role && discordEvent.logs && isBefore(discordEventReaction.createdAt, subHours(discordEvent.date, 24))) {
    const hasOptOut = await optOut(user);

    if (hasOptOut) {
      const interval = formatDistanceToNowStrict(discordEventReaction.createdAt, { locale: fr });
      const channel = client.channels.cache.get(channels.logs);
      embed = createEmbed(`${discordUser.discordName} vient de se désinscrire de la sortie ${discordEvent.title} (${interval} après son inscription).`)
      channel.send({ embeds: [embed] });
    } else {
      return;
    }
  }

  if (stateEmoji) {
    console.log("-state-");
    if (discordEventReaction.state) {
      console.log('already state, removing old one');
      await discordEvent.decrement('state_' + discordEventReaction.state);
    } else if (discordEventReaction.role) {
      console.log('no state, removing role');
      await discordEvent.decrement('roles_' + discordEventReaction.role);
    }

    discordEventReaction.state = emoji;
    await discordEvent.reload();
    await discordEvent.increment('state_' + emoji);
  } else if (roleEmoji) {
    console.log('-role-');
    if (discordEventReaction.state) {
      console.log('state, removing it');
      await discordEvent.decrement('state_' + discordEventReaction.state);
      discordEventReaction.state = null;
    } else if (!discordEventReaction.state && discordEventReaction.role) {
      console.log('no state but already role, removing old one');
      console.log(discordEventReaction.role);
      await discordEvent.decrement('roles_' + discordEventReaction.role);
    }
    discordEventReaction.role = emoji;
    await discordEvent.reload();
    await discordEvent.increment('roles_' + emoji);

    if (!activities[discordEvent.type].yesno && !discordUser[emoji + 'Job']) {
      console.log('checking job');
      const job = await getJob(user, emoji);
      console.log('job checked');
      const embed = createEmbed(`Désormais, votre rôle de ${emojiCode} sera automatiquement lié au job ${job}.`, emojis.update + " Mise à jour du job");

      user.send({ embeds: [embed] });
      discordUser[emoji + 'Job'] = job;
    }

    if (discordEvent.subtitle.startsWith('!')) {
      let vote = await DiscordVote.findOne({ where:
        { DiscordEventId: discordEvent.id, DiscordUserId: discordUser.id }
      })

      if (!vote) {
        vote = await getVote(discordEvent, user);
        await DiscordVote.create({
          DiscordUserId: discordUser.id,
          DiscordEventId: discordEvent.id,
          vote
        });
      }
    }
  }

  await discordEvent.reload();
  await discordUser.save();
  await discordEventReaction.save();

  //Edit embed
  let newFields = [];

  for (let item in discordEvent.dataValues) {
    if (item.startsWith('roles_')) {
      const role = item.replace('roles_', '');
      let users = (await DiscordUser.findAll({
        include: {
          model: DiscordEventReaction,
          where: {
            DiscordEventId: discordEvent.id,
            role: role,
            state: { [Op.is]: null }
          }
        }
      })).map(item => {
        if (item[role + 'Job']) {
          return `${item[role + 'Job']} <@${item.discordId}>`;
        } else {
          return `<@${item.discordId}>`;
        }
      });

      let newField;

      if (emojis[role]) {
        users = users.join('\n');
        newField = {
          name: '** **',
          inline: true,
          value: `${roles[role].emoji} **${roles[role].name}** (${discordEvent[item]})\n${users}`
        };
      } else {
        users = users.join(', ');
        newField = {
          name: '** **',
          inline: false,
          value: `${roles[role].emoji} **${roles[role].name}** : ${users}`
        };
      }

      if (discordEvent[item]) {
        newFields.push(newField);
      }
    } else if (item.startsWith('state_')) {
      const state = item.replace('state_', '');
      const users = (await DiscordUser.findAll({
        include: {
          model: DiscordEventReaction,
          where: {
            DiscordEventId: discordEvent.id,
            state: state
          }
        }
      })).map(item => {
        const role = item.DiscordEventReactions[0].role;
        if (role && item[role + 'Job']) {
          return `${item[role + 'Job']} <@${item.discordId}>`;
        } else {
          return `<@${item.discordId}>`;
        }
      }).join(', ');

      let newField = {
        name: '** **',
        value: `${states[state].emoji} **${states[state].name}** (${discordEvent[item]}) : ${users}`
      };

      if (discordEvent[item]) {
        newFields.push(newField);
      }
    }
  }

  if (discordEvent.subtitle && discordEvent.subtitle.startsWith('!')) {
    const poll = discordEvent.subtitle.replace('!', '').split(',');

    let votes = [];

    for (let option of poll) {
      const count = await discordEvent.countDiscordVotes({
        where: { vote: { [Op.regexp]: option } }
      });
      if (count > 0) {
        votes.push(`:small_blue_diamond:${option} (${count})`);
      }
    }

    votes = votes.join('\n');

    let newField = {
      name: '** **',
      inline: false,
      value: `**Votes pour le contenu**\n${votes}`
    };

    newFields.push(newField);
  }

  return newFields;
}
async function handleEnd(discordEvent) {
  //Votes
  let votes = [];
  if (discordEvent.subtitle && discordEvent.subtitle.startsWith('!')) {
    const poll = discordEvent.subtitle.replace('!', '').split(',');

    for (let option of poll) {
      const count = await discordEvent.countDiscordVotes({
        where: { vote: { [Op.regexp]: option } }
      });
      if (count > 0) {
        votes.push(`:small_blue_diamond:${option} (${count})`);
      }
    }

    votes = votes.join('\n');
  }

  //Mentions
  const users = (await DiscordUser.findAll({
    include: {
      model: DiscordEventReaction,
      where: {
        DiscordEventId: discordEvent.id,
        role: { [Op.not]: null },
        state: { [Op.is]: null }
      }
    }
  })).map(item => `<@${item.discordId}>`).join(' ');

  const usersDispo = (await DiscordUser.findAll({
    include: {
      model: DiscordEventReaction,
      where: {
        DiscordEventId: discordEvent.id,
        state: 'dispo_si_besoin'
      }
    }
  })).map(item => `<@${item.discordId}>`).join(' ');

  let msg = '';

  if (users) {
    msg = `🔹**C'est l'heure de la sortie !**\n${users}`;
  }

  if (usersDispo) {
    msg = msg + `\n\n${states.dispo_si_besoin.emoji} **${states.dispo_si_besoin.name}** : ${usersDispo}`;
   }

   if (votes.length) {
     msg = msg + `\n\n**Total des votes**\n${votes}`;
   }

  return msg;
}
function handleNotifications(user, discordUser) {
  return new Promise((resolve, reject) => {
    const embed = createEmbed(`Voici vos paramètres actuels :\n\n\`1\` Rappel 24h : ${discordUser.notifications_24h ? emojis.true : emojis.false}\n\`2\` Rappel 3h : ${discordUser.notifications_3h ? emojis.true : emojis.false}\n\`3\` Rappel 1h : ${discordUser.notifications_1h ? emojis.true : emojis.false}\n\nS'ils ne vous conviennent pas, répondez avec le numéro du paramètre que vous voulez modifier. Vous pouvez spécifier plusieurs numéros dans le même message, séparés par une virgule.\n\nExemple : \`1,2,3\``, emojis.edit + " Configuration des notifications");
    user.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot;
      const collector = user.dmChannel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        const options = m.content.split(',');

        if (options.find(item => item == '1' || item == '2' || item == '3')) {
          if (options.includes('1')) {
            discordUser.notifications_24h = !discordUser.notifications_24h;
          }
          if (options.includes('2')) {
            discordUser.notifications_3h = !discordUser.notifications_3h;
          }
          if (options.includes('3')) {
            discordUser.notifications_1h = !discordUser.notifications_1h;
          }

          discordUser.save().then(() => {
            const embed = createEmbed(`Vos paramètres ont bien été mis à jour !\n\n${emojis.rappel} Rappel 24h : ${discordUser.notifications_24h ? emojis.true : emojis.false}\n${emojis.rappel} Rappel 3h : ${discordUser.notifications_3h ? emojis.true : emojis.false}\n${emojis.rappel} Rappel 1h : ${discordUser.notifications_1h ? emojis.true : emojis.false}`, emojis.update + " Notifications mises à jour");

            user.send({ embeds: [embed] });
            collector.stop();
            resolve();
          });
        } else {
          const embed = createEmbed("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise, emojis.error + " Une erreur s'est produite");

          user.send({ embeds: [embed] });
          collector.resetTimer();
        }
      })
    })
  });
}
function optOut(user) {
  return new Promise(function(resolve, reject) {
    let embed = createEmbed(`**Es-tu sûr(e) de vouloir te désinscrire ?** ${emojis.shoi.surprise} S'il n'y a pas assez de monde pour la sortie, il se peut qu'elle soit annulée !\n\nRéponds \`oui\` pour valider ta désincription, ou \`non\` pour l'annuler.`, emojis.error + " Tu dois valider ta désinscription");
    user.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot;
      const collector = user.dmChannel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        const answer = m.content.toLowerCase();
        if (answer == 'oui') {
          const embed = createEmbed(`J'espère que tout va bien, wasshoi ! Ta désinscription ayant lieu moins de 24h avant la sortie, elle va être notifiée aux officiers. Pas de panique ! Nous receuillons ces informations uniquement à titre informatif. N'hésites surtout pas à contacter un officier si tu as besoin d'aide.`, emojis.update + " Tu as bien été désinscrit(e)");
          user.send({ embeds: [embed] });
          collector.stop();
          resolve(true);
        } else if (answer == 'non') {
          const embed = createEmbed(`C'est noté, tu es toujours inscrit(e), wasshoi !`, emojis.update + " Désinscription annulée");
          user.send({ embeds: [embed] });
          collector.stop();
          resolve(false);
        } else {
          const embed = createEmbed("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise, emojis.error + " Une erreur s'est produite");

          user.send({ embeds: [embed] });
          collector.resetTimer();
        }
      })
    })
  });
}
function createEmbed(description, title) {
  const embed = {
    color: "#e62e39",
    title: title ? title : '',
    description: description
  }

  return embed;
}
async function createEventEmbed(event, channel, user, newFields) {
  const embed = {
    footer: {
      text: `Consultez les messages épinglés pour obtenir de l'aide.${event.discordId ? '\nID : ' + event.discordId : ''}`,
      icon_url: 'https://i.goopics.net/fc2ntk.png'
    }
  };

  for (let i in activities[event.type]) {
    embed[i] = activities[event.type][i];
  }

  let subtitle;

  if (activities[event.type].subtitle) {
    if (event.subtitle) {
      subtitle = event.subtitle;
    } else {
      subtitle = await activityPrompt(channel, user, activities[event.type].subtitle);
    }

    if (subtitle.startsWith('!')) {
      embed.title = event.title ? event.title : embed.title;
    } else {
      embed.title = event.title ? event.title : `${embed.title} : ${subtitle}`;
    }
  }

  let fields = [];

  if (activities[event.type].fields) {
    if (event.fields) {
      fields = JSON.parse(event.fields);
    } else {
      for (let field of activities[event.type].fields) {
        let prompt;
        if (field.name) {
          prompt = await activityPrompt(channel, user, field.name);
        }

        if (field.inline) {
          fields.push({ name: `**${(field.noName || !field.name) ? ' ' : field.name }**`, value: `\`${prompt}\``, inline: true });
        } else {
          fields.push({ name: `**${(field.noName || !field.name) ? ' ' : field.name }**`, value: `${field.value ? field.value : '' }${prompt ? prompt : ''}` });
        }
      }
    }
  }

  let customImage;
  let customImageId;

  if (!activities[event.type].image) {
    if (event.customImage) {
      embed.image = JSON.parse(event.customImage);
    } else {
      const image = await getImage(channel, user);
      embed.image = { url: image.url };
      customImage = embed.image;
      customImageId = image.id;
    }
  }

  // if (activities[event.type].subtypes) {
  //   let subtype;
  //
  //   if (event.subtype) {
  //     subtype = event.subtype;
  //   } else {
  //     subtype = await getSubtype(channel, activities[event.type]);
  //   }
  //
  //   for (let i in activities[event.type][subtype]) {
  //     embed[i] = activities[event.type][subtype][i];
  //   }
  // } else {
  //   for (let i in activities[event.type]) {
  //     embed[i] = activities[event.type][i];
  //   }
  // }

  const basicFields = [
    { name: '** **', value: '** **' },
    { name: ':calendar: Date', value: `\`${event.formattedDate ? event.formattedDate : event.date}\``, inline: true },
    { name: ':clock1: Heure de départ', value: '`' + event.hour + '`', inline: true },
    { name: emojis.inscrits + ' **Inscrits**', value: '`0`', inline: true },
  ]

  if (newFields) {
    const total = await event.countDiscordEventReactions({
      where: { role: { [Op.not]: null }, state: { [Op.is]: null } }
    });
    basicFields[3].value = `\`${total}\``;
    embed.fields = [...fields, ...basicFields, ...newFields];
  } else {
    embed.fields = [...fields, ...basicFields];
  }

  if (subtitle && subtitle.startsWith('!')) {
    const poll = subtitle.replace('!', '').split(',').join(', ');
    embed.fields.push({ name: '** **', value: '**Le contenu de cette sortie est soumis à un vote parmi les choix suivants : **' + poll + '.' });
  }

  return [embed, customImage, customImageId, fields, subtitle];
}
async function sendNotification(hour, discordEvent) {
  const users = (await DiscordUser.findAll({
    where: {
      ['notifications_' + hour]: true
    },
    include: {
      model: DiscordEventReaction,
      where: {
        DiscordEventId: discordEvent.id,
        role: { [Op.not]: null },
        state: { [Op.or]: [
          { [Op.is]: null },
          { [Op.ne]: 'pas_dispo' }
        ]}
      }
    }
  })).map(item => item.discordId);

  for (let userId of users) {
    const user = await client.users.fetch(userId);
    const embed = createEmbed(`${emojis.rappel} Rappel : La sortie ${discordEvent.title} démarre dans ${hour} !`)
    user.send({ embeds: [embed] });
  }
}
async function handlePlanning() {
  const [planning, created] = await DiscordMessage.findOrCreate({
    where: { type: 'planning' }
  });

  const dates = (await DiscordEvent.findAll({
    group: ['formattedDate'],
    order: ['date']
  })).map(item => item.formattedDate);

  let eventsList = [];

  if (dates.length) {
    for (let date of dates) {
      const events = (await DiscordEvent.findAll({
        where: { formattedDate: date },
        order: ['hour']
      })).map(item => {
        let users = 0;
        for (let property in item.dataValues) {
          if (property.startsWith('roles_')) {
            users = users + item.dataValues[property];
          }
        }

        return `\`${item.hour}\` ${emojis.inscrits}\`${users}\` [${item.title}](${link}${channels.inscriptions}/${item.discordId})`;
      }).join('\n');
      const string = `\n:calendar: **${date}**\n${events}`
      eventsList.push(string);
    }

    eventsList = eventsList.join('\n');
  } else {
    eventsList = "Aucune sortie de prévue pour le moment.";
  }

  const embed = createEmbed(eventsList, "Planning");
  const channel = client.channels.cache.get(channels.planning);

  if (created) {
    const msg = await channel.send({ embeds: [embed] });
    planning.update({ discordId: msg.id });
  } else {
    try {
      const msg = await channel.messages.fetch(planning.discordId);
      msg.edit({ embeds: [embed] });
    } catch(e) {
      if (e.httpStatus == '404') {
        const msg = await channel.send({ embeds: [embed] });
        planning.update({ discordId: msg.id });
      }
    }
  }
}
function confirm(msg, command) {
  return new Promise((resolve, reject) => {
    const embed = createEmbed("Êtes-vous sûr de vouloir faire ça ?\n\n**Commande utilisée :** " + command, ":warning: Attention !");
    msg.reply({ embeds: [embed] }).then(msg => {
      msg.react('<:yes:938458732591976549>').then(() => {
        msg.react('<:no:938458732294193163>');
      })
      const filter = (reaction, user) => ['yes', 'no'].includes(reaction.emoji.name) && !user.bot;
      const collector = msg.createReactionCollector({ filter, max: 1, time: 600000 });

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name == 'yes') {
          resolve(true);
        } else if (reaction.emoji.name == 'no') {
          resolve(false);
        }
      })

      collector.on('end', () => {
        msg.delete();
      })
    })
  });
}
async function checkEvents() {
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
}
function getRarity(num) {
  if (num < 1.5) {
    return 1; //Légendaire
  } else if (num >= 1.5 && num < 4) {
    return 2; //Epique
  } else if (num >= 4 && num < 8) {
    return 3; //Rare
  } else if (num >= 8 && num < 25) {
    return 4; //Inhabituelle
  } else {
    return 5; //Commune
  }
}
async function getMinion(channel, user) {
  const [discordUser] = await DiscordUser.findOrCreate({
    where: { discordId: user.id },
    defaults: { discordName: user.username }
  });

  if (!discordUser.timerMinion || !isFuture(discordUser.timerMinion)) {
    const random = Math.floor((Math.random() * 100) + 1);
    const rarity = getRarity(random);

    const [minion] = await Minion.findAll({
      where: { rarity: rarity },
      order: sequelize.random(),
      limit: 1
    });

    if (minion) {
      const searchLink = 'https://lalachievements.com/fr/minions/';
      const embed = createEmbed(`${user}, vous avez obtenu la mascotte **[${minion.name}](${searchLink}${minion.id})** !`, `${rarities[minion.rarity - 1].emoji} Mascotte ${rarities[minion.rarity - 1].name.toLowerCase()}`);
      embed.image = { url: minion.icon };
      embed.color = rarities[minion.rarity - 1].color;

      discordUser.update({ timerMinion: addHours(new Date(), 6) });
      const hasMinion = await discordUser.hasMinion(minion);

      if (hasMinion) {
        const userMinion = await DiscordUserMinion.findOne({
          where: { DiscordUserId: discordUser.id, MinionId: minion.id }
        });
        await userMinion.increment('count');
        await userMinion.reload();
        embed.footer = {
          text: `Vous en avez désormais ${userMinion.count}.`,
          icon_url: rarities[minion.rarity - 1].icon
        }
      } else {
        discordUser.addMinion(minion);
      }
      channel.send({ embeds: [embed] });
    } else {
      console.log("not found");
      getMinion(channel, user);
    }
  } else {
    const interval = intervalToDuration({
      start: new Date(),
      end: discordUser.timerMinion
    })
    const hours = formatDuration(interval, { format: ['hours'], locale: fr });
    const minutes = formatDuration(interval, { format: ['minutes'], locale: fr });
    const seconds = formatDuration(interval, { format: ['seconds'], locale: fr });

    let duration;

    duration = `${hours ? hours : ''}${hours && minutes && seconds ? ', ' : hours && (minutes || seconds) ? ' et ' : ''}${minutes ? minutes : ''}${minutes && seconds ? ' et ' + seconds : seconds ? seconds : ''}`;

    const embed = createEmbed(`${emojis.error} ${user}, vous devez attendre encore ${duration} avant de pouvoir réutiliser cette commande.`);
    channel.send({ embeds: [embed] });
  }
}
async function createInventory(channel, user) {
  const [discordUser] = await DiscordUser.findOrCreate({
    where: { discordId: user.id },
    defaults: { discordName: user.username }
  });

  const memberAvatar = (await channel.guild.members.fetch(user.id)).avatarURL({ dynamic: true });
  const nickname = (await channel.guild.members.fetch(user.id)).nickname;

  const author = {
    icon_url: memberAvatar ? memberAvatar : user.avatarURL({ dynamic: true }),
    name: `Inventaire de ${nickname ? nickname : user.username}`
  }

  const count = await discordUser.countMinions();

  const pages = {
    total: Math.ceil(count / 20),
    current: 1,
    count: count
  }

  const embed = await getInventory(discordUser, author, pages);
  const msg = await channel.send({ embeds: [embed] });

  if (pages.total > 1) {
    react(msg, '', emojis.inventory);

    const filter = (reaction, user) => {
      return emojis.inventory.includes(reaction.emoji.name) && !user.bot;
    };

    const collector = msg.createReactionCollector({ filter, time: 600000 });

    collector.on('collect', async (reaction, user) => {
      reaction.users.remove(user);
      if (reaction.emoji.name == '▶️') {
        pages.current++;
      } else if (reaction.emoji.name == '◀️') {
        pages.current--;
      }

      if (pages.current > pages.total) {
        pages.current = pages.total;
      } else if (pages.current < 1) {
        pages.current = 1;
      }
      const embed = await getInventory(discordUser, author, pages);
      msg.edit({ embeds: [embed] });
    });

    collector.on('end', () => {
      console.log('ended');
      msg.delete().catch(e => {
        if (e.httpStatus == 404) {
          console.log('message not found');
          console.error(e);
        }
      })
    })
  }
}
async function getInventory(discordUser, author, pages) {
  const offset = (pages.current * 20) - 20;

  const minions = await discordUser.getMinions({
    order: [ ['rarity'], ['name'] ],
    joinTableAttributes: ['count'],
    offset: offset,
    limit: 20
  });

  let inventory = [];

  for (let rarity of rarities) {
    let minionsList = [];
    for (let minion of minions) {
      if (rarity.name == rarities[minion.rarity - 1].name) {
        const count = minion.DiscordUserMinions.dataValues.count;
        const name = minion.name.charAt(0).toUpperCase() + minion.name.slice(1);
        minionsList.push(`- **${name}** (x${count})`);
      }
    }

    if (minionsList.length) {
      minionsList = minionsList.join('\n');
      const string = `${rarity.emoji} **Mascottes ${rarity.name.toLowerCase()}s**\n${minionsList}\n`;
      inventory.push(string);
    }
  }

  inventory = inventory.join('\n');

  const embed = createEmbed(inventory.length ? `<:minion:940963043712577587> **Total :** ${pages.count} mascottes\n\n${inventory}` : "L'inventaire est vide.");
  embed.author = author;
  embed.footer = {
    text: `Page ${pages.current}/${pages.total}`
  }

  return embed;
}
function isAdmin(user) {
  console.log('check if is admin');
  const permissions = user.permissions.serialize();
  return permissions.ADMINISTRATOR || user.roles.cache.has(discordRoles.officier);
}
async function updateMinions(channel) {
  const minionsList = [];
  const minions = await xivapi.data.list("Companion", { limit: 3000 });

  for (let minion of minions.Results) {
    if (minion.Icon && minion.Name) {
      minionsList.push({
        id: minion.ID,
        icon: "https://xivapi.com" + minion.Icon,
        name: minion.Name
      })
    }
  }

  await Minion.bulkCreate(minionsList, { ignoreDuplicates: true });
  axios.get('https://ffxivcollect.com/api/minions?language=fr').then(res => {
    const minionsRarity = res.data.results.map(item => {
      const rarity = getRarity(parseFloat(item.owned));
      return { id: item.id, rarity: rarity }
    })
    Minion.bulkCreate(minionsRarity, { ignoreDuplicates: true, updateOnDuplicate: ['rarity'] });

    if (channel) {
      const embed = createEmbed("Base de données des mascottes mise à jour !", emojis.update + " Mise à jour réussie");
      channel.send({ embeds: [embed] });
    }
  })
}
function getVote(discordEvent, user) {
  return new Promise((resolve, reject) => {
    const poll = discordEvent.subtitle.replace('!', '').split(',');
    const pollList = poll.map((item, index) => `\`${index + 1}\` ${item}`).join('\n');
    const embed = createEmbed(`Répondez avec le numéro du contenu de votre choix.\n\n${pollList}\n\nVous pouvez spécifier plusieurs numéros dans le même message, séparés par une virgule.\n\nExemple : \`1,2,3\``, emojis.edit + " Vote du contenu pour la sortie");
    user.send({ embeds: [embed] }).then(msg => {
      const filter = m => !m.author.bot;
      const collector = user.dmChannel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        const options = m.content.split(',');
        let votes = [];

        for (let option of options) {
          if (poll[option - 1]) {
            votes.push(poll[option - 1]);
          }
        }

        if (votes.length) {
          const embed = createEmbed(`Votre vote a bien été pris en compte !`, emojis.update + " Vote réussi");
          user.send({ embeds: [embed] });
          collector.stop();
          resolve(votes.join(','));
        } else {
          const embed = createEmbed("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise + '\n\n' + pollList, emojis.error + " Une erreur s'est produite");

          user.send({ embeds: [embed] });
          collector.resetTimer();
        }
      })
    })
  });
}
function error(target, string) {
  const embed = createEmbed(emojis.error + ' ' + string);
  target.send({ embeds: [embed] });
}
function update(target, string) {
  const embed = createEmbed(emojis.update + ' ' + string);
  target.send({ embeds: [embed] });
}

module.exports = { setCollector, react, getDiscordTime, getJob, getImage, handleReaction, handleEnd, createEmbed, createEventEmbed, handlePlanning, confirm, checkEvents, getRarity, getMinion, createInventory, getInventory, isAdmin, updateMinions, error, update }
