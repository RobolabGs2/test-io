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
    let prev_time = Date.now();
    let tick = (dt: number) => {
        let step = speed*(dt)/1000;
        if(keys.down) {
            user.hitbox.position.y += step;
        }
        if(keys.up) {
            user.hitbox.position.y -= step;
        }
        if(keys.right) {
            user.hitbox.position.x += step;
        }
        if(keys.left) {
            user.hitbox.position.x -= step;
        }
        if(keys.clone) {
            world.pushDrawable(new Entity(new Hitbox(new Point(user.hitbox.position), 33, 33), new StrokeRectangleAvatar(new Color(255, 255, 255, 12))))
            keys.clone = false
        }
        world.tick(dt/1000);
    };
    
    timerTick = setInterval(() => {
        let time = Date.now();
        tick(time - prev_time);
        prev_time = time;
    })
}


loadWorld("test-world.json", start)

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
