module.exports = (client) => {

    client.user.setPresence({game: {name: 'sovietsoft.ru', type: 'PLAYING'}});

    console.log(`Бот авторизован как  ${client.user.tag}!`);

    //client.con.query(`SELECT * FROM server WHERE id=625379590931480576`, function (err, result) {
        //if (err) throw err;
        //if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${guild.id}')`);
        //console.log(result[0].say_bye)
   // });
}