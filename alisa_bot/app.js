const Discord = require('discord.js'),
  client = new Discord.Client(),
  Enmap = require("enmap"),
  fs = require("fs");
  func = require("./func");
client.discord = Discord;
client.req = require('request');
client.fs = fs;
config = require("./config.json");
promise = require("./promise");
client.promise = promise;
client.soundcloud = "soundcloud_toekn";
console.log(`Библиотеки подключены!\n`);


let con = require('mysql2').createConnection({host: config.mysql_host, user: config.mysql_user, password: config.mysql_password, database: config.mysql_database, port: config.mysql_port, charset: config.mysql_charset});
con.on('error', (err) => { console.warn(err) });
con.connect(() => {console.log(`{DB Connected} (ID:${con.threadId})`);});
require('mysql-utilities').upgrade(con);
require('mysql-utilities').introspection(con);

client.con = con;

//Остаток времени

var timeleft = function(time_left, endtime) {
  if (endtime) time_left = endtime - Math.floor(new Date() / 1000)
  if (time_left > 0) {
    days = Math.floor(time_left / 86400)
    time_left = time_left - days * 86400
    hours = Math.floor(time_left / 3600)
    time_left = time_left - hours * 3600
    minutes = Math.floor(time_left / 60)
    seconds = time_left - minutes * 60
  } else {
    return 0
  }
  return `${hours} часов, ${minutes} минут, ${seconds} секунд`
}
client.timeleft = timeleft

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  let counter = files.length;
  let counteris = 0;
  files.forEach(file => {
    counteris++;
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  let counter = files.length;
  let counteris = 0;
  files.forEach(file => {
    counteris++;
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

client.login(config.bot_token); //Mega




//const {RSSWatcher} = require('./rss')
//const rssSystem = new RSSWatcher(['https://habr.com/ru/rss/all/all/'], 10)
//rssSystem.on('feedUpdate', (chnl, feed) => {
//  console.log(chnl, feed)
//})
//rssSystem.watch()