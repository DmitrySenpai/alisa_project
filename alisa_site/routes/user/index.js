const router = require('express').Router(),
    fs = require('fs');

fs.readdir(__dirname + "/get", (err, files) => {
    if (err) return console.error(err);
    let counter = files.length;
    let counteris = 0;
    files.forEach(file => {
        if (!file.endsWith(".js")) return;

        try {
            const get = require(`./get/${file}`);
            router.get(get.path, get.func.bind(null, client, client.userLib.db, client.promise));
            delete require.cache[require.resolve(`./get/${file}`)];
            counteris++;
        } catch (e) { console.warn(e) }

    });
    if (counter == counteris) console.log('[SITE]: Все GET загружены!');
    else console.log(' \n');
});

fs.readdir(__dirname + "/post", (err, files) => {
    if (err) return console.error(err);
    let counter = files.length;
    let counteris = 0;
    files.forEach(file => {
        if (!file.endsWith(".js")) return;

        try {
            const post = require(`./post/${file}`);
            router.post(post.path, post.func.bind(null, client, client.userLib.db, client.promise));
            delete require.cache[require.resolve(`./post/${file}`)];
            counteris++;
        } catch (e) { console.warn(e) }

    });
    if (counter == counteris) console.log('[SITE]: Все POST загружены!');
});

//console.log('USER загружен');

module.exports = router;