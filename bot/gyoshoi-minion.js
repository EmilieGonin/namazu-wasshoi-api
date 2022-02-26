const { DiscordUser, DiscordUserMinion, Minion, sequelize } = require("../models/index");

const { emojis, rarities } = require('./ressources');
const { createEmbed, react, error } = require('./functions');

const { formatDuration, intervalToDuration, isFuture, addHours } = require('date-fns');
const fr = require('date-fns/locale/fr');

const { xivapi } = require("../helpers/xivapi");
const axios = require("axios");

function getRarity(num) {
  if (num < 3.5) {
    return 1; //Légendaire
  } else if (num >= 3.5 && num < 5.5) {
    return 2; //Epique
  } else if (num >= 5.5 && num < 20) {
    return 3; //Rare
  } else if (num >= 20 && num < 35) {
    return 4; //Inhabituelle
  } else {
    return 5; //Commune
  }
}
function roll(num) {
  if (num < 0.6) {
    return 1; //Légendaire 0.5%
  } else if (num >= 0.6 && num < 2.6) {
    return 2; //Epique 2%
  } else if (num >= 2.6 && num < 7.6) {
    return 3; //Rare 5%
  } else if (num >= 7.6 && num < 22.6) {
    return 4; //Inhabituelle 15%
  } else {
    return 5; //Commune 77.5%
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

module.exports = minion = {
  minion: async (channel, user, test) => {
    const [discordUser] = await DiscordUser.findOrCreate({
      where: { discordId: user.id },
      defaults: { discordName: user.username }
    });

    // const testing = true;
    const testing = false;

    if (!discordUser.timerMinion || !isFuture(discordUser.timerMinion) || testing) {
      const random = (Math.random() * 100).toFixed(1);
      const rarity = roll(random);

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
        console.log("minion not found, trying again");
        minion(channel, user);
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

      error(channel, `${user}, vous devez attendre encore ${duration} avant de pouvoir réutiliser cette commande.`);
    }
  },
  mon: (channel, user) => {
    minion.minion(channel, user);
  },
  poke: (channel, user) => {
    minion.minion(channel, user);
  },
  update: async (channel) => {
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
  },
  list: async (channel, user) => {
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
        console.log('inventory collector ended');
        msg.delete().catch(e => {
          if (e.httpStatus == 404) {
            console.log('message not found');
            console.error(e);
          }
        })
      })
    } else {
      setTimeout(() => {
        msg.delete()
      }, 600000)
    }
  },
  inventory: (channel, user) => {
    minion.list(channel, user);
  },
  collection: (channel, user) => {
    minion.list(channel, user);
  }
}
