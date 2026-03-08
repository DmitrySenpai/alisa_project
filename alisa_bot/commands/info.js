const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');
registerFont('bebasneueregular.ttf', { family: 'Bebas' });

const applyText = (text, x, y, fontSize, fontName, width, color, flag = true) => {
    do {
        ctx.font = `${fontSize -= 1}px "${fontName}"`;
    } while (ctx.measureText(text).width > width);
    ctx.fillStyle = color;
    if (flag) x = x + width / 2 - ctx.measureText(text).width / 2;
    ctx.fillText(text, x, y)
};

const wrapText = (text, x, y, fontSize, lines, lineHeight, fontName, width, color) => {
    let words = text.split(" "),
    	countWords = words.length,
    	line = "", cLine = 0;
    for (var n = 0; n < countWords; n++) {
        let testLine = line + words[n] + " ",
        	testWidth = ctx.measureText(testLine).width;
        if (testWidth > width && cLine < lines) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight + fontSize;
            cLine += 1;
        }
        else {
            line = testLine;
        }
    }
}

exports.run = async (client, msg, args, result, author_user_bd) => {

	msg.channel.startTyping();

	let memb = msg.mentions.members.first()
	let use = msg.mentions.users.first()

	if (!memb) {
		memb = msg.member;
		use = msg.author;
	} else {
		var author_user_bd = await client.promise(client.con, client.con.query, `SELECT * FROM account_server WHERE user_id= ${use.id} AND server_id= ${msg.guild.id}`);
		author_user_bd = author_user_bd.res[0]
  		let rank = await client.promise(client.con, client.con.query, 'SET @row_number = 0');
			rank = await client.promise(client.con, client.con.queryCol, `SELECT num FROM (SELECT (@row_number:=@row_number + 1) AS num, user_id FROM account_server WHERE server_id= ${msg.guild.id} ORDER BY point DESC, lvl ASC) AS temp WHERE user_id= ${use.id}`);
		author_user_bd.rank = rank.res[0]
	}

	if (use.bot == true) return msg.channel.stopTyping();

		const bg = await loadImage('./bg.jpg');
		ctx.drawImage(bg, 0, 0);
	
		const profile = await loadImage('./profile.png');
		ctx.drawImage(profile, 0, 0);
	

		//point_to_lvl = parseInt(body[0]['lvl']) * 30
		//if (point_to_lvl == 0) point_to_lvl = parseInt(30);
	
		//applyText(use.username, 170, 203, 21, 'Arial', 313, "#ffffff");
		//applyText(body[0]['nickname'], 170, 221, 17, 'Arial', 313, "#ffffff");

		applyText(use.username, 174, 295, 21, 'Arial', 319, "#ffffff");

		applyText('+' + author_user_bd.rep + 'REP', 22, 345, 30, 'Bebas', 140, "#ffffff");
		applyText(author_user_bd.lvl, 197, 410, 60, 'Bebas', 60, "#2e2e2e");
		applyText('# ' + author_user_bd.rank, 386, 377, 35, 'Bebas', 104, "#2e2e2e");

		point_to_lvl = author_user_bd.lvl * 30
		if (point_to_lvl == 0) point_to_lvl = parseInt(30);

		applyText(`${author_user_bd.point}/${point_to_lvl}`, 386, 336, 35, 'Bebas', 104, "#2e2e2e");
		applyText(author_user_bd.money, 386, 420, 35, 'Bebas', 104, "#2e2e2e");


		var marry_user = msg.guild.member(author_user_bd.marry_user)
		if (marry_user) {
			marry_status = `${marry_user.user.username}#${marry_user.user.discriminator}`;
		  } else {
			marry_status = `Нет пары!`
		  }

		applyText(marry_status, 243, 454, 18, 'Bebas', 249, "#2e2e2e");


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

		applyText(data_join_2, 243, 478, 18, 'Bebas', 249, "#2e2e2e");

		//applyText(body[0]['point'] + '/' + point_to_lvl, 351, 305, 20, 'Arial', 120, "#6c6b6b");
		//applyText('# ' + body[0]['rank'], 351, 330, 20, 'Arial', 120, "#6c6b6b");
		//applyText(body[0]['money'], 351, 355, 20, 'Arial', 120, "#6c6b6b");
	
		//wrapText(body[0]['description'], 183, 414, 11, 4, 7, "Arial", 285, "#6c6b6b");
		
		if (use.avatarURL) await loadImage(use.avatarURL).then((up) => {ctx.drawImage(up, 22, 180, 138, 138);})
		
		const attachment = canvas.toBuffer();
		msg.channel.send({ files: [{ attachment, name: `profile_${use.tag}.png` }] });
		msg.channel.stopTyping();

};
