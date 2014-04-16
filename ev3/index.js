/*!
 * # ev3 api
 * @author yanmu.wj@taobao.com
 * @date 2014-04-11
 */

/*!*/

var robot,
    // tow motos
    MOTOS = {
      left: "a"
      ,right: "d"
    };

/**
 * ev3-node
 */
/**
 * var EV3Robot = require('./ev3-node/EV3Robot.js');
 * var robot = new EV3Robot.Robot();
 */

/**
 * ev3-nodejs-bt
 */
var Ev3 = require ("./ev3-nodejs-bt/Ev3.js");
var Ev3_base = Ev3.base;

function motoArgs(speeds) {
  var args = [0, 0, 0, 0],
      speeds = speeds || {};
  for (var k in MOTOS) {
    switch (MOTOS[k]) {
      case "a":
        args[0] = speeds.left || 0;
        break;
      case "d":
        args[3] = speeds.right || 0;
        break;
      default:
        break;
    }
  }

  return args;
}

exports.move = function(options) {
  var options = options || {};
  var output = robot.getOutputSequence.apply(robot, motoArgs(options));
  robot.sp.write(output, function(){
  });
};

/**
 * turnLeft
 *
 * 向左转
 *
 * @param {Numbe} speed
 * @return
 */
exports.turnLeft = function(speed) {
  exports.move({left: speed, right: speed/2});
};

/**
 * turnRight
 *
 * 向左转
 *
 * @param {Numbe} speed
 * @return
 */
exports.turnRight = function(speed) {
  exports.move({left: speed/2, right: speed});
};

/**
 * move2left
 *
 * 向左移动
 *
 * @param {Numbe} speed
 * @return
 */
exports.move2left = function(speed) {
};

/**
 * move2right
 *
 * 向右移动
 *
 * @param speed
 * @return
 */
exports.move2right = function(speed) {
};

/**
 * move2forward
 *
 * 向前移动
 *
 * @param {Numbe} speed
 * @return
 */
exports.move2forward = function(speed) {
  exports.move({left: speed, right: speed});
};

/**
 * move2back
 *
 * 向后移动
 *
 * @param {Numbe} speed
 * @return
 */
exports.move2back = function(speed) {
  exports.move({left: 0 - speed, right: 0 - speed});
};

exports.stopMove = function() {
  exports.move({left: 0, right: 0});
};

/**
 * playSound
 *
 * 播放音频
 *
 * @param {Sring} sound
 * @param {Number} volumn
 * @param {Number} duration
 * @return
 */
exports.playSound = function(sound, volumn, duration) {
  /**
   * robot.sp.write(new Buffer("11001A008000009401810A835B020000822C01", "hex"), function() {
   * });
   */
	robot.playTone(10, Math.floor(Math.random()*(1000-100+1)+100), 300);
  process.stdout.write("playsound...");
};

exports.stopAll = function() {
  
};

/**
 * display
 *
 * 屏幕显示
 *
 * @return
 */
exports.display = function() {
  
};

exports.disconnect = function() {
  robot && robot.disconnect();
};

exports.touch = function(callback) {
  robot.registerSensorListener(1, function(ret){
    if (!!ret) callback.call(robot);
  });
};

exports.watch = function(callback) {
  if (!robot) return;
  
  robot.start_program(function() {
    robot.registerSensor(2, robot.S_TYPE_COLOR, robot.SM_COL_COLOR);
    robot.registerSensorListener(2, function(ret){
      switch (ret) {
        case Ev3.COL_BLACK:
          ret = "black";
          break;
        case Ev3.COL_YELLOW:
          ret = "yellow";
          break;
        case Ev3.COL_BLUE:
          ret = "blue";
          break;
        case Ev3.COL_GREEN:
          ret = "green";
          break;
        case Ev3.COL_RED:
          ret = "red";
          break;
        case Ev3.COL_WHITE:
          ret = "white";
          break;
        case Ev3.COL_BROWN:
          ret = "brown";
          break;
        default:
          ret = null;
          break;
      }

      if (!!ret) callback.call(robot, ret);
    }); 
  }); 

};

// all invoke must defined in connect callbak
exports.connect = function(callback) {
  // put your bluetooth socket.
  robot = new Ev3_base("/dev/tty.EV3-SerialPort");

  robot.connect(function(){
    //uncomment for motor sample
    robot.start_program(callback); 

    // register port 1 ignore color sensor exception
    robot.registerSensor(1, robot.S_TYPE_TOUCH,0);

    //robot.start_program(function(){}); 
  });

};
