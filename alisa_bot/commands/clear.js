exports.run = (client, msg, args) => {
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("Недостаточно прав!").then(msg => msg.delete(2000));
    if(!args[1]) return msg.channel.send("Введите количество сообщений.").then(msg => msg.delete(2000));
    msg.channel.bulkDelete(args[1]).then(() => {
        msg.channel.send(`Удалено ${args[1]} сообщений.`).then(msg => msg.delete(2000));
    });
}