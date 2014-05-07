var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            break;
        case '/socket':
            console.log('socket');
            break;
        default:
            console.log('default');
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            break;
    }
    response.end();
});

server.listen(8001);

io.listen(server);
