var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

var date1 = 0;
var date2 = 0;
var accelPitch1;
var accelPitch2;

robot.moveMouse(screenWidth/2, screenHeight/2);

board.on("ready", function() {
  var imu = new five.IMU({
      controller: "MPU6050"
    });
    var accelerometerE = new five.Accelerometer({
      controller: "ADXL335",
      pins: ["A0", "A1", "A2"]
    });
    var accelerometerD = new five.Accelerometer({
      controller: "ADXL335",
      pins: ["A3", "A6", "A7"]
    });

  imu.on("change", function() {

    var acc = this.accelerometer.acceleration*10;
    var acc_x = ((this.accelerometer.y + 0.035)*100);
    var acc_y = (this.accelerometer.x*100);

    date1 = date2;
    date2 = new Date().getSeconds() + new Date().getMilliseconds()*0.001;

    var dx = acc_x * Math.pow(date2 - date1, 2) * 100;
    var dy = acc_y * Math.pow(date2 - date1, 2) * -100;

    dx = (dx*(screenWidth/2))/10;
    dy = (dy*(screenHeight/2))/10;

    if (acc > 10) {
      robot.moveMouse(robot.getMousePos().x+dx, robot.getMousePos().y+dy);
    }

  });
var click = false;
  accelerometerE.on("change", function() {
    accelPitch1 = this.pitch;
    if (accelPitch1<10) {
      robot.mouseClick("left",false);
    }
    if (accelPitch1>30 && click == false) {
      robot.mouseToggle("down","left");
      click = true;
    }
    if (accelPitch1<30 && click == true) {
      robot.mouseToggle("up","left");
      click = false;
    }
    console.log(accelPitch1);
  });

  accelerometerD.on("change", function() {
    accelPitch2 = this.pitch;
    if (accelPitch2<10) {
      robot.mouseClick("right",false);
    }
    if (accelPitch2>30 && click == false) {
      robot.mouseToggle("down","right");
      click = true;
    }
    if (accelPitch2<30 && click == true) {
      robot.mouseToggle("up","right");
      click = false;
    }
    console.log(accelPitch2);/
  });
});
