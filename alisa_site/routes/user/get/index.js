module.exports.func = (discord, con, promise, req, res) => {
    res.render('/home/dmitryfiles/site_soviet/new_site_5/views/index.ejs', {
        user: req.session.user
    });
    //console.log(req.session.user)
}

module.exports.path = '/';
