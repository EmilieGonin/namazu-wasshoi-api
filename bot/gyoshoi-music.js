const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');
const { client } = require('./config');
const ytdl = require('ytdl-core');
const player = createAudioPlayer();

const { emojis, channels } = require('./ressources');
const { createEmbed, error } = require('./functions');

function playSong(song) {
  console.log('playing next');
  const stream = ytdl(song, { filter: 'audioonly' });
  const next = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(next);

  ytdl.getBasicInfo(song).then(datas => {
    const channel = client.channels.cache.get(channels.musique);
    const embed = createEmbed(`En train d'écouter **[${datas.videoDetails.title}](${datas.videoDetails.video_url})**.`);
    channel.send({ embeds: [embed] })
  })
}

module.exports = music = {
  play: (guild, msg, song) => {
    if (!song) {
      error(msg.channel, 'Vous devez préciser un lien YouTube.\n\nExemple: `!shoi play https://www.youtube.com/watch...`');
    } else if (!ytdl.validateURL(song)) {
      error(msg.channel, 'Le lien YouTube est incorrect.');
    } else {
      const connection = getVoiceConnection(guild.discordId);
      if (guild.playing && connection) {
        console.log('song added to queue');
        const queue = [...guild.queue, song];
        guild.update({ queue });
        ytdl.getBasicInfo(song).then(datas => {
          const channel = client.channels.cache.get(channels.musique);
          const embed = createEmbed(`La vidéo **[${datas.videoDetails.title}](${datas.videoDetails.video_url})** a été ajoutée à la liste de lecture.`);
          channel.send({ embeds: [embed] })
        })
      } else {
        const connection = joinVoiceChannel({
          channelId: msg.member.voice.channelId,
          guildId: msg.guildId,
          adapterCreator: msg.guild.voiceAdapterCreator,
        });
        connection.subscribe(player);
        const queue = guild.queue ? [...guild.queue, song] : [ song ];
        guild.update({ playing: true, queue }).then(() => {
          console.log(guild.queue);
          playSong(queue[0]);
        })
      }

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('idle');
        const connection = getVoiceConnection(guild.discordId);
        if (connection) {
          guild.reload().then(() => {
            const queue = guild.queue ? [...guild.queue] : [];
            queue.shift();

            if (queue.length) {
              guild.update({ queue }).then(() => {
                playSong(queue[0]);
              })
            } else {
              console.log('stop');
              guild.queue = null;
              guild.playing = false;
              guild.save().then(() => {
                const connection = getVoiceConnection(guild.discordId);
                if (connection) {
                  connection.destroy();
                }
              })
            }
          })
        } else {
          console.log('no connection, stopping');
          guild.queue = null;
          guild.playing = false;
          guild.save();
        }
      });
      player.on('error', e => {
				const channel = client.channels.cache.get(channels.musique);
        error(channel, "La vidéo en cours a été stoppée suite à une erreur de lecture.");
        console.error(e)
      });
    }
  },
  pause: () => {
    player.pause()
  },
  resume: () => {
    player.unpause();
  },
  unpause: () => {
    player.unpause();
  },
  stop: (guild) => {
    guild.queue = null;
    guild.save().then(() => {
      player.stop();
    })
  },
  skip: (guild) => {
    const queue = guild.queue ? [...guild.queue] : [];
    queue.shift();

    if (queue.length) {
      guild.update({ queue }).then(() => {
        playSong(queue[0]);
      })
    } else {
      player.stop();
    }
  },
  playlist: async (guild) => {
    if (guild.queue) {
      const songs = [];
      const queue = [...guild.queue];
      queue.shift();
      let current = guild.queue.slice(0, 1);
      const datas = await ytdl.getBasicInfo(current);
      current = `En train d'écouter **[${datas.videoDetails.title}](${datas.videoDetails.video_url})**.`;

      for (let song of queue) {
        const datas = await ytdl.getBasicInfo(song).then(datas => {
          songs.push(`:small_blue_diamond:[${datas.videoDetails.title}](${datas.videoDetails.video_url})`);
        })
      }

      const channel = client.channels.cache.get(channels.musique);
      const embed = createEmbed(`${current}\n\n${queue.length ? songs.join('\n') : 'Aucune autre piste dans la liste de lecture.'}`, emojis.shoi.sing + ' Liste de lecture');
      channel.send({ embeds: [embed] })
    } else {
			const channel = client.channels.cache.get(channels.musique);
      error(channel, "Aucune liste de lecture.");
    }
  }
}
