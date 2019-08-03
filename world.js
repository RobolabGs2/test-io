"use strict";
var Color = /** @class */ (function () {
    function Color(r, g, b, a) {
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    //todo
    Color.prototype.to_string = function () {
        return "#008000";
    };
    return Color;
}());
var User = /** @class */ (function () {
    function User(x, y, bitmap) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad";
        this.navigation = "right";
        if (bitmap)
            this.bitmap = bitmap;
    }
    User.prototype.draw = function (context) {
        context.drawImage(this.bitmap, this.x, this.y, 32, 32);
    };
    User.prototype.clone = function () {
        return new User(this.x, this.y, this.bitmap);
    };
    return User;
}());
var World = /** @class */ (function () {
    function World(user) {
        this.user = user;
        this.mobs = new Array();
    }
    World.prototype.draw = function (context) {
        context.fillStyle = "#000";
        context.fillRect(0, 0, 512, 512);
        //context.clearRect(0, 0, 512, 512);
        this.mobs.forEach(function (mob) {
            mob.draw(context);
        });
        this.user.draw(context);
    };
    return World;
}());
