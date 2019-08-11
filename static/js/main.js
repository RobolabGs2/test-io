"use strict";
console.log("Start!");
let speed = 150; //px/second todo move to user or physics?
let speed_input = document.getElementById("speed");
speed_input.valueAsNumber = speed;
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value;
});
const header = document.querySelector("header");
let headerHeight = header.clientHeight;
console.debug(headerHeight);
let canvas = document.getElementById('main');
let keys = new Keyboard();
let mouse = new Mouse(canvas);
let camera = new Camera(canvas, window.innerWidth, document.body.clientHeight - headerHeight);
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
    world.setCamera(camera);
    let user = world.user;
    let textures = [
        user.avatar.texture,
        new FillRectangleTexture(new Color(255, 255, 255, 12)),
        new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
        new StrokeRectangleTexture(new Color(126, 63, 32)),
        new ImageTexture("duck16x16.png")
    ];
    let tick = (dt) => {
        let run = 0;
        if (keys.down) {
            //dv.y += step;
        }
        if (keys.up)
            user.body.jumpSpeed = 150;
        else
            user.body.jumpSpeed = 0;
        if (keys.right) {
            run += speed;
        }
        if (keys.left) {
            run -= speed;
        }
        camera.scale(mouse.whell / 1551);
        user.body.runSpeed = run;
        if (keys.clone) {
            world.pushDrawable(new Entity(new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]), world.physics.createBody(new Hitbox(user.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 32, 32), new Point({}), true)));
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
    timerDraw = setInterval(world.draw.bind(world), 15);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRXJCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLHlDQUF5QztBQUMxRCxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztBQUN2RSxXQUFXLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztBQUNsQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDekMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUEwQixDQUFBO0FBQ2xELENBQUMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxNQUFNLEdBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQWlCLENBQUM7QUFDakUsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzNCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFzQixDQUFDO0FBQ2xFLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQ25CLE1BQU0sRUFDTixNQUFNLENBQUMsVUFBVSxFQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQztBQUMvQyxJQUFJLFNBQWlCLENBQUM7QUFDdEIsSUFBSSxTQUFpQixDQUFDO0FBQ3RCLElBQUksWUFBbUIsQ0FBQztBQUN4QixTQUFTLEtBQUssQ0FBQyxLQUFZO0lBQ3ZCLElBQUk7UUFD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