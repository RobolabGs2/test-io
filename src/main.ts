console.log("Start!")

let keys = new Keyboard(); 
let speed = 48; //px/second todo move to user or physics?
let speed_input = document.getElementById("speed") as HTMLInputElement;
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value as unknown as number
})
window.addEventListener("keydown", (ev:KeyboardEvent)=>{
    keys.set(ev.code, true);
});
window.addEventListener("keyup", (ev:KeyboardEvent)=>{
    keys.set(ev.code, false);
});

let canvas = document.getElementById('main') as HTMLCanvasElement;
let context = canvas.getContext('2d') as CanvasRenderingContext2D;
let timerTick: number;
let timerDraw: number;
let currentWorld: World;
function start(world: World) {
    try {
        clearInterval(timerDraw)
        clearInterval(timerTick)
    } catch(e) {
        console.log(e);
    }
    currentWorld = world;
    world.setContext(context);
    timerDraw = setInterval(world.draw.bind(world), 40);
    let user = world.user;
    let tick = (dt: number) => {
        let step = 100;
        let dv = new Point({});
        if(keys.down) {
            dv.y += step;
        }
        if(keys.up) {
            dv.y -= step;
        }
        if(keys.right) {
            dv.x += step;
        }
        if(keys.left) {
            dv.x -= step;
        }
        user.body.setAcceleration(dv)
        if(keys.clone) {
            world.pushDrawable(new Entity(
                new StrokeRectangleAvatar(new Color(255, 255, 255, 12)), 
                world.physics.createBody(new Hitbox(user.hitbox.position.Sum(new Point({x: 50, y: 0})), 33, 33), new Point({}), true)));
            keys.clone = false
        }
        world.tick(dt/1000);
    };
    let prev_time = Date.now();
    timerTick = setInterval(() => {
        let time = Date.now();
        tick(time - prev_time);
        prev_time = time;
    })
}


loadWorld("test-physics-world.json", start)

let sb = document.getElementById("save") as HTMLButtonElement;
let lb = document.getElementById("load") as HTMLButtonElement;

let saveInput = document.getElementById("saveNum") as HTMLInputElement;
sb.onclick = () => {
    if(currentWorld)
        saveLocal(saveInput.value, currentWorld)
    sb.blur()
    canvas.focus()
}

lb.onclick = () => {
    start(loadLocal(saveInput.value))
    lb.blur()
    canvas.focus()
}
