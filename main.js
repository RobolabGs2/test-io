"use strict";
console.log("Start!");
let user = new Entity(new Hitbox(new Point({ x: 10, y: 20 }), 32, 32), new ImageAvatar("duck16x16.png"));
let canvas = document.getElementById('main');
let context = canvas.getContext('2d');
let world = new World(user).setContext(context);
world.pushDrawable(new Entity(new Hitbox(new Point({ x: 50, y: 20 }), 32, 32), new RectangleAvatar(new Color(0, 128, 0))));
world.pushDrawable(new Entity(new Hitbox(new Point({ x: 300, y: 200 }), 32, 32), new RectangleAvatar(new Color(128, 128, 0))));
world.pushDrawable(new Entity(new Hitbox(new Point({ x: 300, y: 300 }), 32, 32), new StrokeRectangleAvatar(new Color(0, 128, 0))));
world.pushDrawable(new Entity(new Hitbox(new Point({ x: 200, y: 300 }), 32, 32), new StrokeRectangleAvatar(new Color(255, 0, 128))));
world.pushDrawable(new Entity(new Hitbox(new Point({ x: 1, y: 500 }), 510, 10), new RectangleAvatar(new Color(0, 128, 128))));
//отрисовка
setInterval(world.draw.bind(world), 40);
let keys = new Keyboard();
let speed = 48; //px/second todo move to user or physics?
let speed_input = document.getElementById("speed");
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value;
});
let hitbox = 2 * speed + 10;
let prev_time = Date.now();
let tick = (dt) => {
    let step = speed * (dt) / 1000;
    if (keys.down) {
        user.hitbox.position.y += step;
    }
    if (keys.up) {
        user.hitbox.position.y -= step;
    }
    if (keys.right) {
        user.hitbox.position.x += step;
    }
    if (keys.left) {
        user.hitbox.position.x -= step;
    }
    if (keys.clone) {
        world.pushDrawable(new Entity(new Hitbox(new Point(user.hitbox.position), 33, 33), new StrokeRectangleAvatar(new Color(255, 255, 255, 12))));
        keys.clone = false;
    }
};
setInterval(() => {
    let time = Date.now();
    tick(time - prev_time);
    prev_time = time;
});
window.addEventListener("keydown", (ev) => {
    keys.set(ev.code, true);
});
window.addEventListener("keyup", (ev) => {
    keys.set(ev.code, false);
});
