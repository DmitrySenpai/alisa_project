module.exports = (client, member) => {
	client.con.query(`SELECT * FROM server WHERE id=${member.guild.id}`, function (err, result) {
        if (err) throw err;
        if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${member.guild.id}')`);

        //client.channels.get('534425885294723073').send(`<@${member.id}> (${member.user.tag}), этот пользователь зашел на сервер!`)
        if (result[0].say_bye_off == 1) client.channels.get(result[0].hi_bye_ch).send(result[0].say_bye.replace('{name}', member.user.tag)).then(msg => {
            if(result[0].msg_hi_goodbye_del == 1) msg.delete(result[0].temp_msg_del * 1000)
        })

        //log
        if (JSON.parse(result[0].log) !== null) {
            if (JSON.parse(result[0].log)[0].log_leave_user == 1 && JSON.parse(result[0].log)[0].channel !== 0) {
                const embed_log = new client.discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Пользователь покинул!')
                    .setDescription(`<@${member.user.id}>, этот пользователь покинул сервак!`)
                client.channels.get(JSON.parse(result[0].log)[0].channel).send(embed_log)
            }
        }
        //end
    });
}