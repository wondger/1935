
/**
 * Module dependencies.
 */

var express = require('express'),
    http    = require('http'),
    path    = require('path'),
    xtpl    = require('midway-xtpl'),
    routes  = require('./routes');

var app = express();

app.set('port', process.env.PORT || 3000);

// ≈‰÷√‰÷»æ“˝«Ê
xtpl.initExpress(app, {
    path    : path.join(__dirname, 'views'),
    extname : 'html',
    cache   : true
});

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// ÃÌº”¬∑”…≈‰÷√
routes(app);

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
    console.log('Express server listening on port ' + app.get('port'));
});