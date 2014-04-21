/*!
 * # 
 @author yanmu.wj@taobao.com
 * @date 2014-04-21
 */

/*!*/

var sockets = {};

module.exports = function(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    console.log("socket.io connected...");

    socket.on("forward", function(data) {
    });

    socket.on("back", function(data) {
    });

    socket.on("left", function(data) {
    });

    socket.on("right", function(data) {
    });

    socket.on("faster", function(data) {
    });

    socket.on("slower", function(data) {
    });

    socket.on("stop", function(data) {
    });
  });
};
