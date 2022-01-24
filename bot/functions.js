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
      const collector = user.dmChannel.createMessageCollector({ filter, time: 15000 });

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
  } else if (discordEventReaction.state) {
    discordEvent['state_' + discordEventReaction.state]--;
    discordEventReaction.state = '';
  }

  if (stateEmoji) {
    discordEventReaction.state = emoji;
    discordEvent['roles_' + discordEventReaction.role]--;
    discordEvent['state_' + emoji]++;
  } else if (roleEmoji) {
    if (discordEventReaction.role) {
      discordEvent['roles_' + discordEventReaction.role]--;
    }
    discordEventReaction.role = emoji;
    discordEvent['roles_' + emoji]++;
    if (!discordUser[emoji + 'Job']) {
      console.log('checking job');
      const job = await getJob(user, emoji);
      console.log('job checked');

      user.send(`Compris, wasshoi ! Désormais, votre rôle de ${emojiCode} sera automatiquement lié au job ${job}.`)

      discordUser[emoji + 'Job'] = job;
    }
  }

  await discordUser.save();
  await discordEvent.save();
  await discordEventReaction.save();
}

module.exports = { react, getJob, handleReaction }
