// db.js:conectamos la base con el servidor

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_BLACK_URI, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + process.env.MONGOLAB_BLACK_URI + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + process.env.MONGOLAB_BLACK_URI);
  }
});


