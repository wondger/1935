/*!
 * # 
 @author yanmu.wj@taobao.com
 * @date 2014-04-21
 */

/*!*/

var ev3 = require('./ev3');

var sockets = {};

module.exports = function(server) {
  var io = require('socket.io').listen(server);

  ev3.connect(function() {

    io.sockets.on('connection', function(socket) {
      console.log("socket.io connected...");

      socket.on("forward", function(data) {
        console.log("forward...");
        ev3.move2forward(10);
      });

      socket.on("back", function(data) {
        console.log("back...");
        ev3.move2back(10);
      });

      socket.on("left", function(data) {
        console.log("left...");
        ev3.turnLeft(20);
      });

      socket.on("right", function(data) {
        console.log("right...");
        ev3.turnRight(20);
      });

      socket.on("faster", function(data) {
        console.log("faster");
      });

      socket.on("slower", function(data) {
        console.log("slower");
      });

      socket.on("stop", function(data) {
        console.log("stop...");
        ev3.stopMove();
      });

      socket.on("play", function(data) {
        console.log("play...");
        ev3.playSound();
      });
    });

  });

};
