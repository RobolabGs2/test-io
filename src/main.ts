console.log("Start!")
{
let speed = 150; //px/second todo move to user or physics?
let speed_input = document.getElementById("speed") as HTMLInputElement;
speed_input.valueAsNumber = speed;
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.valueAsNumber
})

let canvas = document.getElementById('main') as HTMLCanvasElement;
let keys = new Keyboard(); 
let mouse = new Mouse(canvas);
let camera = new Camera(canvas);
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
    world.setCamera(camera);
    let user = world.user;
    let textures = [
        user.avatar.texture,
        new FillRectangleTexture(new Color(255, 255, 255, 12)),
        new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
        new StrokeRectangleTexture(new Color(126, 63, 32)),
        new ImageTexture("duck16x16.png")
    ];
    let tick = (dt: number) => {

        let run = 0;
        if(keys.down) {
            //dv.y += step;
        }
        if(keys.up) {
            if(Math.abs(user.body.velocity.y) < 1)
                user.body.setVelocity(new Point({x: user.body.velocity.x, y: -130}));
        }
        if(keys.right) {
            run += speed;
        }
        if(keys.left) {
            run -= speed;
        }
        camera.scale(mouse.whell/1551)
        user.body.runSpeed = run;
        if(keys.clone) {
            world.pushDrawable(new Entity(
                new CompositeAvatar(textures[getRandomInt(0, textures.length-1)]), 
                world.physics.createBody(new Hitbox(user.hitbox.position.Sum(new Point({x: 50, y: 0})), 32, 32), new Point({}), true)));
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
    timerDraw = setInterval(world.draw.bind(world), 15);
}


loadWorld("test-world-anim.json", start)

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
}