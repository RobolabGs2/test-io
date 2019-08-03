interface Point {
    x: number;
    y: number;
}

interface Drawable {
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
    //todo
    to_string(): string {
        return "#008000";
    }
}

class User implements Point, Drawable{
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.bitmap, this.x, this.y, 32, 32);
    }
    id: string;
    nick: string;
    color: Color;
    x: number;
    y: number;
    navigation: NavigationReason;
    bitmap!: ImageBitmap;

    constructor(x: number, y:number, bitmap?: ImageBitmap) {
        this.x = x;
        this.y = y;
        this.nick = "John";
        this.color = new Color(128, 255, 128, 128);
        this.id = "wadwad"
        this.navigation = "right";
        if(bitmap)
            this.bitmap = bitmap;
    }

    clone(): User {
        return new User(this.x, this.y, this.bitmap);
    }
}

class World implements Drawable{
    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#000"
        context.fillRect(0, 0, 512, 512);
        //context.clearRect(0, 0, 512, 512);
        this.mobs.forEach(mob => {
        mob.draw(context);
        });
        this.user.draw(context);
    }
    user: User;
    mobs: Array<Drawable>;
    
    constructor(user: User) {
        this.user = user;
        this.mobs = new Array<Drawable>();
    }
}