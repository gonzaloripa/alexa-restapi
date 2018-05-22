// db.js:conectamos la base con el servidor

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI_BLACK, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + process.env.MONGODB_URI_BLACK + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + process.env.MONGODB_URI_BLACK);
  }
});


