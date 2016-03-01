var dualShock = require('dualshock-controller')();

dualShock.on('dpadUp:press', function () {
    //right_wheel.forward(100);
    //left_wheel.forward(100);
    console.log('d pad up');
});

dualShock.on('left:move', function(data) {
    //...doStuff();
    console.log('left: ')
    console.log(data);
});

dualShock.on('right:move', function(data) {
    //...doStuff();
    console.log('right: ');
    console.log(data);
});