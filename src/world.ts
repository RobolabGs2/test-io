abstract class Typeable {
    _type: string;
    constructor(type: string) {
        this._type = type;
    }
}

class Point extends Typeable {
    x: number;
    y: number;

    constructor({x = 0, y = 0}) {
        super("Point");
        this.x = x;
        this.y = y;
    }
}

interface Drawable {
    draw(): void;
    setContext(context: CanvasRenderingContext2D): Drawable;
}

class Hitbox extends Typeable  {
    constructor(public position: Point, public width: number, public height: number) {
        super("Hitbox");
    }

    static unpack({position, width, height}: {position: Point, width: number, height: number}) {
        return new Hitbox(position, width, height);
    }
}

class Entity extends Typeable implements Drawable{
    setContext(context: CanvasRenderingContext2D): Drawable {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw(): void{
        this.drawHitbox(this.hitbox)
    }
    private drawHitbox = (hitbox: Hitbox) => {}
    constructor(public hitbox: Hitbox, public avatar: Avatar) {
        super("Entity");
    }

    static unpack({hitbox, avatar}: {hitbox: Hitbox, avatar: Avatar}) {
        return new Entity(hitbox, avatar);
    }
}

class World extends Typeable implements Drawable{
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
        super("World");
        this.user = user;
        this.mobs = new Array<Drawable>();
    }

    pushDrawable(entity: Drawable) {
        this.mobs.push(entity.setContext(this.context));
    }

    static unpack({user, mobs}: {user: Entity, mobs: Array<Entity>}) {
        let w = new World(user);
        w.mobs = mobs;
        return w;
    }
}