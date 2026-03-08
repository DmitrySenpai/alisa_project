const cooldown = 15;
let talkedRecently = new Set(), channelOwners = new Map(); // таймер и map

module.exports = async (client, oldMember, newMember) => {

    client.con.query(`SELECT * FROM server WHERE id=${oldMember.guild.id}`, async function (err, result) {

        if (err) throw err;
		if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${msg.guild.id}')`);

        let newUserChannel = newMember.voiceChannel;
        //Выдачи ролей
	//console.log(newUserChannel)
        if(newUserChannel) {
	//if(!oldMember.voiceChannel && newUserChannel) {
            if(oldMember.guild.roles.find(c => c.id == result[0][`voice_role`]) && result[0][`voice_role`] !== 0) newMember.addRole(result[0][`voice_role`])
        } else {
            //Если человек ушел из войса
            if(oldMember.guild.roles.find(c => c.id == result[0][`voice_role`]) && result[0][`voice_role`] !== 0) oldMember.removeRole(result[0][`voice_role`]);
        }
        //Приватные войсы

        if (result[0].voice_create !== 'null') {
            var create_voice = client.guilds.get(result[0].id).channels.get(result[0].voice_create)
            var categoryId = create_voice.parentID
            var channelId = result[0].voice_create
            var roles_list_create_voice = JSON.parse(result[0].voice_create_roles)



            if (channelOwners.get(newMember.user.id) == oldMember.voiceChannelID && typeof oldMember.voiceChannelID !== 'undefined' && oldMember.voiceChannelID && newMember.voiceChannelID !== channelOwners.get(newMember.user.id)) {
                channelOwners.delete(oldMember.id);
                if(oldMember.voiceChannel.members.size === 0){
                    //Если никого нет
                    oldMember.voiceChannel.delete(); 
                } else {
                    oldMember.voiceChannel.permissionOverwrites.get(newMember.user.id).delete();

                    user_random_send_owner = oldMember.voiceChannel.members.random().user.id
                    oldMember.voiceChannel.overwritePermissions(user_random_send_owner, {MANAGE_CHANNELS: true});
                    channelOwners.set(user_random_send_owner, oldMember.voiceChannelID);
                }

                //setTimeout(() => {
                //    create_voice.permissionOverwrites.get(newMember.user.id).delete();
                //}, cooldown);
            }


            //if (oldMember.voiceChannel && oldMember.voiceChannel.parentID == categoryId && newMember.voiceChannelID != channelOwners.get(oldMember.id) && oldMember.voiceChannelID == channelOwners.get(oldMember.id)) {
            //    oldMember.voiceChannel.delete(); 
            //    channelOwners.delete(oldMember.id); 
            //    //setTimeout(() => {
            //    //    create_voice.permissionOverwrites.get(newMember.user.id).delete();
            //    //}, cooldown);
            //}


            if (newMember.voiceChannelID != channelId) return;

            //newMember.voiceChannel.clone(`${newMember.user.tag} 🔐`, false, false).then(async clone => {
            //    create_voice.overwritePermissions(newMember.user, {VIEW_CHANNEL: false});
            //    await clone.setParent(categoryId);
            //    clone.setUserLimit(2);
            //    if (result[0].voice_owner_permission == 1) clone.overwritePermissions(newMember.user, {MANAGE_CHANNELS: true, VIEW_CHANNEL: true, CONNECT: true, SPEAK: true});
            //    if (roles_list_create_voice !== null) {
            //        clone.overwritePermissions(newMember.guild.defaultRole, {VIEW_CHANNEL: false, CONNECT: false, SPEAK: false});
            //        roles_list_create_voice.forEach(role => {
            //            if (client.guilds.get(result[0].id).roles.get(role)) clone.overwritePermissions(role, {VIEW_CHANNEL: true, CONNECT: false, SPEAK: true});
            //        });
            //    }
            //    newMember.setVoiceChannel(clone.id);
            //    talkedRecently.add(newMember.id);
            //    channelOwners.set(newMember.id, clone.id);
            //});

            //NEW
            newMember.guild.createChannel(`${newMember.user.tag} 🔐`, {
                type: 'voice',
                userLimit: 2,
                parent: categoryId,
                permissionOverwrites: [{
                    id: newMember.guild.id,
                    deny: 3146752
                },
                {
                    id: newMember.id,
                    allow: 3146768
                }]
            }).then(voice => { 
                newMember.setVoiceChannel(voice)
                talkedRecently.add(newMember.id);
                channelOwners.set(newMember.id, voice.id);
            })
        }
    })
}
