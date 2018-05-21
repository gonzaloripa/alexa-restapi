// db.js:conectamos la base con el servidor

var mongoose = require('mongoose');
var connection = mongoose.createConnection(process.env.MONGODB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!')
});

module.exports = connection;