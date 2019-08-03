console.log("Watch!")

interface Point {
    x: number;
    y: number;
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

class User implements Point{
    id: string;
    nick: string;
    color: Color;
    x: number;
    y: number;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad"
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
        context.strokeStyle = users[i].color.to_string();
        context.strokeRect(users[i].x, users[i].y, 5, 5);
    }
}, 40)

class Keyboard {
    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;
    clone: boolean = false;
}

let keys = new Keyboard();
let pressed = false;

let speed = 3;
let hitbox = 2 * speed + 10;
setInterval(() => {
    if(keys.down) {
        user.y += speed;
    }
    if(keys.up) {
        user.y -= speed;
    }
    if(keys.right) {
        user.x += speed;
    }
    if(keys.left) {
        user.x -= speed;
    }
    if(keys.clone) {
        users.push(user.clone())
    }
}, 10);

window.addEventListener("keydown", (ev:KeyboardEvent)=>{
   switch (ev.key) {
       case 'w':
          keys.up = true;
          break;
       case 's':
           keys.down = true;
           break;
       case 'a':
           keys.left = true;
           break;
       case 'd':
           keys.right = true;
           break;
       case 'e':
           keys.clone = true;
           break;
   }
});

window.addEventListener("keyup", (ev:KeyboardEvent)=>{
    switch (ev.key) {
        case 'w':
            keys.up = false;
            break;
        case 's':
            keys.down = false;
            break;
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
        case 'e':
           keys.clone = false;
           break;
    }
});