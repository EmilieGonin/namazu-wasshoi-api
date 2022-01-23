const { DiscordEvent, DiscordUser, DiscordEventReaction } = require("../models/index");
const { emojis } = require('./ressources');

async function getDiscordUser(userId, eventId) {
  return await DiscordUser.findOne({
    where: {
      discordId: userId
    },
    // include: {
    //   model: DiscordEventReaction,
    //   include: [{
    //     model: DiscordEvent,
    //     where: {
    //       id: eventId
    //     },
    //     required: false
    //   }]
    // }
  });
}
async function userFound(user, eventId) {
  const query = await user.getDiscordEventReactions({
    where: { DiscordEventId: eventId }
  });
  return query.length;
}
async function react(msg, reactions) {
  for (let reaction of reactions) {
    await msg.react(reaction);
  }
}
function getJob(user, emoji, emojiCode, discordEvent) {
  const datas = {
    role: emoji,
    DiscordUser: {
      discordId: user.id,
    }
  }

  user.send("Test").then(msg => {
    const filter = m => !m.author.bot;
    const collector = user.dmChannel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', m => {
      if (emojis[emoji][m.content - 1]) {
        user.send(`Compris, wasshoi ! Désormais, votre rôle de ${emojiCode} sera automatiquement lié au job ${emojis[emoji][m.content - 1]}.`)

        datas.DiscordUser[emoji + 'Job'] = emojis[emoji][m.content - 1];

        discordEvent.createDiscordEventReaction(datas, {
          include: [ DiscordUser ]
        });
      } else {
        user.send("Je n'ai pas compris votre réponse ! " + emojis.shoi.surprise);
        getJob(user, emoji, emojiCode, discordEvent);
      }
    })
  })
}

module.exports = { getDiscordUser, userFound, react, getJob }
