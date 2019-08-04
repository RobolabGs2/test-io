"use strict";
console.log("Start!");
let keys = new Keyboard();
let speed = 48; //px/second todo move to user or physics?
let speed_input = document.getElementById("speed");
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value;
});
window.addEventListener("keydown", (ev) => {
    keys.set(ev.code, true);
});
window.addEventListener("keyup", (ev) => {
    keys.set(ev.code, false);
});
let canvas = document.getElementById('main');
let context = canvas.getContext('2d');
let timerTick;
let timerDraw;
let currentWorld;
function start(world) {
    try {
        clearInterval(timerDraw);
        clearInterval(timerTick);
    }
    catch (e) {
        console.log(e);
    }
    currentWorld = world;
    world.setContext(context);
    timerDraw = setInterval(world.draw.bind(world), 40);
    let user = world.user;
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
    timerTick = setInterval(() => {
        let time = Date.now();
        tick(time - prev_time);
        prev_time = time;
    });
}
loadWorld("test-world.json", start);
let sb = document.getElementById("save");
let lb = document.getElementById("load");
let saveInput = document.getElementById("saveNum");
sb.onclick = () => {
    if (currentWorld)
        saveLocal(saveInput.value, currentWorld);
    sb.blur();
    canvas.focus();
};
lb.onclick = () => {
    start(loadLocal(saveInput.value));
    lb.blur();
    canvas.focus();
};
