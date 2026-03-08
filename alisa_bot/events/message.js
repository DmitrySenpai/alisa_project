module.exports = (client, msg) => {

	if (msg.author.bot) return;

	//Команды
	//console.log(msg)

	client.con.query(`SELECT * FROM server WHERE id=${msg.guild.id}`, async function (err, result) {
		if (err) throw err;

		if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${msg.guild.id}')`);

		var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
		if(user_bd.res.length == 0) client.con.query(`INSERT INTO account_server (user_id, server_id) VALUES ('${msg.author.id}', '${msg.guild.id}')`);

		//const test123 = JSON.parse(result[0].auto_role)
		//console.log(test123.role1)

		//Функции

		//Модерация
		
		//анти-инвайт ссылки
		if (result[0][`moderation_antiInvite`] == 1) {
			if (!msg.member.hasPermission('ADMINISTRATOR')) {
				if (msg.content.includes('discord.gg/'||'discordapp.com/invite/')) {
					msg.delete()
					if(result[0][`moderation_warn`] == 1) {
						user_bd_warn = user_bd.res[0].warn + 1
						text_antiInvite = "<@" + msg.author.id + "> , вы нарушаете правила сервера! Пожалуйста не рекламируйте сервер! Вы так же получайте автоматом варн!"
						if (user_bd.res[0].warn+1 > result[0].moderation_maxwarn_ban_count && result[0].moderation_maxwarn_ban_count !== 0) {
							user_bd_warn = 0;
							msg.member.ban("Привышен максимально Варнов!"); 
						}
						client.con.query(`UPDATE account_server set warn= ${user_bd_warn} WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
						if (user_bd_warn == 0) return
					} else {
						text_antiInvite = "<@" + msg.author.id + "> , вы нарушаете правила сервера! Пожалуйста не рекламируйте сервер!"
					}
					msg.channel.send(text_antiInvite).then(msg => {msg.delete(30000)})

					//log
					if (JSON.parse(result[0].log) !== null) {
						if (JSON.parse(result[0].log)[0].log_user_spam_inv == 1 && JSON.parse(result[0].log)[0].channel !== 0) {
							if (result[0][`moderation_warn`] == 1) text_warn_plus = ', а так же получил ВАРН'; else text_warn_plus = ''
							const embed_log = new client.discord.RichEmbed()
								.setColor('#0099ff')
								.setTitle('ВНИМАНИЕ!')
								.setDescription(`<@${msg.author.id}>, этот пользователь рекламирует ${text_warn_plus}!\nТекст:\`\`\`-\n${msg.content}\n-\`\`\``)

							channel_log = client.channels.get(JSON.parse(result[0].log)[0].channel)
							if (channel_log) channel_log.send(embed_log)
						}
					}
					//end
				}
			}
		}
		//END анти-инвайт ссылки
		if (user_bd.res[0].warn > result[0].moderation_maxwarn_ban_count && result[0].moderation_maxwarn_ban_count !== 0 && !msg.member.hasPermission('ADMINISTRATOR') && user_bd.res.length !== 0) {
			return msg.member.ban("Привышен максимально Варнов!"); 
		}

		//end Модерация

		//Авто-роль
		if (result[0][`auto_role`]) {
			JSON.parse(result[0][`auto_role`]).forEach(role => {
				if(msg.guild.roles.find(c => c.id == role) && !msg.member.roles.has(role)) {
					msg.member.addRole(msg.member.guild.roles.get(role));
				}
			});
		}
		//end Авто-роль

		//Лвл система
		if (result[0][`lvl_system`] !== '0') {
			point_plus = parseInt(user_bd.res[0][`point`])+1;
			lvl_user = parseInt(user_bd.res[0][`lvl`])

			tt = lvl_user
			if (tt == 0) tt = 1;

			if (point_plus > tt * 30) {
				point_plus = 0
				lvl_user = lvl_user + 1
				if (result[0][`lvl_system_info`] !== 'null') {
					if (result[0][`lvl_system_info`] !== 0){

						if (result[0][`lvl_system_info`] == 1) {
							lvl_system_alert = msg.channel.id
						} else {
							lvl_system_alert = result[0][`lvl_system_info`]
						}

						channel_lvl_alert = client.channels.get(lvl_system_alert)


						 //Дата
						 var date_2 = new Date(msg.member.joinedTimestamp).toString();
						 var month_2 = date_2.slice(4, 7);
						 if (month_2 == 'Jan') month_2 = 'Января';
						 if (month_2 == 'Feb') month_2 = 'Февраля';
						 if (month_2 == 'Mar') month_2 = 'Марта';
						 if (month_2 == 'Apr') month_2 = 'Апреля';
						 if (month_2 == 'May') month_2 = 'Мая';
						 if (month_2 == 'Jun') month_2 = 'Июня';
						 if (month_2 == 'Jul') month_2 = 'Июля';
						 if (month_2 == 'Aug') month_2 = 'Августа';
						 if (month_2 == 'Sep') month_2 = 'Сентября';
						 if (month_2 == 'Oct') month_2 = 'Октября';
						 if (month_2 == 'Nov') month_2 = 'Ноября';
						 if (month_2 == 'Dec') month_2 = 'Декабря';
						 data_join_2 = date_2.slice(8, 10) + ' ' + month_2 + ' ' + date_2.slice(11,15) + 'г. в ' + date_2.slice(16,24)
						 //=============

						let embed_lvl = new client.discord.RichEmbed()
			  				.setTitle("Lvl up!")
			  				.setDescription(`Поздравляем, <@${msg.author.id}>, Вы достигли **уровень ${lvl_user}**!`)
			  				.setColor('#4bdb28')
			  				.setThumbnail(msg.author.avatarURL)
			  				.setImage("https://sovietsoft.ru/alisabot/images/lvlup.jpg")
              				.setAuthor('SovietSoft', "https://sovietsoft.ru/wp-content/uploads/2018/06/cropped-icon.png")
              				.setFooter(`На сервере с: ${data_join_2}`);

						if (channel_lvl_alert) channel_lvl_alert.send(embed_lvl).then(msg => {
							if(result[0][`lvl_system_msg_del`] !== 0) msg.delete(result[0][`lvl_system_msg_del`] * 1000)
						})
						
					}
				}
			}
			await client.promise(client.con, client.con.query, `UPDATE account_server set point = ${point_plus}, lvl = ${lvl_user} WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);

		}
		//END - Лвл система

		//End функции

		if (!msg.content.toLowerCase().startsWith('b!')) return;
		const args = msg.content.toLowerCase().slice(2).trim().split(/ +/g);
		//Проверка включение команды
		const cmd = client.commands.get(args[0]);

		if (!cmd) return;

		//test
		if (args[0] == 'info') { 
			var author_user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
			//var authir_user_bd_rank = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id} AND lvl= ${author_user_bd.res[0].lvl} AND point= ${author_user_bd.res[0].point}`);
			let rank = await client.promise(client.con, client.con.query, 'SET @row_number = 0');
			rank = await client.promise(client.con, client.con.queryCol, `SELECT num FROM (SELECT (@row_number:=@row_number + 1) AS num, user_id FROM account_server WHERE server_id= ${msg.guild.id} ORDER BY point DESC, lvl ASC) AS temp WHERE user_id= ${msg.author.id}`);
			author_user_bd.res[0].rank = rank.res[0]
			cmd.run(client, msg, args, result, author_user_bd.res[0]); 
		}

		if (args[0] == 'recorder') { 
			var author_user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
			cmd.run(client, msg, args, result, author_user_bd.res[0]); 
		}
		//end test

		if (JSON.parse(result[0].commands) == 'null') return

		if (JSON.parse(result[0].commands).indexOf(args[0]) == -1) return;
		  
		//if (result[0][`cmd_${args[0]}`] == 0) return;

		var author_user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);

  		cmd.run(client, msg, args, result, author_user_bd.res[0]);


	});

};
