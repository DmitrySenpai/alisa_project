module.exports.func = async(discord, con, promise, req, res) => {

    //discord.channels.get('581439266203107339').send('TEST')
    //console.log(discord.users.get("448911670375481344"))

    if (!req.session.user) return res.redirect('/login');

    function get_page_name(str) { fs = require('fs'); if (!str) { return 'index' } else { if (!fs.existsSync(`./views/profile/${str}.ejs`)) return '404'; return str } }

    function page_setting_server(id, page, user, discord) {
        if (!discord.guilds.get(id)) return `myserver/406.ejs`
        if (!discord.guilds.get(id).member(user).hasPermission("ADMINISTRATOR")) return `myserver/405.ejs`
        //if (req.session.user.guilds.find(r => r.id === id).owner == false) return "Ошибка! Вы не Owner этого сервера!"

        if (!page) { str_page = 'home' } else { 
            if (!fs.existsSync(`./views/profile/myserver/${page}.ejs`)) {
                str_page = '404'
            } else { 
                str_page = page 
            } }

        return `myserver/${str_page.replace('../', '').replace('/', '')}.ejs`
    }

    function gulids_server_get(gulids, id) {
        if (!id) return 'nulled'
        servergulids = gulids.find(r => r.id === id)
        return servergulids
    }

    function gulids_server_avatar(id, icon) {
        if (!icon) return 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
        return `https://cdn.discordapp.com/icons/${id}/${icon}.png`
    }

    function text_status_setting(id) {
        text = {
            0: "Ошибка! У вас недостаточно прав!",
            1: "Информация сохранена!",
            2: "Ошибка! Такого канала нет или недостаточно прав для бота Алисы!",
            3: "Ошибка! Неверный тип канала!",
            4: "Ошибка! Привышен лимит или неверный формат в разделе 'Время на удление'!",
            5: "Embed отправлен!",
            6: "Ошибка! Неверный формат в разделе 'Отправить в бан при максимальном количестве WARN'",
            7: "Ошибка! Неверный тип канала!"
        }
        return text[id]
    }


    if(req.query.page == "myserver" || req.query.id) {
        var server_setting = await promise(con, con.query, `SELECT * FROM server WHERE id= ?`, [req.query.id]);
    } else {
        var server_setting = '';
    }

    res.render(`./profile/${get_page_name(req.query.page).replace('../', '').replace('/', '')}.ejs`, {
        user: req.session.user,
        page_setting_server: page_setting_server,
        req: req,
        gulids_server_get: gulids_server_get,
        gulids_server_avatar: gulids_server_avatar,
        text_status_setting: text_status_setting,
        con: con,
        discord: discord,
        promise: promise,
        server_setting: server_setting
    });
}

module.exports.path = '/profile';
