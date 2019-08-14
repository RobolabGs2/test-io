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

    toJSON(): {movable: boolean, material: physicalMaterial, hitbox: Hitbox};
}

class Body implements IBody{
    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    tag: number;
    collision: CollisionPair;
    phisics: Physics;
    acceleration: Point;
    runSpeed: number;
    jumpSpeed: number;
    material: physicalMaterial
    appendix: any; 
    collisionEvents: Array<(appendix: any) => void>;

    get mass() {return this.hitbox.height * this.hitbox.width * this.material.density};

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

    toJSON(): { movable: boolean, material: physicalMaterial, hitbox: Hitbox } {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}