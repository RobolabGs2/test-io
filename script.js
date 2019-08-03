"use strict";
console.log("Watch!");
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    Color.prototype.to_string = function () {
        return "#008000";
    };
    return Color;
}());
var duck = new Image();
var duck_image;
duck.onload = function () {
    // Cut out two sprites from the sprite sheet
    createImageBitmap(duck).then(function (bitmap) { return duck_image = bitmap; });
};
// Load the sprite sheet from an image file
duck.src = 'duck16x16.png';
var User = /** @class */ (function () {
    function User(x, y) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad";
        this.navigation = "right";
    }
    User.prototype.draw = function (context) {
        context.drawImage(duck_image, this.x, this.y, 32, 32);
    };
    User.prototype.clone = function () {
        return new User(this.x, this.y);
    };
    return User;
}());
//let id = localStorage.getItem("id");
var user = new User(10, 20);
/*let req = new XMLHttpRequest();
if(id == null) {
    req.open('GET', '/user/new?nick=Stive');
    req.addEventListener('loadend', () => {
        user = JSON.parse(req.responseText) as User;
        localStorage.setItem('id', user.id);
    });
} else {
    req.open('GET', '/user/get?id='+id);
    req.addEventListener('loadend', () => {
        user = JSON.parse(req.responseText) as User;
    });
}
req.send();
*/
var canvas = document.getElementById('main');
var context = canvas.getContext('2d');
var users = new Array();
users.push(user);
setInterval(function () {
    context.fillStyle = "#000";
    context.fillRect(0, 0, 512, 512);
    //    context.clearRect(0, 0, 512, 512);
    for (var i = 0; i < users.length; ++i) {
        //context.strokeStyle = users[i].color.to_string();
        //context.strokeRect(users[i].x, users[i].y, 5, 5);
        users[i].draw(context);
    }
}, 40);
var Keyboard = /** @class */ (function () {
    function Keyboard() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.clone = false;
    }
    Keyboard.prototype.set = function (code, state) {
        switch (code) {
            case 'KeyW':
                keys.up = state;
                break;
            case 'KeyS':
                keys.down = state;
                break;
            case 'KeyA':
                keys.left = state;
                break;
            case 'KeyD':
                keys.right = state;
                break;
            case 'Space':
                keys.clone = state;
                break;
        }
    };
    return Keyboard;
}());
var keys = new Keyboard();
var pressed = false;
var speed = 48; //px/second
var speed_input = document.getElementById("speed");
speed_input.addEventListener("input", function (ev) {
    speed = speed_input.value;
});
var hitbox = 2 * speed + 10;
var prev_time = 0;
var tick = function (time) {
    //setInterval(() => {
    console.log(time - prev_time);
    var step = speed * (time - prev_time) / 1000;
    prev_time = time;
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
        users.push(user.clone());
        console.log(users.length);
        keys.clone = false;
    }
    requestAnimationFrame(tick);
    //}, 10);
};
tick(0);
window.addEventListener("keydown", function (ev) {
    keys.set(ev.code, true);
});
window.addEventListener("keyup", function (ev) {
    keys.set(ev.code, false);
});
