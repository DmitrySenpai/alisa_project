// подключение библиотек
const 
    express = require('express'),
    session = require('express-session'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fileUpload = require('express-fileupload'),
    func = require("./func");
    hexToDec = require('hex-to-dec');
    config = require("./config.json");
    Entities = require('html-entities').AllHtmlEntities;


let con = require('mysql2').createConnection({host: config.mysql_host, user: config.mysql_user, password: config.mysql_password, database: config.mysql_database, port: config.mysql_port, charset: config.mysql_charset});
con.on('error', (err) => { console.warn(err) });
con.connect(() => {console.log(`{DB Connected} (ID:${con.threadId})`);});
require('mysql-utilities').upgrade(con);
require('mysql-utilities').introspection(con);

Discord = require('discord.js'),
client = new Discord.Client();
client.entities = new Entities();
client.hexToDec = hexToDec;
client.promise = require('./promise');
client.userLib = new func(Discord, client, con);

// Основной функционал ejs
app.set("view engine", "ejs");

//подключение стилей, картинок и тому подобное
app.use(express.static(__dirname + '/public'));

// юзаем body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// fileUpload module
app.use(fileUpload());

// session
app.use(session({
  secret : 'extyan_mega_secret',
  name : 'sessionId',
  resave: true,
  saveUninitialized: true
 })
);

require('./router')(app);

// ошибки
app.use((req, res, next) => {
  res.status(404).send('404!');
});

http.listen(config.siteweb_port, () => console.log(`Work on port :${config.siteweb_port}`));

client.login(config.bot_token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// сокеты
io.sockets.on('connection', (socket) => {

});

module.exports = app;
