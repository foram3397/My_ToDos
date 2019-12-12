var express = require('express');
var validator = require('express-validator');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');


var models = require('./models');

var app = express();

app.set('views', path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json({ defaultCharset: "utf-8", limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(validator());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'my todo' }));
app.use(passport.initialize());
app.use(passport.session());

require('./passport-config')(passport, models);

require('./routes/index.js')(app, passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('error: ' + err.message);
});

module.exports = app;