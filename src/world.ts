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

    Revers(): Point{
        return new Point({x: this.y, y: this.x});
    }

    Sum(point: Point): Point{
        return new Point({x: this.x + point.x, y: this.y + point.y});
    }

    Neg(): Point{
        return new Point({x: -this.x, y: -this.y});
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

    get x1() {return this.position.x}
    get x2() {return this.position.x + this.width}
    get y1() {return this.position.y}
    get y2() {return this.position.y + this.height}

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
    velocity: Point;

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x;
        this.hitbox.position.y += dt * this.velocity.y;
    }

    constructor(public hitbox: Hitbox, public avatar: Avatar) {
        super("Entity");
        this.velocity = new Point({x:1, y:2});
    }

    Acceleration():Point{
        return new Point({});
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
    mobs: Array<Entity>;
    private context!: CanvasRenderingContext2D;

    constructor(user: Entity) {
        super("World");
        this.user = user;
        this.mobs = new Array<Entity>();
    }

    tick(dt: number){
        for(let i = 0; i < this.mobs.length; ++i)
            if(i % 5 == 3)    
                this.mobs[i].velocity.x = 3;
        //console.log(this.mobs[2].hitbox.x1 - this.mobs[3].hitbox.x1, this.mobs[2].hitbox.y1 - this.mobs[3].hitbox.y1);
        //console.log(Collision.EntityesTime(this.mobs[2], this.mobs[3]));
        Collision.EntityesTime(this.mobs[2], this.mobs[3]);
        this.mobs.forEach(function(mob) {
            mob.tick(dt);
        })
    }

    pushDrawable(entity: Entity) {
        this.mobs.push(entity.setContext(this.context) as Entity);
    }

    static unpack({user, mobs}: {user: Entity, mobs: Array<Entity>}) {
        let w = new World(user);
        w.mobs = mobs;
        return w;
    }
}