exports.run = async (client, msg, args, result) => {

  if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("Недостаточно прав!").then(msg => msg.delete(2000));

  switch (args[1]) {
    case "send":
      var warn_to_user = msg.mentions.users.first();
      if(!warn_to_user) return msg.reply("Кому отправить?");
      if(warn_to_user.bot) return msg.reply("Это бот!");
      let mention_text = "";
      for (var i = 3; i < args.length; i++) {
          if (mention_text == "") mention_text = `${args[i]}`;
          else mention_text += ` ${args[i]} `;
      }
      var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${warn_to_user.id} AND server_id= ${msg.guild.id}`);
      if(user_bd.res.length == 0) {
        client.con.query(`INSERT INTO account_server (user_id, server_id, warn) VALUES ('${warn_to_user.id}', '${msg.guild.id}', 1)`);
        var warn = 1
      } else {
        var warn = user_bd.res[0].warn + 1
        client.con.query(`UPDATE account_server set warn= ${warn} WHERE user_id= ${warn_to_user.id} AND server_id= ${msg.guild.id}`);
      }
      var embed = {
        "title": "Вы получили предупреждения!",
        "color": 5715438,
        "timestamp": "2019-05-12T11:40:26.069Z",
        "fields": [
          {
            "name": "От кого:",
            "value": `${msg.author}`
          },
          {
            "name": "Причина:",
            "value": mention_text
          },
          {
            "name": "Количество предупреждения:",
            "value": `${warn}`
          }
        ]
      };
      client.users.get(warn_to_user.id).send({ embed });
      msg.channel.send(`Варн был отправлен: ${warn_to_user.tag}`)
      //log
			if (JSON.parse(result[0].log) !== null) {
				if (JSON.parse(result[0].log)[0].log_warns == 1 && JSON.parse(result[0].log)[0].channel !== 0) {
					const embed_log = new client.discord.RichEmbed()
						.setColor('#0099ff')
						.setTitle('Отправлен варн!')
            .setDescription(`<@${msg.author.id}>, этот пользователь отправил ВАРН <@${warn_to_user.id}>`)
            .addField('Причина:', `${mention_text}`, true)
          channel_log = client.channels.get(JSON.parse(result[0].log)[0].channel)
          if (channel_log) channel_log.send(embed_log)
				}
			}
			//end
      break;
    case "clear":
      var warn_to_user = msg.mentions.users.first();
      if(!warn_to_user) return msg.reply("Кому сбросить варн?");
      if(warn_to_user.bot) return msg.reply("Это бот!");
      var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${warn_to_user.id} AND server_id= ${msg.guild.id}`);
      if(user_bd.res.length == 0) {
        client.con.query(`INSERT INTO account_server (user_id, server_id) VALUES ('${warn_to_user.id}', '${msg.guild.id}')`);
      } else {
        var warn = 0
        client.con.query(`UPDATE account_server set warn= ${warn} WHERE user_id= ${warn_to_user.id} AND server_id= ${msg.guild.id}`);
      }
      msg.channel.send(`ВАРНЫ у ${warn_to_user.tag} были сброшены до 0`)
      break;
    case "check":
      var warn_to_user = msg.mentions.users.first();
      if(!warn_to_user) return msg.reply("Кого проверить?");
      if(warn_to_user.bot) return msg.reply("Это бот!");
      var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${warn_to_user.id} AND server_id= ${msg.guild.id}`);
      if(user_bd.res.length == 0) {
        return msg.channel.send('Произошла ошибка, я не смогла найти в базе. Попробуйте повторить запрос!')
      }
      var embed = {
        "title": `Варны у ${warn_to_user.tag}`,
        "color": 5715438,
        "fields": [
          {
            "name": "Количество:",
            "value": `${user_bd.res[0].warn}/${result[0][`moderation_maxwarn_ban_count`]}`
          }
        ]
      };
      msg.channel.send({ embed })
      break;
    default:
      msg.channel.send(`Доступный команды:\nsend - Отправить ВАРН\nclear - Сделать сброс ВАРНОВ\ncheck - Проверить количество ВАРНОВ`)
  }

}
