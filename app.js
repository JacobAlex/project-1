var express = require('express');
var http = require('http');
var midlleware = require('./middleware')(app, express);

// Init app
var app = express();

http.createServer(app).listen(config.get('port', function(){
  log.info('Express server listening on port ' + config);
}));
