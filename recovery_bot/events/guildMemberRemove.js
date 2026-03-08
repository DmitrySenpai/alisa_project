module.exports = (client, member) => {
	client.channels.get('534425885294723073').send(`<@${member.id}> (${member.user.tag}), этот пользователь вскрылся!`);
}