console.log("Start!")
let user = new User(10, 20);
let duck = new Image();
duck.onload = () => {
    createImageBitmap(duck).then(bitmap => user.bitmap = bitmap);
}

// Load the sprite sheet from an image file
duck.src = 'duck16x16.png';


let canvas = document.getElementById('main') as HTMLCanvasElement;
let context = canvas.getContext('2d') as CanvasRenderingContext2D;
let world = new World(user)

//отрисовка
setInterval(world.draw.bind(world, context), 40)

let keys = new Keyboard(); 
let speed = 48; //px/second todo move to user
let speed_input = document.getElementById("speed") as HTMLInputElement;
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value as unknown as number
})
let hitbox = 2 * speed + 10;

let prev_time = Date.now();
let tick = (dt: number) => {
    let step = speed*(dt)/1000;
    if(keys.down) {
        user.y += step;
    }
    if(keys.up) {
        user.y -= step;
    }
    if(keys.right) {
        user.x += step;
    }
    if(keys.left) {
        user.x -= step;
    }
    if(keys.clone) {
        world.mobs.push(user.clone())
        keys.clone = false
    }
};

setInterval(() => {
    let time = Date.now();
    tick(time - prev_time);
    prev_time = time;
})

window.addEventListener("keydown", (ev:KeyboardEvent)=>{
    keys.set(ev.code, true);
});

window.addEventListener("keyup", (ev:KeyboardEvent)=>{
    keys.set(ev.code, false);
});