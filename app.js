
/**
 * Module dependencies.
 */

var express = require('express'),
    http    = require('http'),
    path    = require('path'),
    xtpl    = require('midway-xtpl'),
    routes  = require('./routes'),
    nobuc = require('nobuc');

var app = express();

app.set('port', process.env.PORT || 3000);

// 配置渲染引擎
xtpl.initExpress(app, {
    path    : path.join(__dirname, 'views'),
    extname : 'html',
    cache   : false
});

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(nobuc({
    //env: "development|production",
    env: "development",
    appname: "eureka",
    key: "buc_user" // 用户信息在req对象中的key，默认："buc_user"
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// 添加路由配置
routes(app);

http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
    console.log('Express server listening on port ' + app.get('port'));
});
