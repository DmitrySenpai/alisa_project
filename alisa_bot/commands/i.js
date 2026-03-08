exports.run = async (client, msg, args, result, author_user_bd) => {

    if (!args[1]) return msg.channel.send("Список категории: *bad, baka, bang, bite, blush, confused, dab, dance, greet, handholding, happy, highfive, hug, idk, inu, kiss, lewd, lick, neko, nom, nyan, pat, poke, pout, slap, sleepy, smug, stare, thumbsup, tickle, waa, wasted*");
    client.req({url: `http://127.0.0.1:8080/images_cmd/?i=${args[1]}`, json: true}, (error, response, body) => {
            
        if (error || response.statusCode != 200) return;
        if (body == null) return msg.channel.send("Список категории: *bad, baka, bang, bite, blush, confused, dab, dance, greet, handholding, happy, highfive, hug, idk, inu, kiss, lewd, lick, neko, nom, nyan, pat, poke, pout, slap, sleepy, smug, stare, thumbsup, tickle, waa, wasted*");
        let text_message_file = {
            "bad" : (msg.author + " наказал(а) себя!"),
            "baka" : (msg.author + " считает что Alisa baka."),
            "bang" : (msg.author + " застрелился..."),
            "bite" : (msg.author + " укусил(а) Alisa!"),
            "blush" : (msg.author + " покраснел(а)!"),
            "confused" : (msg.author + " смутился!"),
            "dab" : (msg.author + " сделал(а) деб"), // okay?
            "dance" : (msg.author + " начал(а) танцевать!"),
            "greet" : (msg.author + " приветствует!"), // не понял
            "handholding" : (msg.author + " вы взялись за руки с Alisa"),
            "happy" : (msg.author + " веселится!"),
            "highfive" : (msg.author + " дал пять Alisa."),
            "hug" : (msg.author + " обнимает Alisa."),
            "idk" : (msg.author + " пожимает плечами ¯\\_(ツ)_/¯"),
            "inu" : (""),
            "kiss" : (msg.author + " поцеловал(а) Alisa."),
            "lewd" : (msg.author + " слишком пошлый."),
            "lick" : (msg.author + " лижет Alisa"),
            "neko" : (""),
            "nom" : (msg.author + " решил(а) покушать."),
            "nyan" : (msg.author + ", тут есть милые неко-тянки."),
            "pat" : (msg.author + " гладит Alisa."),
            "poke" : (msg.author + " тыкает Alisa."),
            "pout" : (msg.author + " дуется."),
            "slap" : (msg.author + ", щлепнул(а) Alisa."),
            "sleepy" : (msg.author + " хочет спать."),
            "smug" : (msg.author + " самовлюбленно смотрит."),
            "stare" : (msg.author + " пялится."),
            "thumbsup" : ("У " + msg.author + " появилась идея!"),
            "tickle" : (msg.author + " щекочет Alisa."),
            "waa" : (msg.author + " загрустил(а)"),
            "wasted" : (msg.author + " был(а) потрачен(а) впустую.")
        };
        if (args[2]) {
            let mention_text = "";
            for (var i = 2; i < args.length; i++) {
                if (mention_text == "") mention_text = args[i];
                else mention_text += ", " + args[i];
            }
            text_message_file = {
                "bad": (mention_text + ", вы наказаны по приказу " + msg.author + "."),
                "baka" : (mention_text + ", вам пришло важное сообщение от " + msg.author + ", что вы BAKA!"), // ну или БАКА ¯\_(ツ)_/¯
                "bang" : (msg.author + ", стреляет в " + mention_text + "."),
                "bite": (msg.author + " укусил(а) " + mention_text + "!"),
                "blush": (msg.author + " заставил(а) покраснеть " + mention_text + "."),
                "confused": (mention_text + " и " + msg.author + " смутились."),
                "dab" : (mention_text + " и " + msg.author + " сделали деб."),
                "dance": (msg.author + " танцует с " + mention_text + "."),
                "greet" : (mention_text + " , вам привет " + msg.author + "."), // i dont know
                "handholding" : (msg.author + " и " + mention_text + " взялись за руки."),
                "happy": (msg.author + " и " + mention_text + " веселятся!"),
                "highfive" : (msg.author + " дал пять " + mention_text + "."),
                "hug": (msg.author + " обнял(а) " + mention_text + "."),
                "idk": (msg.author + " и " + mention_text + " пожимают плечами ¯\\_(ツ)_/¯"),
                "inu": (""),
                "kiss": (msg.author + " поцеловал(а) " + mention_text + "."),
                "lewd": (msg.author + ", ведет себя пошло по отношению к " + mention_text + "."), // da
                "lick": (msg.author + " лизнул(а) " + mention_text + "."),
                "neko": (""),
                "nom": (msg.author + " кушает с " + mention_text  + "."),
                "nyan": ("Эй!" + mention_text + " похоже, что " + msg.author + " хочет, чтобы у вас были симпатичные неко-тянки."),
                "pat": (msg.author + " гладит " + mention_text),
                "poke": (msg.author + " тыкает " + mention_text + " owo"),
                "pout": (msg.author + " дуется на " + mention_text + "."),
                "slap": (msg.author + " шлепнул(а) " + mention_text + "!"),
                "sleepy": (mention_text + " и " + msg.author + " хотят спать."),
                "smug": (msg.author + " самовлюбленно смотрит на " + mention_text + "."),
                "stare": (msg.author + " пялится на " + mention_text + ", интересно, интересно..."),
                "thumbsup": ("Эй! " + mention_text + ". " + msg.author + " нравится ваша идея."),
                "tickle" : (msg.author + " щекочет " + mention_text),
                "waa": ("Взгляд у " + mention_text + " и " + msg.author +  " какой то грустный."),
                "wasted": (mention_text + " был(а) потрачен(а) впустую из за " + msg.author + ".")
            }; 
        }
        random_images_get = Math.floor(Math.random() * body.length);
        let embed = new client.discord.RichEmbed().setDescription(text_message_file[args[1]]).setColor('#3498db').setImage(`http://127.0.0.1:8080/images_cmd/${args[1]}/${response.body[random_images_get]}`)
        msg.channel.send({ embed });
    })
}
