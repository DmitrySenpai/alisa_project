module.exports = function (Discord, client, con) {
    this.discord = Discord;
    this.db = con;
    this.promise = require('./promise');
}