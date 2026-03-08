module.exports = (client, msg) => {

    if (msg.author.bot) return;

  	if (!msg.member.roles.has("342039027953827841") || !msg.member.roles.has("527452799940952084")) {
  	    msg.member.addRole(msg.member.guild.roles.get("532102510450573313"));
  	    msg.member.addRole(msg.member.guild.roles.get("342039027953827841"));
        msg.member.addRole(msg.member.guild.roles.get("527452799940952084"));
    }
    if (!msg.member.roles.has("527451259146469377")) msg.member.addRole(msg.member.guild.roles.get("527451259146469377"));

    if (msg.channel.id == "532207193286770701") {

        if (msg.content.includes('discord.gg/'||'discordapp.com/invite/')) {
            msg.author.send("Вы были забанены на сервере SovietSoft, по причине того, что вы занимались спам-рассылкой!\nЗаниматься рассылкой спама - **ЗАПРЕЩЕНО!** Научитесь уважать себя и остальных!\nВы должны были знать основные условия использование Discord(а).\n\nПрочитайте этот фрагмент:\n\nВы можете использовать Сервис для отправки сообщений другим пользователям Сервиса. Вы соглашаетесь с тем, что использование вами Сервиса не включает отправку незатребованных маркетинговых сообщений (то есть «спама»). Мы можем использовать различные средства для блокировки доступа к Сервису спамерам и недобросовестным пользователям. Если вы считаете, что спам пришёл вам посредством Сервиса, пожалуйста, немедленно сообщите нам об этом по адресу support@discordapp.com\n\nИсточник: https://discordapp.com/terms\n\nВ заключение, после отправки жалобы на спам, ваш аккаунт будет удален, а так же возможно ваш сервер прекратит свое существование.\nПоэтому следуйте условия использование Discord(а)!!!")
            msg.guild.channels.get('534425885294723073').sendMessage("<@" + msg.author.id + "> , этот пользователь рекламирует сервер на канале join и улетел в бан! \n ТЕКСТ: ```\n" + msg.content + "```")
            msg.delete();
            return msg.member.ban("Реклама!")
        }

        msg.guild.channels.get('534425885294723073').sendMessage("<@" + msg.author.id + "> , этот пользователь авторизовался!") //От Лены
        msg.delete();

        let embed = new client.discord.RichEmbed()
		      .setTitle("Новый пользователь!")
		      .setDescription(`<@${msg.author.id}> , Добро пожаловать на сервер SovietSoft! Желаем вам приятно провести время :wink: !\nОзнакомьтесь с <#342048597002682369> и <#572101752216879120> , а так же возьмите себе ролей на канале <#492608668991225856>`)
		      .setColor('#59eaf9')
		      .setThumbnail(msg.author.avatarURL)
		msg.member.guild.channels.get('429732772106600449').send({embed}).then(msg => {msg.delete(100000)});

    }

    //END

    //Предложение

    if (msg.channel.id == "554548395469963279") {
        msg.react('👍')
        msg.react('👎')
    }


    //Функционал от Лены
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        if (msg.content.includes('discord.gg/'||'discordapp.com/invite/')) { //if it contains an invite link
            user_warn_invite = user_warn_invite + 1
            msg.guild.channels.get('534425885294723073').sendMessage("<@" + msg.author.id + "> , ВНИМАНИЕ! <@324557711092219904> и <@&538786139566505992> \n Этот пользователь рекламирует сервер! \n ТЕКСТ: ```\n" + msg.content + "```")
            msg.delete() //delete the message
            msg.channel.send("<@" + msg.author.id + "> , вы нарушаете правила сервера! Пожалуйста не рекламируйте сервер!").then(msg => {msg.delete(30000)})
            if (user_warn_invite > 3) {
                msg.author.send("Вы были забанены на сервере SovietSoft, по причине того, что вы занимались спам-рассылкой!\nЗаниматься рассылкой спама - **ЗАПРЕЩЕНО!** Научитесь уважать себя и остальных!\nВы должны были знать основные условия использование Discord(а).\n\nПрочитайте этот фрагмент:\n\nВы можете использовать Сервис для отправки сообщений другим пользователям Сервиса. Вы соглашаетесь с тем, что использование вами Сервиса не включает отправку незатребованных маркетинговых сообщений (то есть «спама»). Мы можем использовать различные средства для блокировки доступа к Сервису спамерам и недобросовестным пользователям. Если вы считаете, что спам пришёл вам посредством Сервиса, пожалуйста, немедленно сообщите нам об этом по адресу support@discordapp.com\n\nИсточник: https://discordapp.com/terms\n\nВ заключение, после отправки жалобы на спам, ваш аккаунт будет удален, а так же возможно ваш сервер прекратит свое существование.\nПоэтому следуйте условия использование Discord(а)!!!")
                msg.member.ban("Реклама!")
            }
            anti_flud_on = 0
        }
    }

    var channel_stop_send = ["491282828915638272", "532879166450827264", "415593238947299329", "342040493011763200", "346672977179443210", "500719215473590283", "342040569402359818"]
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        if (channel_stop_send.includes(msg.channel.id)) {
          if (channel_stop_send.includes(msg.channel.id) || msg.content != "" && msg.attachments.size < 1) {
            msg.delete()
            msg.channel.send(`:x: <@${msg.author.id}> Вы похоже ошиблись чатом!`).then(msg => {msg.delete(20000)})
          }
        }
    }
 
                        
      if (!msg.content.toLowerCase().startsWith('a!')) return;

  		const args = msg.content.toLowerCase().slice(2).trim().split(/ +/g);
		
  		const cmd = client.commands.get(args[0]);
  		if (!cmd) return;
		
  		cmd.run(client, msg, args);

};