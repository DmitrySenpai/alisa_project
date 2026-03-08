module.exports = (app) => {
    // '/'
    app.use('/', require('./routes/user/index'));
  
    // '/login'
    app.use('/login', require('./routes/discord'));

    app.use('/logout', require('./routes/logout'));

}