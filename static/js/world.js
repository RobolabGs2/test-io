"use strict";
class Typeable {
    constructor(type) {
        this._type = type;
    }
}
class Point extends Typeable {
    constructor({ x = 0, y = 0 }) {
        super("Point");
        this.x = x;
        this.y = y;
    }
    Revers() {
        return new Point({ x: this.y, y: this.x });
    }
    Sum(point) {
        return new Point({ x: this.x + point.x, y: this.y + point.y });
    }
    Neg() {
        return new Point({ x: -this.x, y: -this.y });
    }
}
class Hitbox extends Typeable {
    constructor(position, width, height) {
        super("Hitbox");
        this.position = position;
        this.width = width;
        this.height = height;
    }
    get x1() { return this.position.x; }
    get x2() { return this.position.x + this.width; }
    get y1() { return this.position.y; }
    get y2() { return this.position.y + this.height; }
    static unpack({ position, width, height }) {
        return new Hitbox(position, width, height);
    }
}
class Entity extends Typeable {
    constructor(hitbox, avatar) {
        super("Entity");
        this.hitbox = hitbox;
        this.avatar = avatar;
        this.drawHitbox = (hitbox) => { };
        this.velocity = new Point({ x: 1, y: 2 });
    }
    setContext(context) {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw() {
        this.drawHitbox(this.hitbox);
    }
    tick(dt) {
        this.hitbox.position.x += dt * this.velocity.x;
        this.hitbox.position.y += dt * this.velocity.y;
    }
    Acceleration() {
        return new Point({});
    }
    static unpack({ hitbox, avatar }) {
        return new Entity(hitbox, avatar);
    }
}
class World extends Typeable {
    setContext(context) {
        this.context = context;
        this.mobs.forEach(mob => mob.setContext(context));
        this.user.setContext(context);
        return this;
    }
    draw() {
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, 512, 512);
        //context.clearRect(0, 0, 512, 512);
        this.mobs.forEach(mob => {
            this.context.fillStyle = "#000";
            this.context.strokeStyle = "#FFF";
            mob.draw();
        });
        this.user.draw();
    }
    constructor(user) {
        super("World");
        this.user = user;
        this.mobs = new Array();
    }
    tick(dt) {
        for (let i = 0; i < this.mobs.length; ++i)
            if (i % 5 == 3)
                this.mobs[i].velocity.x = 3;
        //console.log(this.mobs[2].hitbox.x1 - this.mobs[3].hitbox.x1, this.mobs[2].hitbox.y1 - this.mobs[3].hitbox.y1);
        //console.log(Collision.EntityesTime(this.mobs[2], this.mobs[3]));
        Collision.EntityesTime(this.mobs[2], this.mobs[3]);
        this.mobs.forEach(function (mob) {
            mob.tick(dt);
        });
    }
    pushDrawable(entity) {
        this.mobs.push(entity.setContext(this.context));
    }
    static unpack({ user, mobs }) {
        let w = new World(user);
        w.mobs = mobs;
        return w;
    }
}
