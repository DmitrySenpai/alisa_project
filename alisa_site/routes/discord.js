config = require("../config.json");
    const { clientId, clientSecret, scopes, redirectUri } = {
        'clientId': config.clientId,
        'clientSecret': config.clientSecret,
        'scopes': config.scopes,
        'redirectUri': config.redirectUri
    },
    router = require('express').Router(),
    request = require('request-promise');

const forceAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}

router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/');

    const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join('%20')}`;
    res.redirect(authorizeUrl);
});

router.get('/callback', async (req, res) => {
    if (req.session.user) return res.redirect('/');

    const accessCode = req.query.code;
    if (!accessCode) throw new Error('No access code returned frm Discord');

    const result = await request({
        uri: 'https://discordapp.com/api/v6/oauth2/token',
        method: 'POST',
        form: {
            'client_id': clientId,
            'client_secret': clientSecret,
            'grant_type': 'authorization_code',
            'code': accessCode,
            'redirect_uri': redirectUri,
            'scope': scopes.join(' ')
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    })

    let user = await request({
        uri: 'https://discordapp.com/api/v6/users/@me',
        headers: {
            'Authorization': `Bearer ${result.access_token}`
        },
        json: true
    })
    user.tag = `${user.username}#${user.discriminator}`;
    user.avatarURL = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048` : null;

    const userGuilds = await request({
        uri: 'https://discordapp.com/api/users/@me/guilds',
        headers: {
            'Authorization': `Bearer ${result.access_token}`
        },
        json: true
    });
    user.guilds = userGuilds;

    user.token = result.access_token;

    req.session.user = user;

    client.userLib.db.query('INSERT INTO account (id) VALUES (?) ON DUPLICATE KEY UPDATE avatar = ?', [req.session.user.id, req.session.user.avatarURL]);
    return res.redirect('/profile');
});

router.get('/logout', forceAuth, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
