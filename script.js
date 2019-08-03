"use strict";
console.log("Start!");
var user = new User(10, 20);
var duck = new Image();
duck.onload = function () {
    createImageBitmap(duck).then(function (bitmap) { return user.bitmap = bitmap; });
};
// Load the sprite sheet from an image file
duck.src = 'duck16x16.png';
var canvas = document.getElementById('main');
var context = canvas.getContext('2d');
var world = new World(user);
//отрисовка
setInterval(world.draw.bind(world, context), 40);
var keys = new Keyboard();
var speed = 48; //px/second todo move to user
var speed_input = document.getElementById("speed");
speed_input.addEventListener("input", function (ev) {
    speed = speed_input.value;
});
var hitbox = 2 * speed + 10;
var prev_time = Date.now();
var tick = function (dt) {
    var step = speed * (dt) / 1000;
    if (keys.down) {
        user.y += step;
    }
    if (keys.up) {
        user.y -= step;
    }
    if (keys.right) {
        user.x += step;
    }
    if (keys.left) {
        user.x -= step;
    }
    if (keys.clone) {
        world.mobs.push(user.clone());
        keys.clone = false;
    }
};
setInterval(function () {
    var time = Date.now();
    tick(time - prev_time);
    prev_time = time;
});
window.addEventListener("keydown", function (ev) {
    keys.set(ev.code, true);
});
window.addEventListener("keyup", function (ev) {
    keys.set(ev.code, false);
});
