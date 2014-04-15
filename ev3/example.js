/*!
 * # 
 * @author yanmu.wj@taobao.com
 * @date 2014-04-13
 */

/*!*/

var ev3 = require('./')
var speed = 10;
var prevKey = "";
var motorKey = "";

ev3.connect(function() {
  var stdin = process.openStdin(); 
  var stdin = process.stdin;
  // without this, we would only get streams once enter is pressed
  stdin.setRawMode(true);

  // resume stdin in the parent process (node app won't quit all by itself
  // unless an error or process.exit() happens)
  stdin.resume();

  // i don't want binary, do you?
  stdin.setEncoding('utf8');

  // on any data into stdin

  stdin.on('data', function(key){
    // ctrl-c ( end of text )
    process.stdout.write(key);
    if (key === '\u0003') {
      ev3.disconnect();
      process.exit();
    }
    else if (key === ' ') {
      prevKey = key;
      speed = 0;
    }
    else if (key === "a" || key === "s" || key === "w" || key === "d") {
      speed = speed || 10;
      motorKey = key;
      prevKey = key;
    }
    else if(prevKey !== " " && key === '\u001b[A'){ //upper arrow sequence
      if(speed < 100){
        speed += 10;
      }
    }
    else if(prevKey !== " " && key === '\u001b[B'){ //down arrow sequence
      if(speed > -100){
        speed -= 10;
      }
    }

    switch (motorKey) {
      case 'a':
        // turn right
        ev3.turnRight(speed);
        break;
      case 'd':
        // turn left
        ev3.turnLeft(speed);
        break;
      case 'w':
        // move forward
        ev3.move2forward(speed);
        break;
      case 's':
        // move back
        ev3.move2back(speed);
        break;
      case ' ':
        ev3.stopMove();
        break;
      default:
        break;
    }

  	process.stdout.write(motorKey + ": " + speed + "\n");

  });

  ev3.watch(function(color) {
    console.log(color);
  });

  ev3.touch(function() {
    console.log("fuck! you touch me!");
    ev3.playSound();
  });
});

