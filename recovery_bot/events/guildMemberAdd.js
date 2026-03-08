module.exports = (client, member) => {
    client.channels.get('534425885294723073').send(`<@${member.id}> (${member.user.tag}), этот пользователь зашел на сервер!`)
    //api nika
    client.req({url: `https://api.server-discord.com/warns/${member.id}?dKey=${client.apiserdiscord}`, json: true}, (error, response, body) => {
        if (error || response.statusCode != 200) return;
        if (body.error) return;
        if (body.warns > 1) {
            client.channels.get('534425885294723073').send(`ВНИМАНИЕ! <@324557711092219904> и <@&538786139566505992>\n<@${member.id}> (${member.user.tag}), этот человек есть в базе SERVER DISCORD!\nКоличество warns: ${body.warns}`);
        }
    })
}