module.exports.func = (discord, con, promise, req, res) => {
    res.render('/home/dmitryfiles/site_soviet/new_site_5/views/cmd.ejs', {
        user: req.session.user
    });
}

module.exports.path = '/cmd';
