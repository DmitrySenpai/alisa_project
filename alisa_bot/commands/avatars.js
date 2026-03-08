exports.run = (client, msg, args) => {

  usergetavar = msg.mentions.users.first();
  if (!usergetavar) usergetavar = msg.author;
  msg.channel.send(usergetavar.avatarURL);

}
