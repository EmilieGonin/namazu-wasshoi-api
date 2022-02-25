const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
  getVoiceConnection,
	VoiceConnectionStatus,
	generateDependencyReport
} = require('@discordjs/voice');
const { client } = require('./config');
const ytdl = require('ytdl-core');
const player = createAudioPlayer();

const { emojis, channels } = require('./ressources');
const { createEmbed, error, update } = require('./functions');

console.log(generateDependencyReport());

function playSong(guild) {
	const song = guild.queue[0];
  console.log('playing next');
  const stream = ytdl(song, {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25
	});
  const next = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(next);

  ytdl.getBasicInfo(song).then(datas => {
    const channel = client.channels.cache.get(channels.musique);
    const embed = createEmbed(`${emojis.shoi.sing} En train d'écouter **[${datas.videoDetails.title}](${datas.videoDetails.video_url})**.`);
    channel.send({ embeds: [embed] })
		client.user.setActivity(datas.videoDetails.title, { type: 'LISTENING', url: datas.videoDetails.video_url });
  })
}
function connect(msg, guild) {
	console.log('joining voice channel');
	const connection = joinVoiceChannel({
		channelId: msg.member.voice.channelId,
		guildId: msg.guildId,
		adapterCreator: msg.guild.voiceAdapterCreator
	});
	connection.subscribe(player);

	player.on(AudioPlayerStatus.Idle, () => {
		console.log('idle');
		guild.reload().then(() => {
			const queue = guild.queue ? [...guild.queue] : [];
			queue.shift();

			if (queue.length) {
				guild.update({ queue }).then(() => {
					playSong(guild);
				})
			} else {
				console.log('stop');
				disconnect(guild);
			}
		})
	});
	player.on('error', e => {
		const channel = client.channels.cache.get(channels.musique);
		error(channel, "La vidéo en cours a été stoppée suite à une erreur de lecture. Veuillez réessayer.");
		console.error(e)
		console.log(player.state.resource.playbackDuration);
	});

	connection.on(VoiceConnectionStatus.Disconnected, () => {
		console.log('voice connection disconnected');
		if (guild.queue) {
			joinVoiceChannel({
				channelId: msg.member.voice.channelId,
				guildId: msg.guildId,
				adapterCreator: msg.guild.voiceAdapterCreator
			});
		}
	})

	return connection;
}
function disconnect(guild) {
	client.user.setActivity('');
	const connection = getVoiceConnection(guild.discordId);
	guild.queue = null;
	guild.save().then(() => {
		player.removeAllListeners();
		connection.destroy();
	})
	.catch(e => console.error(e));
}

module.exports = music = {
  play: (guild, msg, song) => {
    if (!song && !guild.queue) {
      error(msg.channel, 'La liste de lecture est vide.\n\nVous devez ajouter une vidéo en précisant un lien YouTube.\n\nExemple: `!shoi play https://www.youtube.com/watch...`');
    } else if (song && !ytdl.validateURL(song)) {
      error(msg.channel, 'Le lien YouTube est incorrect.');
    } else {
			const connected = msg.member.voice.channel.members.has(client.user.id);
			let connection = getVoiceConnection(guild.discordId);
			console.log(`connected: ${connected}\nconnection: ${connection ? true : false}`);

			if (!connected || !connection) {
				console.log('connection not found');
				connection = connect(msg, guild);

				if (song) {
					console.log('creating new queue with song');
					guild.update({ queue: [song] }).then(() => {
	          console.log(guild.queue);
	          playSong(guild);
	        })
				} else {
					console.log('resume guild queue');
					console.log(guild.queue);
					playSong(guild);
				}
			} else if (song && guild.queue) {
				console.log('song added to queue');
				const queue = [...guild.queue, song];
				guild.update({ queue }).then(() => {
					console.log(guild.queue);
				});
				ytdl.getBasicInfo(song).then(datas => {
					const channel = client.channels.cache.get(channels.musique);
					const embed = createEmbed(`La vidéo **[${datas.videoDetails.title}](${datas.videoDetails.video_url})** a été ajoutée à la liste de lecture.`);
					channel.send({ embeds: [embed] })
				})
			} else if (!song && guild.queue && player.state.status != 'playing') {
				console.log(`player is ${player.state.status}`);
				if (player.state.status == 'paused') {
					player.unpause();
					const channel = client.channels.cache.get(channels.musique);
					const embed = createEmbed("La lecture a repris.");
					channel.send({ embeds: [embed] })
				} else {
					playSong(guild);
				}
			} else {
				console.log('music already playing');
				error(msg.channel, 'La lecture est déjà en cours.\n\nVous pouvez ajouter une vidéo à la liste de lecture en précisant un lien YouTube.\n\nExemple: `!shoi play https://www.youtube.com/watch...`');
			}
		}
  },
  pause: () => {
    player.pause();
		const channel = client.channels.cache.get(channels.musique);
		const embed = createEmbed("La lecture a été mise en pause.");
		channel.send({ embeds: [embed] })
  },
  resume: () => {
    player.unpause();
		const channel = client.channels.cache.get(channels.musique);
		const embed = createEmbed("La lecture a repris.");
		channel.send({ embeds: [embed] })
  },
  unpause: () => {
    player.unpause();
		const channel = client.channels.cache.get(channels.musique);
		const embed = createEmbed("La lecture a repris.");
		channel.send({ embeds: [embed] })
  },
  stop: (guild) => {
		console.log(player.state.status);
		if (player.state.status == 'playing') {
			guild.queue = null;
	    guild.save().then(() => {
	      player.stop();
	    })
		} else {
			const channel = client.channels.cache.get(channels.musique);
      error(channel, "Aucune piste n'est est en cours de lecture.");
		}
  },
	clear: (guild) => {
		if (!guild.queue) {
			const channel = client.channels.cache.get(channels.musique);
      error(channel, "La liste de lecture est déjà vide.");
		} else {
			guild.queue = [guild.queue[0]];
			guild.save().then(() => {
				const channel = client.channels.cache.get(channels.musique);
				update(channel, "La liste de lecture a été vidée à l'exception de la piste en cours.");
			})
		}
	},
  skip: (guild) => {
		if (guild.queue) {
			const queue = [...guild.queue];
	    queue.shift();

			const channel = client.channels.cache.get(channels.musique);

	    if (queue.length) {
	      guild.update({ queue }).then(() => {
					console.log(guild.queue);
	        playSong(guild);
	      })
				update(channel, "La chanson actuelle a été skip.");
	    } else {
				update(channel, "La chanson actuelle a été skip. La liste de lecture est désormais vide.");
	      player.stop();
	    }
		} else {
			const channel = client.channels.cache.get(channels.musique);
			error(channel, "Aucune chanson n'est présente dans la liste de lecture.")
		}
  },
  playlist: async (guild) => {
    if (guild.queue) {
      const songs = [];
      const queue = [...guild.queue];

      for (let song of queue) {
        const datas = await ytdl.getBasicInfo(song).then(datas => {
          songs.push(`:small_blue_diamond:[${datas.videoDetails.title}](${datas.videoDetails.video_url})`);
        })
      }

      const channel = client.channels.cache.get(channels.musique);
      const embed = createEmbed(songs.join('\n'), emojis.shoi.sing + ' Liste de lecture');
      channel.send({ embeds: [embed] })
    } else {
			const channel = client.channels.cache.get(channels.musique);
      error(channel, "Aucune piste n'est présente dans la liste de lecture.");
    }
  }
}
