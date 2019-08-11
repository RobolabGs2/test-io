console.log("Start!")
{
    let speed = 150; //px/second todo move to user or physics?
    let speed_input = document.getElementById("speed") as HTMLInputElement;
    speed_input.valueAsNumber = speed;
    speed_input.addEventListener("input", (ev) => {
        speed = speed_input.valueAsNumber
    })

    let canvas = document.getElementById('main') as HTMLCanvasElement;
    let camera = new Camera(canvas);
    let input = new InputDevices(camera);
    let cursore = input.mouseCursore;
    let timerTick: number;
    let timerDraw: number;
    let currentWorld: World;
    function start(world: World) {
        try {
            clearInterval(timerDraw)
            clearInterval(timerTick)
        } catch (e) {
            console.log(e);
        }
        currentWorld = world;
        world.setCamera(camera);
        world.pushDrawable(cursore)
        let user = world.user;
        let textures = [
            user.avatar.texture,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];

        let run = 0;
        input.addPressingAction(Actions.left, (dt) => {
            run -= speed; 
            return true;
        }).addPressingAction(Actions.right, (dt) => {
            run += speed;
            return true;
        }).addPressingAction(Actions.jump, (dt) => {
            if (Math.abs(user.body.velocity.y) < 1)
                user.body.setVelocity(new Point({ x: user.body.velocity.x, y: -130 }));
            return true;
        }).addPressAction(false, Actions.clone, () => {
            world.pushRawEntity(
                new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]),
                new Hitbox(user.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 32, 32))
        }).addPressAction(true, Actions.unzoom, () => {
            camera.scale(-100 / 1551)
        }).addPressAction(true, Actions.zoom, () => {
            camera.scale(100 / 1551)
        })

        let tick = (dt: number) => {
            run = 0;
            input.tick(dt);
            user.body.runSpeed = run;

            if (!input.mouse.clicks[0].empty) {
                input.mouse.clicks[0].flush().forEach(position => {
                    let t = textures[getRandomInt(0, textures.length - 1)];
                    world.pushRawEntity(
                        new CompositeAvatar(t),
                        new Hitbox(position, 32, 32))
                    cursore.texture = t;
                })
            }
            world.tick(dt / 1000);
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
        if (currentWorld)
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