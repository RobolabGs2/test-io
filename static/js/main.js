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
    timerDraw = setInterval(world.draw.bind(world), 15);
    let user = world.user;
    let textures = [
        user.avatar.texture,
        new FillRectangleTexture(new Color(255, 255, 255, 12)),
        new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
        new StrokeRectangleTexture(new Color(126, 63, 32)),
        new ImageTexture("duck16x16.png")
    ];
    let tick = (dt) => {
        let step = 100;
        let dv = new Point({});
        if (keys.down) {
            dv.y += step;
        }
        if (keys.up) {
            dv.y -= step;
        }
        if (keys.right) {
            dv.x += step;
        }
        if (keys.left) {
            dv.x -= step;
        }
        user.body.setAcceleration(dv);
        if (keys.clone) {
            world.pushDrawable(new Entity(new Avatar(textures[getRandomInt(0, textures.length - 1)]), world.physics.createBody(new Hitbox(user.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 33, 33), new Point({}), true)));
            keys.clone = false;
        }
        world.tick(dt / 1000);
    };
    let prev_time = Date.now();
    timerTick = setInterval(() => {
        let time = Date.now();
        tick(time - prev_time);
        prev_time = time;
    });
}
loadWorld("test-world-anim.json", start);
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
