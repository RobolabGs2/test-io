"use strict";
class Body {
    get mass() { return this.hitbox.height * this.hitbox.width; }
    ;
    constructor(hitbox, velocity, physics, movable = true) {
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
        this.phisics = physics;
        this.acceleration = new Point({});
    }
    tick(dt) {
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
        this.collision.time -= dt;
    }
    Acceleration() {
        if (this.movable)
            return this.phisics.gravity.Sum(this.acceleration);
        return new Point({});
    }
    setAcceleration(acceleration) {
        this.acceleration = acceleration;
        this.phisics.Update(this);
    }
}
