'use strict';

var VirtualSerialPort = require('udp-serial').SerialPort;
var firmata = require('firmata');
var five = require("johnny-five");

//var keypress = require('keypress');
var dualShock = require('dualshock-controller')();
//keypress(process.stdin);

//create the udp serialport and specify the host and port to connect to
var sp = new VirtualSerialPort({
  host: '192.168.0.115',
  type: 'udp4',
  port: 1025
});

//use the serial port to send a command to a remote firmata(arduino) device
var io = new firmata.Board(sp);
io.once('ready', function(){
    console.log('IO Ready');
    io.isReady = true;

    var board = new five.Board({io: io, repl: true});
    

    board.on('ready', function(){
        dualShock.connect();
        console.log('five ready');
        //Full Johnny-Five support here:
       
        var left_wheel = new five.Motor({ 
            pins: {
                pwm: 9,
                dir: 2
            },
            invertPWM: true 
        });

        var right_wheel = new five.Motor({ 
            pins: {
                pwm: 10,
                dir: 7
            },
            invertPWM: true 
        });

        board.repl.inject({
          motor1: left_wheel,
          motor2: right_wheel
        });

        var upperThreshold = 125;
        var downThreshold = 105;
        var leftThreshold = 110;
        var rightThreshold = 140;

        dualShock.on('left:move', function(data) {
            //...doStuff();
            console.log('left: ')
            console.log(data);

            if (data.y > downThreshold && data.y < upperThreshold) // stop
            {
                left_wheel.stop();
                right_wheel.stop();
            }
            else if (data.y < downThreshold) // move forward
            {
                var leftWheelSpeed = 250;
                var rightWheelSpeed = 250;
                if(data.x > leftThreshold && data.x < rightThreshold)
                {
                    leftWheelSpeed = leftWheelSpeed - data.y;
                    rightWheelSpeed = rightWheelSpeed - data.y;
                } else if (data.x < leftThreshold)
                {
                    leftWheelSpeed = leftWheelSpeed - data.y - (leftThreshold - data.x);
                    rightWheelSpeed = rightWheelSpeed - data.y + (leftThreshold - data.x)
                } else if (data.x > rightThreshold)
                {
                    leftWheelSpeed = leftWheelSpeed - data.y + (data.x - rightThreshold);
                    rightWheelSpeed = rightWheelSpeed - data.y - (data.x - rightThreshold)
                }
                left_wheel.forward(leftWheelSpeed);
                right_wheel.forward(rightWheelSpeed);
            } else if (data.y > upperThreshold) // move backwards
            {
                left_wheel.reverse(data.y);
                right_wheel.reverse(data.y);
            }
        });        

        dualShock.on('square:press', function (data) {
            left_wheel.stop();
            right_wheel.stop();
        });

        // process.stdin.resume(); 
        // process.stdin.setEncoding('utf8'); 
        // process.stdin.setRawMode(true); 



        // process.stdin.on('keypress', function (ch, key) {

        //     if ( !key ) return;

        //     if ( key.name == 'q' ) {
        //         console.log('Quitting');
        //         process.exit();
        //     } else if ( key.name == 'up' ) {

        //         console.log('reverse');
        //         left_wheel.forward(250);
        //         right_wheel.forward(250);

        //     } else if ( key.name == 'down' ) {

        //         console.log('Reversing');
        //         left_wheel.reverse(150);
        //         right_wheel.reverse(150);    

        //     } else if ( key.name == 'left' ) {

        //         console.log('Left');
        //         left_wheel.reverse(100);
        //         right_wheel.forward(100);

        //     } else if ( key.name == 'right' ) {

        //         console.log('Right');
        //         right_wheel.reverse(100);
        //         left_wheel.forward(100);

        //     } else if ( key.name == 'space' ) {

        //         console.log('Stopping');
        //         left_wheel.stop();
        //         right_wheel.stop();
        //     } else if ( key.name == 'r' ) {

        //         console.log('right_wheel');
        //         right_wheel.forward(100);
        //     } else if ( key.name == 'l' ) {

        //         console.log('left_wheel');
        //         left_wheel.forward(100);
        //     }

        // });



    });
});