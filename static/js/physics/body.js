"use strict";
class Body {
    constructor(hitbox, velocity, movable = true) {
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
    }
    tick(dt) {
        this.hitbox.position.x += dt * this.velocity.x;
        this.hitbox.position.y += dt * this.velocity.y;
        this.collision.time -= dt;
    }
    Acceleration() {
        return new Point({});
    }
}
