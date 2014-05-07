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
      console.log("forward");
    });

    socket.on("back", function(data) {
      console.log("back");
    });

    socket.on("left", function(data) {
      console.log("left");
    });

    socket.on("right", function(data) {
      console.log("right");
    });

    socket.on("faster", function(data) {
      console.log("faster");
    });

    socket.on("slower", function(data) {
      console.log("slower");
    });

    socket.on("stop", function(data) {
      console.log("stop");
    });
  });
};
