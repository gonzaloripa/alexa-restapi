// server.js
var app = require('./app');//importamos la configuracion


	var port = process.env.PORT || 8081; 
	var server = app.listen(port, function() {
  		console.log('Express server listening on port ' + port);
	});
