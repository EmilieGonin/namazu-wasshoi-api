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
function getJob(userId, role) {
  //
}

module.exports = { getDiscordUser, userFound, react, getJob }
