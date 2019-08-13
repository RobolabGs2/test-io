"use strict";
console.log("Start!");
{
    let speed = 150; //px/second todo move to user or physics?
    let speed_input = document.getElementById("speed");
    speed_input.valueAsNumber = speed;
    speed_input.addEventListener("input", (ev) => {
        speed = speed_input.valueAsNumber;
    });
    let worldCreator = new WorldCreator();
    let canvas = document.getElementById('main');
    let camera = new Camera(canvas);
    let input = new InputDevices(camera);
    //let cursore = input.mouseCursore;
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
        //world.pushDrawable(cursore)
        let tick = (dt) => {
            world.tick(dt / 1000);
        };
        let prev_time = Date.now();
        timerTick = setInterval(() => {
            let time = Date.now();
            tick(time - prev_time);
            prev_time = time;
        });
        timerDraw = setInterval(world.draw.bind(world), 15);
    }
    worldCreator.loadWorld("world1", start);
    let sb = document.getElementById("save");
    let lb = document.getElementById("load");
    let saveInput = document.getElementById("saveNum");
    sb.onclick = () => {
        if (currentWorld)
            worldCreator.saveLocal(saveInput.value, currentWorld);
        sb.blur();
        canvas.focus();
    };
    lb.onclick = () => {
        //start(worldCreator.loadLocal(saveInput.value))
        lb.blur();
        canvas.focus();
    };
}
