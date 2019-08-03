console.log("Watch!")

interface Point {
    x: number;
    y: number;
}

interface Drowable {
    draw(context: CanvasRenderingContext2D): void;
}

class Color {
    R: number;
    G: number;
    B: number;
    A: number;

    constructor(r:number, g:number, b:number, a: number) {
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }

    to_string(): string {
        return "#008000";
    }
}

let duck = new Image();
var duck_image: ImageBitmap;
duck.onload = () => {
        // Cut out two sprites from the sprite sheet
    createImageBitmap(duck).then(bitmap => duck_image = bitmap);
}

// Load the sprite sheet from an image file
duck.src = 'duck16x16.png';


class User implements Point, Drowable{
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(duck_image, this.x, this.y, 32, 32);
    }
    id: string;
    nick: string;
    color: Color;
    x: number;
    y: number;
    navigation: NavigationReason;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad"
        this.navigation = "right";
    }

    clone(): User {
        return new User(this.x, this.y);
    }


}

//let id = localStorage.getItem("id");
let user = new User(10, 20);

/*let req = new XMLHttpRequest();
if(id == null) {
    req.open('GET', '/user/new?nick=Stive');
    req.addEventListener('loadend', () => {
        user = JSON.parse(req.responseText) as User;
        localStorage.setItem('id', user.id);
    });
} else {
    req.open('GET', '/user/get?id='+id);
    req.addEventListener('loadend', () => {
        user = JSON.parse(req.responseText) as User;
    });
}
req.send();
*/

let canvas = document.getElementById('main') as HTMLCanvasElement;
let context = canvas.getContext('2d') as CanvasRenderingContext2D;
let users = new Array<User>();
users.push(user);

setInterval(() => {
    context.fillStyle = "#000"
    context.fillRect(0, 0, 512, 512);
//    context.clearRect(0, 0, 512, 512);
    for(let i=0; i<users.length; ++i) {
        //context.strokeStyle = users[i].color.to_string();
        //context.strokeRect(users[i].x, users[i].y, 5, 5);
        users[i].draw(context);
    }
}, 40)

class Keyboard {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    clone: boolean = false;

    set(code: string, state: boolean) {
        switch (code) {
            case 'KeyW':
               keys.up = state;
               break;
            case 'KeyS':
                keys.down = state;
                break;
            case 'KeyA':
                keys.left = state;
                break;
            case 'KeyD':
                keys.right = state;
                break;
            case 'Space':
                keys.clone = state;
                break;
        }
    }
}

let keys = new Keyboard();
let pressed = false;

let speed = 48; //px/second
let speed_input = document.getElementById("speed") as HTMLInputElement;
speed_input.addEventListener("input", (ev) => {
    speed = speed_input.value as unknown as number
})
let hitbox = 2 * speed + 10;

let prev_time = 0;
let tick = (time: number) => {
    //setInterval(() => {
        console.log(time-prev_time)
        let step = speed*(time-prev_time)/1000;
        prev_time = time;
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
            users.push(user.clone())
            console.log(users.length);
            keys.clone = false
        }
        requestAnimationFrame(tick);
    //}, 10);
    };
tick(0);

window.addEventListener("keydown", (ev:KeyboardEvent)=>{
    keys.set(ev.code, true);
});

window.addEventListener("keyup", (ev:KeyboardEvent)=>{
    keys.set(ev.code, false);
});