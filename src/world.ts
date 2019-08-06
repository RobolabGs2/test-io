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

    length(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
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

    body: Body; 

    constructor(public hitbox: Hitbox, public avatar: Avatar, movable: boolean = true) {
        super("Entity");

        if(movable)
        this.body = new Body(hitbox, 
            new Point({x:Math.random() * 5, y:Math.random() * 5}), movable);
        else
        this.body = new Body(hitbox, 
            new Point({x: 0, y: 0}), movable);
    }

    move(dv: Point) {
        this.hitbox.position.x+=dv.x
        this.hitbox.position.y+=dv.y
        this.avatar.play(dv.x/15)
    }

    static unpack({hitbox, avatar, movable = true}: {hitbox: Hitbox, avatar: Avatar, movable: boolean}) {
        return new Entity(hitbox, avatar, movable);
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
    physics: Physics;

    constructor(user: Entity) {
        super("World");
        this.user = user;
        this.mobs = new Array<Entity>();
        this.physics = new Physics();
    }

    tick(dt: number){
        this.physics.tick(dt);
    }

    add(entity: Entity){
        this.mobs.push(entity);
        this.physics.add(entity.body);
    }

    pushDrawable(entity: Entity) {
        this.add(entity.setContext(this.context) as Entity);
    }

    static unpack({user, mobs}: {user: Entity, mobs: Array<Entity>}) {
        let w = new World(user);                
        mobs.forEach(mob => w.add(mob));
        return w;
    }
}