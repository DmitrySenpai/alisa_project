exports.run = async (client, msg, args, result, author_user) => {

  var marry_to_user = msg.mentions.users.first();
  //if(!marry_to_user) return msg.reply("Кому отправить?");

  switch (args[1]) {
    case "status":
      if(!marry_to_user) marry_to_user = msg.author
      var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${marry_to_user.id} AND server_id= ${msg.guild.id}`);
      if (msg.guild.member(user_bd.res[0].marry_user)) {
        text_status = `У <@${marry_to_user.id}> есть пара <@${user_bd.res[0].marry_user}>!`;
      } else {
        text_status = `У <@${marry_to_user.id}> нет пары!`
      }
      embed_status = new client.discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Marry')
        .setDescription(`${text_status}`)
      msg.channel.send(embed_status)
      break;
    case "divorce":
      if (author_user.marry_user == '0') return msg.channel.send(`Как бы у вас пары нет!`)

      var update_1 = await client.promise(client.con, client.con.query, `UPDATE account_server set marry_user= '0' WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
      var update_2 = await client.promise(client.con, client.con.query, `UPDATE account_server set marry_user= '0' WHERE user_id= ${author_user.marry_user} AND server_id= ${msg.guild.id}`);

      if (result[0][`marry_role`] !== 0) {
        var role_give = msg.member.guild.roles.get(result[0][`marry_role`])
        await msg.guild.member(msg.author.id).removeRole(role_give);
        await msg.guild.member(author_user.marry_user).removeRole(role_give);
      }

      msg.channel.send(`<@${msg.author.id}> и <@${author_user.marry_user}> - ушли в ращные стороны!`)
      break;
    default:
      if(!marry_to_user) return msg.reply("Кому кинуть заявку?");
      if(marry_to_user.id == msg.author.id) return msg.channel.send(`Нельзя самому себе!`)
      if(marry_to_user.bot) return msg.reply("Это бот!");

      if (author_user.marry_user !== '0') return msg.channel.send(`Как бы у вас есть пара!`)

      var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${marry_to_user.id} AND server_id= ${msg.guild.id}`);
      if (user_bd.res[0].marry_user !== '0') return msg.channel.send(`Увы у ${user_bd.res[0].marry_user} есть пара!`)

      msg.channel.send(`<@${marry_to_user.id}>, должн(а) принять ваше предложение. Достаточно написать: \n**yes** - что бы принять\nили\n**no** - что бы отказаться.\nУ вас 30 секунд!`).then(async () => {
        msg.channel.awaitMessages(response => response.content === 'yes' && response.author.id === marry_to_user.id || response.content === 'no' && response.author.id === marry_to_user.id, {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
        .then(async (collected) => {
            //msg.channel.send(`The collected message was: ${collected.first().content}`);
            if (collected.first().content == 'yes') {
              msg.channel.send(`<@${marry_to_user.id}> принял предложение от <@${msg.author.id}>! поздравляю вас! 💍`)
              //await client.con.query(`UPDATE account_server set marry_user= '${marry_to_user.id}' WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
              //await client.con.query(`UPDATE account_server set marry_user= '${msg.author.id}' WHERE user_id= ${marry_to_user.id} AND server_id= ${msg.guild.id}`);

              var update_1 = await client.promise(client.con, client.con.query, `UPDATE account_server set marry_user= '${marry_to_user.id}' WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
              var update_2 = await client.promise(client.con, client.con.query, `UPDATE account_server set marry_user= '${msg.author.id}' WHERE user_id= ${marry_to_user.id} AND server_id= ${msg.guild.id}`);
              if (result[0][`marry_role`] !== 0) {
                if(msg.guild.roles.find(c => c.id == result[0][`marry_role`])) {
                  var role_give = msg.member.guild.roles.get(result[0][`marry_role`])
                  //console.log(msg.guild.member(msg.author.id))
                  await msg.guild.member(msg.author.id).addRole(role_give);
                  await msg.guild.member(marry_to_user.id).addRole(role_give);
                }
              }
            } else {
              msg.channel.send(`<@${msg.author.id}>, к сожалению <@${marry_to_user.id}> отказался!`)
            }
          })
          .catch(() => {
            msg.channel.send('Увы, время вышло!');
          });
      });

  }
}