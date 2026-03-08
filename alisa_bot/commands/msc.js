const ytdl = require('ytdl-core'),
	key = "yandex_key";
let queue = {"playing": false, "songs": []},
	opts = {maxResults: 1, key: 'nokey'},
	dispatcher;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let commands = (voiceConnection, channel, result) => {
	(function play(song) {
		if (!song) return channel.send('Queue is empty').then(() => {queue.playing = false; voiceConnection.channel.leave();});
		let dispatcher_song = voiceConnection.playArbitraryInput(`https://tts.voicetech.yandex.net/generate?format=mp3&speaker=alyss&key=${key}&text=` + encodeURIComponent(`Сейчас играет ${song.title}, заказал ${song.requester} - - - - в`));
		sleep(5000);
		dispatcher_song.on('end', () => {
			volume_save = result[0].volume_save
			if (song.type == "youtube") {
				dispatcher = voiceConnection.playStream(ytdl(song.url, { audioonly: true }), {bitrate: 192000 /* 192kbps */}, { passes : 1 });
				dispatcher.setVolume(volume_save);
				dispatcher.on('end', () => {play(queue.songs.shift())});
				dispatcher.on('error', (err) => {return channel.send('error: ' + err).then(() => play(queue.songs.shift()))});
			} else if (song.type == "soundcloud") {
				dispatcher = voiceConnection.playArbitraryInput(song.url);
				dispatcher.setVolume(volume_save);
			  dispatcher.on('end', () => {play(queue.songs.shift())});
			}
		})
	})(queue.songs.shift());
}

exports.run = (client, msg, args, result) => {

	if (result[0].partner == 0) return

	if (!msg.member.voiceChannel) return msg.reply("Нужно быть в голосовом канале");

	switch (args[1]) {
		case "volume":
			volume_save = result[0].volume_save
			if (!args[2] || !parseInt(args[2])) return msg.reply("Громкость не указана. Сейчас стоит: "+ volume_save);
			if (0 >= args[2] || args[2] >= 100) return msg.reply("Громкость не может быть меньше 0 и больше 100");
			msg.guild.voiceConnection.dispatcher.setVolume(args[2]/100);
			//client.fs.writeFileSync("volume.txt", args[2]/100);
			client.con.query(`UPDATE server set volume_save= ${args[2]/100} WHERE id= ${msg.guild.id}`);
			msg.reply("Громкость изменена");
			break;
		case "leave":
			if (!msg.guild.voiceConnection) return msg.reply('Я не в голосовом канале.');
			let dispatcher_lv = msg.guild.voiceConnection.playArbitraryInput(`https://tts.voicetech.yandex.net/generate?format=mp3&speaker=alyss&key=${key}&text=` + encodeURIComponent("Всем пока. - - - - "));
			dispatcher_lv.on('end', () => msg.guild.voiceConnection.channel.leave());
			break;
		case "radio":
			let radios = require('/botest/radios.json'), temp = msg.content.slice(12);
			if (!temp) {msg.reply("Радиостанция не указана"); return msg.channel.send("Вот список радиостанций: \n" + Object.keys(radios));}
			let err = Object.keys(radios).indexOf(temp) == -1 ? true : false,
				tts;
			if (err) tts = "Ошибка. Такого радио нет в моей базе.";
			else tts = "Начинаю играть " + temp + " - - - - ";
			msg.member.voiceChannel.join().then(connection => {
			    let dispatcher = connection.playArbitraryInput(`https://tts.voicetech.yandex.net/generate?format=mp3&speaker=alyss&key=${key}&text=` + encodeURIComponent(tts));
			    dispatcher.on('end', () => {if (err) {connection.channel.leave(); msg.channel.send("Вот список радиостанций: \n" + Object.keys(radios));} else {dispatcher = connection.playArbitraryInput(radios[temp]); dispatcher.setVolume(0.3);}});
			});
			break;
		case "tts":
			if (msg.content.slice(10) == "") return msg.reply("Мне нечего говорить");
			msg.member.voiceChannel.join().then(connection => {
			    let dispatcher = connection.playArbitraryInput(`https://tts.voicetech.yandex.net/generate?format=mp3&speaker=alyss&key=${key}&text=` + encodeURIComponent(msg.content.slice(10) + ' - - - - '));
			    //dispatcher.on('end', () => {connection.channel.leave();});
			});
			break;
		case "queue":
			if (!queue) return msg.channel.send(`Очередь сейчас пуста! Добавьте в неё что-нибудь используя **a!msc play** *[URL/НАЗВАНИЕ ВИДЕО]*.`);
			const embed = new client.discord.RichEmbed()
			  .setTitle(`В настоящее время в очереди **${queue.songs.length}** песня`)
			  .setAuthor(`__**Очередь:**__`)
			  .setColor('#FFFFFF')
			  .setFooter(msg.author.tag)
			  .setTimestamp();
			queue.songs.forEach((song, i) => { embed.addField(`${i+1}. ${song.title}`, `${song.requester}`);});
			msg.channel.send({embed});
			break;
		case "play":
			let url = msg.content.slice(11);
			if (!url) return msg.reply("Не указана ссылка или название");
			//if (/^http(s|):\/\/youtu(\.be\/|be\.).*$/.test(url)) return msg.reply("Из-за проблем с Google API принимаются только ссылки!");
			if (msg.content.includes('youtube.com/')) {
				ytdl.getInfo(url, (err, info) => {
					if(err) return msg.channel.send('Что-то пошло не так: ' + err);
					queue.songs.push({url: url, title: info.title, requester: msg.author.username, type: "youtube"});
					msg.channel.send(`Добавлена музыка: **${info.title}** в очередь`);
					if (queue.playing) return;
					queue.playing = true;
					msg.member.voiceChannel.join().then((connection) => commands(connection, msg.channel, result));
				});
			} else if (msg.content.includes('soundcloud.com/')) {
				client.req({url: `http://api.soundcloud.com/resolve.json?url=${url}&client_id=${client.soundcloud}`, json: true}, (error, response, body) => {
						if (error || response.statusCode != 200) return msg.channel.send("Ошибка!");
						if (body.id == null) return msg.channel.send("Ошибка!");
						if (body.kind == null) return msg.channel.send("Ошибка!");
						queue.songs.push({url: `https://api.soundcloud.com/tracks/${body.id}/stream?client_id=${client.soundcloud}`, title: body.title, requester: msg.author.username, type: "soundcloud"});
						msg.channel.send(`Добавлена музыка: **${body.title}** в очередь`);
						if (queue.playing) return;
						queue.playing = true;
						msg.member.voiceChannel.join().then((connection) => commands(connection, msg.channel, result));
				})
			} else {
				msg.channel.send("Ошибка! Я работаю только с Youtube, и SoundCloud")
			}
			break;
		case 'pause':
			if (!queue.playing) return msg.reply("Ничего не играет");
			msg.channel.send('paused').then(dispatcher.pause());
			break;
		case 'resume':
			if (!queue.playing) return msg.reply("Ничего не играет");
			msg.channel.send('resumed').then(dispatcher.resume());
			break;
		case 'skip':
			if (!queue.playing) return msg.reply("Ничего не играет");
			msg.channel.send('skipped').then(dispatcher.end());
			break;
		case 'time':
			if (!queue.playing) return msg.reply("Ничего не играет");
			msg.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
			break;
	}
};
