class Body{
    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    tag: number;
    collision: CollisionPair;

    constructor(hitbox: Hitbox, velocity: Point, movable: boolean = true){
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
    }

    tick(dt: number){
        this.hitbox.position.x += dt * this.velocity.x;
        this.hitbox.position.y += dt * this.velocity.y;
        this.collision.time -= dt;
    }

    Acceleration(): Point{
        return new Point({});
    }
}