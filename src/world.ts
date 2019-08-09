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
    setCamera(camera: Camera): Drawable;
}

class Hitbox extends Typeable  {
    constructor(public position: Point, public width: number, public height: number) {
        super("Hitbox");
    }

    get x1() {return this.position.x}
    get x2() {return this.position.x + this.width}
    get y1() {return this.position.y}
    get y2() {return this.position.y + this.height}
    center() {return new Point({x:(this.position.x + this.width/2), y:(this.position.y + this.height/2)})}

    static unpack({position, width, height}: {position: Point, width: number, height: number}) {
        return new Hitbox(position, width, height);
    }
}

class Entity extends Typeable implements Drawable{
    setCamera(camera: Camera): Drawable {
        this.drawHitbox = this.avatar.bindContext(camera);
        return this;
    }
    
    draw(): void{
        this.drawHitbox(this.hitbox)
    }
    counter = 0
    tick(dt: number) {
        this.avatar.play(this.body.velocity.x/50*dt)
    }

    private drawHitbox = (hitbox: Hitbox) => {}
    body: IBody; 
    get hitbox() {return this.body.hitbox}

    constructor(public avatar: Avatar, body: IBody) {
        super("Entity");
        this.body = body;
    }
    
    static unpack({hitbox, avatar, movable = true}: {hitbox: Hitbox, avatar: Avatar, movable: boolean}, physics: IPhysics) {
        return new Entity(avatar, physics.createBody(hitbox, new Point({}), movable));
    }
    //лучше было переопределить toJson в Body, чтоб он возвращал {movable, что-ещё нужно для создания}
    //деструктурирующее присваивание позволяет парсить и более глубоко, так что можно было бы это отловить в 
    //Entity.unpack, либо передать как объект в createBody
    toJSON() {
        return {hitbox:this.hitbox, avatar:this.avatar, movable:this.body.movable, _type: this._type}
    }
}

class World extends Typeable implements Drawable{

    setCamera(camera: Camera): Drawable {
        this.camera = camera
        this.mobs.forEach(mob => mob.setCamera(camera))
        this.user.setCamera(camera)
        this.camera.setPosition(this.user.hitbox.position, new Point({x:this.user.hitbox.width/2, y:this.user.hitbox.height/2}));
        return this;
    }

    draw(): void {
        this.camera.clear()
        this.mobs.forEach(mob => {
            mob.draw();
        });
        this.user.draw();
    }

    user: Entity;
    mobs: Array<Entity>;
    private camera!: Camera;
    physics: IPhysics;

    constructor(user: Entity, physics: IPhysics) {
        super("World");
        this.user = user;
        this.mobs = new Array<Entity>();
        this.physics = physics;
    }

    tick(dt: number){
        this.physics.tick(dt);
        this.mobs.forEach(m => m.tick(dt));
        this.user.tick(dt);
    }

    pushDrawable(entity: Entity) {
        this.mobs.push(entity);
        entity.setCamera(this.camera);
    }

    static unpack({user, mobs}: {user: Entity, mobs: Array<Entity>}, physics: IPhysics) {
        let w = new World(user, physics);                
        mobs.forEach(mob => w.pushDrawable(mob));
        return w;
    }
}