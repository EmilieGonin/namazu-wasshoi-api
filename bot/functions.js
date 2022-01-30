const { Op } = require("sequelize");
const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");
const { emojis, roles, states } = require('./ressources');
const { differenceInMilliseconds } = require('date-fns');

async function react(msg, reactions) {
  for (let reaction of reactions) {
    await msg.react(reaction);
  }
}
function getDiscordTime(date) {
  const time = differenceInMilliseconds(date, new Date());
  if (time < 43200000) {
    return time;
  } else {
    return 43200000;
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
    discordUser.notifications = !discordUser.notifications;
    let embed = ''

    if (discordUser.notifications) {
      embed = createEmbed("Les notifications de rappel pour les sorties sont désormais **__activées__**, wasshoi !", emojis.rappel + " Notifications");
    } else {
      embed = createEmbed("Les notifications de rappel pour les sorties sont désormais **__désactivées__**, wasshoi !", emojis.rappel + " Notifications");
    }

    user.send({ embeds: [embed] })
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
function createEmbed(description, title) {
  const embed = {
    color: "#e62e39",
    title: title ? title : '',
    description: description
  }

  return embed;
}

module.exports = { react, getDiscordTime, getJob, handleReaction, handleEnd, createEmbed }
