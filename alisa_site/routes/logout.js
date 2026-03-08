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

router.get('/',  (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
