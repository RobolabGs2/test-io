class Point {
    x: number;
    y: number;

    constructor({x = 0, y = 0}) {
        this.x = x;
        this.y = y;
    }
}

interface Drawable {
    draw(): void;
    setContext(context: CanvasRenderingContext2D): Drawable;
}

class Hitbox {
    position!: Point;
    width!: number;
    height!: number;

    constructor(position: Point, w: number, h: number) {
        this.position = position;
        this.height = h;
        this.width = w;
    }
}

class Entity implements Drawable{
    setContext(context: CanvasRenderingContext2D): Drawable {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw(): void{
        this.drawHitbox(this.hitbox)
    }

    avatar: Avatar;
    hitbox: Hitbox;
    drawHitbox = (hitbox: Hitbox) => {}

    constructor(hitbox: Hitbox, avatar: Avatar) {
        this.hitbox = hitbox;
        this.avatar = avatar;
    }
}

class World implements Drawable{
    setContext(context: CanvasRenderingContext2D): Drawable {
        this.context = context;
        this.mobs.forEach(mob => mob.setContext(context))
        this.user.setContext(context)
        return this;
    }
    draw(): void {
        this.context.fillStyle = "#000"
        this.context.fillRect(0, 0, 512, 512);
        //context.clearRect(0, 0, 512, 512);
        this.mobs.forEach(mob => {
            this.context.fillStyle = "#000"
            this.context.strokeStyle = "#FFF"
            mob.draw();
        });
        this.user.draw();
    }
    user: Entity;
    mobs: Array<Drawable>;
    private context!: CanvasRenderingContext2D;

    constructor(user: Entity) {
        this.user = user;
        this.mobs = new Array<Drawable>();
    }

    pushDrawable(entity: Drawable) {
        this.mobs.push(entity.setContext(this.context));
    }
}