interface IBody{

    readonly hitbox: Hitbox;
    readonly velocity: Point;
    readonly mass: number;
    runSpeed: number;
    jumpSpeed: number;
    movable: boolean;
    material: physicalMaterial
    appendix: any;

    setAcceleration(acceleration: Point): void;
    setVelocity(velocity: Point): void;
    addVelocity(velocity: Point): void;

    addCollisionEvent(event: (appendix: any) => void): number;
    removeCollisionEvent(num: number): void;
    release(): void;

    toJSON(): {movable: boolean, material: physicalMaterial, hitbox: Hitbox};
}

class Body implements IBody{

    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    tag: number;
    collision: CollisionPair<Body>;
    phisics: Physics;
    acceleration: Point;
    runSpeed: number;
    jumpSpeed: number;
    material: physicalMaterial
    appendix: any; 
    collisionEvents: Array<(appendix: any) => void>;
    addTime: number;

    get time() {return this.collision.time};
    get mass() {return this.hitbox.height * this.hitbox.width * this.material.density;};

    constructor(hitbox: Hitbox, velocity: Point, physics: Physics, material: physicalMaterial, movable: boolean = true){
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
        this.phisics = physics;
        this.acceleration = new Point({});
        this.runSpeed = 0;
        this.jumpSpeed = 0;
        this.material = material;
        this.collisionEvents = new Array();
        this.addTime = 0;
    }

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
        this.collision.time -= dt;
    }

    addCollisionEvent(event: (appendix: any) => void){
        return this.collisionEvents.push(event) - 1;
    }

    removeCollisionEvent(num: number){
        delete this.collisionEvents[num];
    }

    collisionEvent(appendix: any){
        this.collisionEvents.forEach(e => e(appendix));
    }

    Acceleration(): Point{
        if(this.movable)
            return this.phisics.gravity.Sum(this.acceleration);
        return new Point({});
    }

    setAcceleration(acceleration: Point){
        this.acceleration = acceleration;
        this.update();
    }

    setVelocity(velocity: Point){
        this.velocity = velocity;
        this.update();
    }

    addVelocity(velocity: Point){
        this.velocity = this.velocity.Sum(velocity);
        this.update();
    }

    update(){
        if(this.collision.time < Infinity)
        {
            let col = this.collision;
            this.phisics.Update(col.b1);
            this.phisics.Update(col.b2);
        }else
            this.phisics.Update(this);
    }

    release(){

    }

    toJSON(): { movable: boolean, material: physicalMaterial, hitbox: Hitbox } {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}
class ChunkBodyCollision{
    
    collision: CollisionPair<ChunkBody>;
    body: ChunkBody;

    get time() {return this.collision.time;};
    get tag() {return (this.collision.b1 == this.body) ? this.collision.tag1 : this.collision.tag2;}
    set tag(t: number) {if (this.collision.b1 == this.body)  this.collision.tag1 = t; else this.collision.tag2 = t;}

    constructor(collision: CollisionPair<ChunkBody>, body: ChunkBody){
        this.collision = collision;
        this.body = body;
    }
}

class ChunkBody implements IBody{

    phisics: ChunkPhysics;
    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    acceleration: Point;
    runSpeed: number;
    jumpSpeed: number;
    tag: number;
    material: physicalMaterial
    appendix: any; 
    collisionEvents: Array<(appendix: any) => void>;
    addTime: number;
    queue: PriorityQueue<ChunkBodyCollision>;

    get time() {return (this.queue.size > 0) ? this.queue.Better().time : Infinity;};
    get mass() {return this.hitbox.height * this.hitbox.width * this.material.density;};

    constructor(hitbox: Hitbox, velocity: Point, physics: ChunkPhysics, material: physicalMaterial, movable: boolean = true){
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = -1;
        this.phisics = physics;
        this.acceleration = new Point({});
        this.runSpeed = 0;
        this.jumpSpeed = 0;
        this.material = material;
        this.collisionEvents = new Array();
        this.addTime = 0;
        this.queue = new PriorityQueue<ChunkBodyCollision>();
    }

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
    }

    clearCollisions(){
        this.queue.clear();
    }

    addCollisionEvent(event: (appendix: any) => void){
        return this.collisionEvents.push(event) - 1;
    }

    removeCollisionEvent(num: number){
        delete this.collisionEvents[num];
    }

    collisionEvent(appendix: any){
        this.collisionEvents.forEach(e => e(appendix));
    }

    Acceleration(): Point{
        if(this.movable)
            return this.phisics.gravity.Sum(this.acceleration);
        return new Point({});
    }

    setAcceleration(acceleration: Point){
        this.acceleration = acceleration;
    }

    setVelocity(velocity: Point){
        this.velocity = velocity;
    }

    addVelocity(velocity: Point){
        this.velocity = this.velocity.Sum(velocity);
    }

    release(){

        this.phisics.releaseBody(this);
    }

    toJSON(): { movable: boolean, material: physicalMaterial, hitbox: Hitbox } {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}