module.exports = (client, guild) => {

client.con.query(`SELECT * FROM server WHERE id=${guild.id}`, function (err, result) {
    if (err) throw err;
    if(result.length == 0) return client.con.query(`INSERT INTO server (id) VALUES ('${guild.id}')`);
});

};