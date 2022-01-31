const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction, DiscordMessage } = require("../models/index");
const { emojis, roles, states, channels } = require('./ressources');
const { differenceInMilliseconds, formatDistanceToNowStrict, subHours, isBefore, isEqual, format } = require('date-fns');
const fr = require('date-fns/locale/fr');
const { client } = require('./config');

async function react(msg, reactions) {
  for (let reaction of reactions) {
    await msg.react(reaction);
  }
}
function getDiscordTime(date, discordEvent) {
  const time = differenceInMilliseconds(date, new Date());
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

      collector.on('end', () => {
        console.log('collector ended');
      })
    })
  })
}
async function handleReaction(reaction, user, discordEvent) {
  console.log("function started");
  const emoji = reaction.emoji.name.toLowerCase();
  console.log("emoji used : " + emoji);
  const emojiCode = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
  const roleEmoji = discordEvent.dataValues.hasOwnProperty('roles_' + emoji);
  const stateEmoji = discordEvent.dataValues.hasOwnProperty('state_' + emoji);

  const [discordUser] = await DiscordUser.findOrCreate({
    where: { discordId: user.id, discordName: user.username }
  });

  const [discordEventReaction] = await DiscordEventReaction.findOrCreate({
    where: {
      DiscordUserId: discordUser.id,
      DiscordEventId: discordEvent.id
    }
  });

  if (((stateEmoji && emoji != 'pas_dispo') || emoji == 'changer_job') && !discordEventReaction.role) {
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
    } else if (!discordEventReaction.state && discordEventReaction.role && (discordEventReaction.role != emoji)) {
      console.log('no state but already role, removing old one');
      console.log(discordEventReaction.role);
      await discordEvent.decrement('roles_' + discordEventReaction.role);
    }
    discordEventReaction.role = emoji;
    await discordEvent.reload();
    await discordEvent.increment('roles_' + emoji);

    if (!discordUser[emoji + 'Job']) {
      console.log('checking job');
      const job = await getJob(user, emoji);
      console.log('job checked');
      const embed = createEmbed(`Désormais, votre rôle de ${emojiCode} sera automatiquement lié au job ${job}.`, emojis.update + " Mise à jour du job");

      user.send({ embeds: [embed] });
      discordUser[emoji + 'Job'] = job;
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
      const users = (await DiscordUser.findAll({
        include: {
          model: DiscordEventReaction,
          where: {
            DiscordEventId: discordEvent.id,
            role: role,
            state: { [Op.is]: null }
          }
        }
      })).map(item => item[role + 'Job'] + ' ' + item.discordName).join('\n');

      let newField = {
        name: '** **',
        inline: true,
        value: `${roles[role].emoji} **${roles[role].name}** (${discordEvent[item]})\n${users}`
      };

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
        if (item.DiscordEventReactions[0].role) {
          return item[item.DiscordEventReactions[0].role + 'Job'] + ' ' + item.discordName
        } else {
          return item.discordName
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

  return newFields;
}
async function handleEnd(discordEvent) {
  //Logs

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

  for (let date of dates) {
    const events = (await DiscordEvent.findAll({
      where: { formattedDate: date },
      order: ['hour']
    })).map(item => `\`${item.hour}\` ${item.title}`).join('\n');
    const string = `\n:calendar: **${date}**\n${events}`
    eventsList.push(string);
  }

  eventsList = eventsList.join('\n');
  const embed = createEmbed(eventsList, "Planning");
  const channel = client.channels.cache.get(channels.planning);

  if (created) {
    const msg = await channel.send({ embeds: [embed] });
    planning.update({ discordId: msg.id });
  } else {
    const msg = await channel.messages.fetch(planning.discordId);
    msg.edit({ embeds: [embed] });
  }
}

module.exports = { react, getDiscordTime, getJob, handleReaction, handleEnd, createEmbed, handlePlanning }
