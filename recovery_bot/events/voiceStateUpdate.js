const categoryId = '577089921370816512'       // ID категории для созданных каналов
        , cooldown = 15         // Кулдаун между перезаходами в секундах (Если поставить меньше, есть возможность сломать Дискорд)
        ;
    
let talkedRecently = new Set(), channelOwners = new Map(); // таймер и map

module.exports = (client, oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    if(!oldMember.voiceChannel && newUserChannel) {
        let count_time_voice = 0;
        newMember.addRole("571974130258149387")
        const intervalObj = setInterval(() => {
            if (!newMember.voiceChannelID) {
                clearInterval(intervalObj); 
                return newMember.removeRole("571974130258149387");
            }
            //if (newUserChannel.members.size == 1 || newUserChannel.members.get(newMember.id).selfMute || newUserChannel.members.get(newMember.id).selfDeaf || newUserChannel.id == "342040307061489677" || newUserChannel.id == "342050205538975744") return;
            if (newMember.voiceChannel.members.size == 1 || newMember.voiceChannel.members.get(newMember.id).selfMute || newMember.voiceChannel.members.get(newMember.id).selfDeaf || newMember.voiceChannel.id == "342040307061489677" || newMember.voiceChannel.id == "342050205538975744") return;
            count_time_voice++;
            if (count_time_voice < 50) return;
            count_time_voice = 0;
        }, 10000);
    }

    if (oldMember.voiceChannel && oldMember.voiceChannel.parentID == categoryId && newMember.voiceChannelID != channelOwners.get(oldMember.id) && oldMember.voiceChannelID == channelOwners.get(oldMember.id)) {
        oldMember.voiceChannel.delete(); 
        channelOwners.delete(oldMember.id); 
        client.creatorVoice.permissionOverwrites.get(newMember.user.id).delete();
    }
    if (newMember.voiceChannelID != channelId) return;

    newMember.voiceChannel.clone(`${newMember.user.tag} 🔐`, false, false).then(async clone => {
        client.creatorVoice.overwritePermissions(newMember.user, {VIEW_CHANNEL: false});
        await clone.setParent(categoryId);
        clone.setUserLimit(2);
        clone.overwritePermissions(newMember.user, {MANAGE_CHANNELS: true, VIEW_CHANNEL: true, CONNECT: true, SPEAK: true});
        clone.overwritePermissions('577076290327150593', {VIEW_CHANNEL: true, CONNECT: false, SPEAK: true}); //Основная роль
        clone.overwritePermissions('527438735202058260', {VIEW_CHANNEL: true, CONNECT: true, SPEAK: true});
        clone.overwritePermissions('410139518600216578', {VIEW_CHANNEL: true, CONNECT: true, SPEAK: true});
        clone.overwritePermissions(newMember.guild.defaultRole, {VIEW_CHANNEL: false, CONNECT: false, SPEAK: false});
        newMember.setVoiceChannel(clone.id);
        talkedRecently.add(newMember.id);
        channelOwners.set(newMember.id, clone.id);
    });
}