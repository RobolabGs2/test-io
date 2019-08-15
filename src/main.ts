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
    let worldCreator = new WorldCreator(camera, input);
    //let cursore = input.mouseCursore;
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
        //world.pushDrawable(cursore)

        let tick = (dt: number) => {
            world.tick(dt / 1000);
            input.tick(dt);
        };
        let prev_time = Date.now();
        timerTick = setInterval(() => {
            let time = Date.now();
            tick(time - prev_time);
            prev_time = time;
        })
        timerDraw = setInterval(world.draw.bind(world), 15);
    
    }


    worldCreator.loadWorld("world1", start)

    let sb = document.getElementById("save") as HTMLButtonElement;
    let lb = document.getElementById("load") as HTMLButtonElement;

    let saveInput = document.getElementById("saveNum") as HTMLInputElement;
    sb.onclick = () => {
        if (currentWorld)
        worldCreator.saveLocal(saveInput.value, currentWorld)
        sb.blur()
        canvas.focus()
    }

    lb.onclick = () => {
        //start(worldCreator.loadLocal(saveInput.value))
        lb.blur()
        canvas.focus()
    }
}