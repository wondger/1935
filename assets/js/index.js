var Hapi = require('hapi');

var server = Hapi.createServer('localhost', 8080);

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply('Hello world!');
    }
});

server.start();
