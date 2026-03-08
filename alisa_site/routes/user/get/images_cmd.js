module.exports.func = (discord, con, promise, req, res) => {
    var fs = require('fs')
    var results = [];

    if (!req.query.i) return res.send('')

    fs.readdir(`./public/images_cmd/${req.query.i.replace(/\.\.\//g, '').replace(/\./g, '').replace(/\//g, '')}`, (err, files) => {
        if (req.query.i.replace(/\.\.\//g, '').replace(/\./g, '').replace(/\//g, '').length == 0) return res.send('')
        if (err) return res.send('')
        files.forEach(file => {
          results.push(file);
        });
        res.send(results)
      });
}

module.exports.path = '/images_cmd';
