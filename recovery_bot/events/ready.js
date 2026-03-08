let Parser = require('rss-parser');
let parser = new Parser();
var HTMLParser = require('node-html-parser');
var time_enable_active = 518400; //3 недели - 1814400
var count_active = 100;

module.exports = (client) => {

    client.user.setPresence({game: {name: 'Everlasting Summer', type: 'PLAYING'}});
    
    channelId = '577090236576694272' // ID голосового канала создания
    client.creatorVoice = client.channels.get(channelId);

    setInterval(async () => {
        i = 0;
        chat_voice_id = "553201747938508801"; //Чат войс
        role_voice = "571974130258149387"; //Роль на войс
        user_all = client.channels.get(chat_voice_id).guild.members.map(member => member.user.id);
        get_voice_chat = client.channels.get(chat_voice_id);
        while (i < Object.keys(user_all).length) {
            voice_channel_chat = get_voice_chat.guild.member(user_all[i]);
            if (!voice_channel_chat.voiceChannelID && voice_channel_chat._roles.find(id => id == role_voice)) get_voice_chat.members.get(user_all[i]).removeRole(role_voice);
            i++;
        }
    }, 600000);

    console.log(`Бот авторизован как  ${client.user.tag}!`);
}