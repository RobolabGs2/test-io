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
        this.update();
    }
    setVelocity(velocity) {
        this.velocity = velocity;
        this.update();
    }
    addVelocity(velocity) {
        this.velocity = this.velocity.Sum(velocity);
        this.update();
    }
    update() {
        if (this.collision.time < Infinity) {
            let col = this.collision;
            this.phisics.Update(col.b1);
            this.phisics.Update(col.b2);
        }
        else
            this.phisics.Update(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9waHlzaWNzL2JvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVNBLE1BQU0sSUFBSTtJQVNOLElBQUksSUFBSSxLQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUEsQ0FBQSxDQUFDO0lBQUEsQ0FBQztJQUUzRCxZQUFZLE1BQWMsRUFBRSxRQUFlLEVBQUUsT0FBZ0IsRUFBRSxVQUFtQixJQUFJO1FBQ2xGLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFJLENBQUMsRUFBVTtRQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZO1FBQ1IsSUFBRyxJQUFJLENBQUMsT0FBTztZQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxlQUFlLENBQUMsWUFBbUI7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNKIn0=