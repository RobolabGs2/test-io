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
var User = /** @class */ (function () {
    function User(x, y) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad";
    }
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
        context.strokeStyle = users[i].color.to_string();
        context.strokeRect(users[i].x, users[i].y, 5, 5);
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
    return Keyboard;
}());
var keys = new Keyboard();
var pressed = false;
var speed = 3;
var hitbox = 2 * speed + 10;
setInterval(function () {
    if (keys.down) {
        user.y += speed;
    }
    if (keys.up) {
        user.y -= speed;
    }
    if (keys.right) {
        user.x += speed;
    }
    if (keys.left) {
        user.x -= speed;
    }
    if (keys.clone) {
        users.push(user.clone());
    }
}, 10);
window.addEventListener("keydown", function (ev) {
    switch (ev.key) {
        case 'w':
            keys.up = true;
            break;
        case 's':
            keys.down = true;
            break;
        case 'a':
            keys.left = true;
            break;
        case 'd':
            keys.right = true;
            break;
        case 'e':
            keys.clone = true;
            break;
    }
});
window.addEventListener("keyup", function (ev) {
    switch (ev.key) {
        case 'w':
            keys.up = false;
            break;
        case 's':
            keys.down = false;
            break;
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
        case 'e':
            keys.clone = false;
            break;
    }
});
