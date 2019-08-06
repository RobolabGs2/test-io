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
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
    constructor(avatar, body) {
        super("Entity");
        this.avatar = avatar;
        this.drawHitbox = (hitbox) => { };
        this.body = body;
    }
    setContext(context) {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw() {
        this.drawHitbox(this.hitbox);
    }
    get hitbox() { return this.body.hitbox; }
    static unpack({ hitbox, avatar, movable = true }, physics) {
        return new Entity(avatar, physics.createBody(hitbox, new Point({}), movable));
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
    constructor(user, physics) {
        super("World");
        this.user = user;
        this.mobs = new Array();
        this.physics = physics;
    }
    tick(dt) {
        this.physics.tick(dt);
    }
    pushDrawable(entity) {
        this.mobs.push(entity);
        entity.setContext(this.context);
    }
    static unpack({ user, mobs }, physics) {
        let w = new World(user, physics);
        mobs.forEach(mob => w.pushDrawable(mob));
        return w;
    }
}
