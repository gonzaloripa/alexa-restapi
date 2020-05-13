// Configuracion del server

var express = require('express');
var app = express();
var db = require('./db');
var session = require("express-session")

var UserController = require('./user/UserController');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(session({
	'secret': 'tesis2019'
}))
app.use(allowCrossDomain);
app.use('/users', UserController);


module.exports = app;