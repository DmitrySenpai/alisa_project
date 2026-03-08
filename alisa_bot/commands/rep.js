exports.run = async (client, msg, args, result, author_user_bd) => {

    if (!args[1]) return msg.channel.send("Кому повысить репутацию?");
    let usertorep = msg.mentions.users.first().id;
    if (!msg.guild.member(usertorep)) return msg.channel.send("Ошибка!");
    if (usertorep == msg.author.id) return msg.channel.send(":x: | Нельзя повышать репутацию самому себе!");
    if (msg.mentions.users.first().bot == true) return;

    if (Math.floor(new Date() / 1000) < author_user_bd.rep_last) return msg.channel.send(`:up: | Вы сможете повысить чью-то репутацию через ${client.timeleft(Math.floor(new Date() / 1000), author_user_bd.rep_last)}`);
    
    var user_to = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${usertorep} AND server_id= ${msg.guild.id}`);

    if (user_to.res.length == 0) return msg.channel.send(`:up: | Не удалось найти этого пользователя в базе!`);

    client.con.query(`UPDATE account_server set rep= ${user_to.res[0].rep+1} WHERE user_id= ${usertorep} AND server_id= ${msg.guild.id}`);
    client.con.query(`UPDATE account_server set rep_last= ${Math.floor(new Date() / 1000) + 43200} WHERE user_id= ${msg.author.id} AND server_id= ${msg.guild.id}`);
    msg.channel.send(":up: | Вы повысили репутацию " + msg.mentions.users.first());

}
