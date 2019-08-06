class Body{
    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    tag: number;
    collision: CollisionPair;
    private gravity: Point;
    get mass() {return this.hitbox.height * this.hitbox.width};

    constructor(hitbox: Hitbox, velocity: Point, movable: boolean = true){
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
        this.gravity = new Point({x: 0, y: 9.8});
    }

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
        this.collision.time -= dt;
    }

    Acceleration(): Point{
        if(this.movable)
            return this.gravity;
        return new Point({});
    }
}