/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var engine = require('ejs-locals');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var user = require('./routes/user');
app.post('/user/list', user.list);
app.post('/user/add', user.add);
app.post('/user/load/:id', user.load);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
