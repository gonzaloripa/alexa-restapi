// app.js: for configuring the app
var express = require('express');
var app = express();
var db = require('./db');
const aws = require('aws-sdk'); 
aws.config.region = 'us-east-1';
var UserController = require('./user/UserController');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);
app.use('/users', UserController); //La ruta "/" del userController mapea con la ruta "/users"


module.exports = app;