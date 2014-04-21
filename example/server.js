var simple = io
    .sockets
    .on('connection', function(socket) {
        socket.on('message', function(data) {
            socket.broadcast.send(data);
        });
        socket.on('disconnect', function() {
            //handle disconnect
        });
    });
