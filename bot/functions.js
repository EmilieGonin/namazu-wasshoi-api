const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");
const { emojis } = require('./ressources');

async function react(msg, reactions) {
  for (let reaction of reactions) {
    await msg.react(reaction);
  }
}
function getJob(user, emoji) {
  return new Promise((resolve, reject) => {
    user.send("Test").then(msg => {
      const filter = m => !m.author.bot;
      const collector = user.dmChannel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', m => {
        if (emojis[emoji][m.content - 1]) {
          collector.stop();
          resolve(emojis[emoji][m.content - 1]);
        } else {
          user.send("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise);
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
    where: { discordId: user.id }
  });

  const [discordEventReaction] = await DiscordEventReaction.findOrCreate({
    where: {
      DiscordUserId: discordUser.id,
      DiscordEventId: discordEvent.id
    }
  });

  if (stateEmoji && !discordEventReaction.role) {
    console.log('no role');
    user.send("Vous devez d'abord choisir un rôle.")
    return;
  }

  if (stateEmoji) {
    console.log("-state-");
    if (discordEventReaction.state) {
      console.log('already state, removing old one');
      await discordEvent.decrement('state_' + discordEventReaction.state);
    } else {
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

      user.send(`Compris, wasshoi ! Désormais, votre rôle de ${emojiCode} sera automatiquement lié au job ${job}.`)

      discordUser[emoji + 'Job'] = job;
    }
  }

  await discordEvent.reload();
  await discordUser.save();
  await discordEventReaction.save();
}

module.exports = { react, getJob, handleReaction }
