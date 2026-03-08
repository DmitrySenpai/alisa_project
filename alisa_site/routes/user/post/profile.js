module.exports.func = async(discord, con, promise, req, res) => {
    //console.log(req.body)
    //console.log(`Страница: ${req.query.page}`)
    //res.redirect('/profile');

    status_setting = 0

    if (!discord.guilds.get(req.query.id).member(req.session.user.id).hasPermission("ADMINISTRATOR")) status_setting = 1

    //Настройка - привет и пока!

    if (req.query.page == 'myserver' && req.query.setting == 'hello_and_goodbye' && status_setting == 0) {
        //res.redirect(`/profile?page=${req.query.page}&id=${req.query.id}&setting=${req.query.setting}&status=1`);
        //status_setting
        //console.log(req.body)
        channel_select = discord.guilds.get(req.query.id).channels.get(req.body.channel)
        if (!channel_select) { status_setting = 2 } else {
            if (channel_select.type == 'text') {
                //Проверка канала - завершена

                temp_msg = Math.abs(req.body.temp_msg)

                if (!req.body.temp_msg_on) temp_msg = 1

                if (!parseInt(temp_msg) || parseInt(temp_msg) > 180) { status_setting = 4 } else {
                    //Проверка на время удаление - завершена
                        var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
                        //if (err) throw err;
                        if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);

                        sql_temp_msg_on = 1
                        if (!req.body.temp_msg_on) sql_temp_msg_on = 0

                        sql_hello_on = 1
                        if (!req.body.hello_on) sql_hello_on = 0

                        sql_hello_bye = 1
                        if (!req.body.hello_bye) sql_hello_bye = 0

                        con.query(`UPDATE server SET hi_bye_ch = ${req.body.channel}, hi_bye_ch = '${channel_select.id}', temp_msg_del = ${temp_msg}, say_hello = '${req.body.text_hello}', say_bye = '${req.body.text_bye}', say_hello_on = '${sql_hello_on}', say_bye_off = '${sql_hello_bye}', msg_hi_goodbye_del = '${sql_temp_msg_on}' WHERE id = '${req.query.id}'`);
                        status_setting = 1


                }
            } else { status_setting = 3 }
        }
        //console.log(res.socket.parser.incoming.originalUrl)
    }

    //Настройка - Вкл/Выкл - команды

    if (req.query.page == 'myserver' && req.query.setting == 'cmd' && status_setting == 0) {

        
            var result_cmd = []
            if (req.body.cmd_avatars) result_cmd.push('avatars')
            if (req.body.cmd_clear) result_cmd.push('clear')
            if (req.body.cmd_warn) result_cmd.push('warn')
            if (req.body.cmd_rep) result_cmd.push('rep')
            if (req.body.cmd_i) result_cmd.push('i')
            if (req.body.cmd_marry) result_cmd.push('marry')


            var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
            if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);

            if (req.body.cmd_msc && server_setting.res[0].partner == 1) result_cmd.push('msc')

            con.query(`UPDATE server SET commands = ?, marry_role = '${req.body.marry_role}' WHERE id = '${req.query.id}'`, [JSON.stringify(result_cmd)]);
            status_setting = 1
    }

    //Настройка - log журнал

    if (req.query.page == 'myserver' && req.query.setting == 'log' && status_setting == 0) {

        channel_select = discord.guilds.get(req.query.id).channels.get(req.body.channel)
        if (!channel_select) { status_setting = 2 } else {
            if (channel_select.type == 'text') {
                log_new_user = 1
                if (!req.body.log_new_user) log_new_user = 0
                log_leave_user = 1
                if (!req.body.log_leave_user) log_leave_user = 0
                log_new_user_auth = 1
                if (!req.body.log_new_user_auth) log_new_user_auth = 0
                log_user_spam_inv = 1
                if (!req.body.log_user_spam_inv) log_user_spam_inv = 0
                log_warns = 1
                if (!req.body.log_warns) log_warns = 0
                json_log = []
                json_log.push({
                    "channel": channel_select.id,
                    "log_new_user": log_new_user,
                    "log_leave_user": log_leave_user,
                    "log_new_user_auth": log_new_user_auth,
                    "log_user_spam_inv": log_user_spam_inv,
                    "log_warns": log_warns
                })
                var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
                if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);
                con.query(`UPDATE server SET log = ? WHERE id = '${req.query.id}'`, [JSON.stringify(json_log)]);
                status_setting = 1
            }
        }
    }

    //Настройка - система ЛВЛ

    if (req.query.page == 'myserver' && req.query.setting == 'lvl_system' && status_setting == 0) {

        channel_select = discord.guilds.get(req.query.id).channels.get(req.body.lvl_system_info)

        //if (!channel_select && req.body.lvl_system_info !== '0') { status_setting = 2 } else { }


        if (req.body.lvl_system_info == '0' || req.body.lvl_system_info == '1'|| channel_select) {


            if(req.body.lvl_system_info == '0' || req.body.lvl_system_info == '1') { channel_select = []; channel_select.type = 'text'; }

            if (channel_select.type == 'text') { 

                temp_msg = Math.abs(req.body.lvl_system_msg_del)

                if (!parseInt(temp_msg) || parseInt(temp_msg) > 180) status_setting = 4

                if (parseInt(temp_msg) == 0) status_setting = 1

                if (status_setting == 4) { status_setting = 4 } else {

                    lvl_system = 1
                    if (!req.body.lvl_system) lvl_system = 0

                    var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
                    if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);
                    con.query(`UPDATE server SET lvl_system_msg_del = ${temp_msg}, lvl_system = ${lvl_system}, lvl_system_info = '${req.body.lvl_system_info}', lvl_system_ignore_roles = ?, lvl_system_ignore_channel = ? WHERE id = '${req.query.id}'`, [JSON.stringify(req.body.lvl_system_ignore_roles), JSON.stringify(req.body.lvl_system_ignore_channel)]);
                    status_setting = 1

                }
            }

        } else {
            status_setting = 2
        }

    }

    //Отправка Embed

    if (req.query.page == 'myserver' && req.query.setting == 'embed_generator' && status_setting == 0) {

        function fields_list(fields_name, fields_value, fields_inline) {
            fields_arrya = []
        
            if (fields_name.length > fields_value.length) a_i = fields_name.length; else a_i = fields_value.length;
            
            for (let i = 0, row_i = 1; i < a_i; i++) {
                if(fields_name[i].length !== 0 && fields_value[i].length !== 0) {
                    name = fields_name[i]
                    inline = false
                    if (fields_inline) if (fields_inline.indexOf(`row${row_i}`) !== -1) inline = true
                    fields_arrya.push({name: fields_value[i], value: fields_value[i], inline})
                }
                row_i++
            }
            
            return fields_arrya
        }

        //console.log(req.body)

        channel_select = discord.guilds.get(req.query.id).channels.get(req.body.channel)

        if (!channel_select) { 
            status_setting = 2  
        } else {
            if (channel_select.type == 'text') {

                fields = fields_list(req.body.fields_name, req.body.fields_value, req.body.fields_inline)

                color_embed = client.hexToDec(req.body.setColor.replace('#', ''))

                if (!color_embed) color_embed = 6973869

                embed = {
                      "title": `${req.body.setTitle}`,
                      "description": `${req.body.setDescription}`,
                      "url": `${req.body.setURL}`,
                      "color": color_embed,
                      "timestamp": `${req.body.setTimestamp}`,
                      "footer": {
                        "icon_url": `${req.body.setFooterIcon}`,
                        "text": `${req.body.setFooterText}`
                      },
                      "thumbnail": {
                        "url": `${req.body.setThumbnail}`
                      },
                      "image": {
                        "url": `${req.body.setImage}`
                      },
                      "author": {
                        "name": `${req.body.setAuthorText}`,
                        "url": `${req.body.setAuthorUrl}`,
                        "icon_url": `${req.body.setAuthorIcon}`
                      },
                      "fields": fields
                  };

                channel_select.send(req.body.content, {embed})

                status_setting = 5
            } else { status_setting = 3 }
        }
    }

    //Войс канал

    if (req.query.page == 'myserver' && req.query.setting == 'voice' && status_setting == 0) {

        channel_select = discord.guilds.get(req.query.id).channels.get(req.body.channel)
        if (!channel_select && req.body.channel !== '0') { status_setting = 2 } else {

            if(req.body.channel == '0') {channel_select = []; channel_select.type = 'voice'; var voice_create_to_bd = null; } else { var voice_create_to_bd = req.body.channel;}

            if (channel_select.type == 'voice') { 

                voice_owner_permission = 1
                if (!req.body.voice_owner_permission) voice_owner_permission = 0

                var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
                if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);
                con.query(`UPDATE server SET voice_owner_permission = ${voice_owner_permission}, voice_role = '${req.body.voice_role}', voice_create = '${voice_create_to_bd}', voice_create_roles = ? WHERE id = '${req.query.id}'`, [JSON.stringify(req.body.roles_voice_create)]);
                status_setting = 1
            }
        }
    }

    //Настройка - модерация

    if (req.query.page == 'myserver' && req.query.setting == 'moderation' && status_setting == 0) {

        if (!Math.abs(req.body.moderation_maxwarn_ban_count)) {
            status_setting = 6
        } else {

            moderation_antiInvite = 1
            if (!req.body.moderation_antiInvite) moderation_antiInvite = 0
            
            moderation_warn = 1
            if (!req.body.moderation_warn) moderation_warn = 0
            
            var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
            if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);
            
            con.query(`UPDATE server SET moderation_antiInvite = ${moderation_antiInvite}, moderation_warn = ${moderation_warn}, moderation_maxwarn_ban_count = ${req.body.moderation_maxwarn_ban_count} WHERE id = '${req.query.id}'`);
            status_setting = 1

        }
    }

    //Авто роль

    if (req.query.page == 'myserver' && req.query.setting == 'auto_role' && status_setting == 0) {

        var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
        if(server_setting.res.length == 0) await con.query(`INSERT INTO server (id) VALUES ('${req.query.id}')`);


        con.query(`UPDATE server SET auto_role = ? WHERE id = '${req.query.id}'`, [JSON.stringify(req.body.roles_auto_add)]);
        status_setting = 1


    }

    res.redirect(`/profile?page=${req.query.page}&id=${req.query.id}&setting=${req.query.setting}&status=${status_setting}`);
    //res.redirect('back')
}

module.exports.path = '/profile';