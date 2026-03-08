module.exports = (client, member) => {
    client.con.query(`SELECT * FROM server WHERE id=${member.guild.id}`, async function (err, result) {
        if (err) throw err;
        if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${member.guild.id}')`);

        var user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${member.user.id} AND server_id= ${member.guild.id}`);
        if(user_bd.res.length == 0) client.con.query(`INSERT INTO account_server (user_id, server_id) VALUES ('${member.user.id}', '${member.guild.id}')`);

        //Авто-роль        
        if (result[0][`auto_role`]) {
			JSON.parse(result[0][`auto_role`]).forEach(role => {
				if(member.guild.roles.find(c => c.id == role) && !msg.member.roles.has(role)) {
					member.addRole(msg.member.guild.roles.get(role));
				}
			});
		}
        //end Авто-роль
        
        //log
        if (JSON.parse(result[0].log) !== null) {
            if (JSON.parse(result[0].log)[0].log_new_user == 1 && JSON.parse(result[0].log)[0].channel !== 0) {
                const embed_log = new client.discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Новый пользователь!')
                    .setDescription(`<@${member.user.id}>, этот пользователь зашел на сервак!`)
                client.channels.get(JSON.parse(result[0].log)[0].channel).send(embed_log)
            }
        }
        //end


        //client.channels.get('534425885294723073').send(`<@${member.id}> (${member.user.tag}), этот пользователь зашел на сервер!`)
        if (result[0].say_hello_on == 1) client.channels.get(result[0].hi_bye_ch).send(result[0].say_hello.replace('{name}', member.user.tag)).then(msg => {
            if(result[0].msg_hi_goodbye_del == 1) msg.delete(result[0].temp_msg_del * 1000)
        })
    });
}