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
    collision: CollisionPair;
    tag: number;

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x;
        this.hitbox.position.y += dt * this.velocity.y;
        this.collision.time -= dt;
    }

    constructor(public hitbox: Hitbox, public avatar: Avatar) {
        super("Entity");
        this.velocity = new Point({x:Math.random() * 5, y:Math.random() * 5});
        this.collision = new CollisionPair(this);
        this.tag = 0;
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
    private queue: PriorityQueue;

    constructor(user: Entity) {
        super("World");
        this.user = user;
        this.mobs = new Array<Entity>();
        this.queue = new PriorityQueue();
    }

    Contact(pair: CollisionPair){
        let buf = pair.e1.velocity;
        pair.e1.velocity = pair.e2.velocity;
        pair.e2.velocity = buf;
    }

    tick(dt: number){
        do
        {
            let pair = this.queue.Better().collision;

            let contact = pair.time <= dt;

            if (!contact){
                this.mobs.forEach(mob => mob.tick(dt))
                dt = -1;
                continue;
            }

            dt -= pair.time;
            let delta = pair.time - 1e-9;
            this.mobs.forEach(mob => mob.tick(delta))

            this.Contact(pair);

            this.Update(pair.e1);
            this.Update(pair.e2);
        } while (dt > 0);

        console.log(this.queue.list.length, this.queue.Better().collision.time);

    }

    add(entity: Entity){
        this.mobs.push(entity);
        this.queue.Add(entity);
        this.Update(entity);
    }

    Update(entity: Entity)
    {
        let time = Infinity; 
        let other = entity;
        for (let i = 0; i < this.mobs.length; ++i){
            let current = this.mobs[i];
            if (current != entity)
            {
                let currentTime = Collision.EntityesTime(entity, current, time);
                if (currentTime < time && currentTime < current.collision.time)
                {
                    other = current;
                    time = currentTime;
                }
            }
        }

        let pair1 = new CollisionPair(entity, other, time, new Point({}));
        entity.collision = pair1;
        this.queue.Relocate(entity.tag);
        if(entity != other)
        {
            let pair2 = new CollisionPair(entity, other, time, new Point({}));
            other.collision = pair2;
            this.queue.Relocate(other.tag);
        }
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