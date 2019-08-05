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
        this.velocity = new Point({ x: Math.random() * 5, y: Math.random() * 5 });
        this.collision = new CollisionPair(this);
        this.tag = 0;
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
        this.collision.time -= dt;
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
        this.queue = new PriorityQueue();
    }
    Contact(pair) {
        let buf = pair.e1.velocity;
        pair.e1.velocity = pair.e2.velocity;
        pair.e2.velocity = buf;
    }
    tick(dt) {
        do {
            let pair = this.queue.Better().collision;
            let contact = pair.time <= dt;
            if (!contact) {
                this.mobs.forEach(mob => mob.tick(dt));
                dt = -1;
                continue;
            }
            dt -= pair.time;
            let delta = pair.time - 1e-9;
            this.mobs.forEach(mob => mob.tick(delta));
            this.Contact(pair);
            this.Update(pair.e1);
            this.Update(pair.e2);
        } while (dt > 0);
        console.log(this.queue.list.length, this.queue.Better().collision.time);
    }
    add(entity) {
        this.mobs.push(entity);
        this.queue.Add(entity);
        this.Update(entity);
    }
    Update(entity) {
        let time = Infinity;
        let other = entity;
        for (let i = 0; i < this.mobs.length; ++i) {
            let current = this.mobs[i];
            if (current != entity) {
                let currentTime = Collision.EntityesTime(entity, current, time);
                if (currentTime < time && currentTime < current.collision.time) {
                    other = current;
                    time = currentTime;
                }
            }
        }
        let pair1 = new CollisionPair(entity, other, time, new Point({}));
        entity.collision = pair1;
        this.queue.Relocate(entity.tag);
        if (entity != other) {
            let pair2 = new CollisionPair(entity, other, time, new Point({}));
            other.collision = pair2;
            this.queue.Relocate(other.tag);
        }
    }
    pushDrawable(entity) {
        this.add(entity.setContext(this.context));
    }
    static unpack({ user, mobs }) {
        let w = new World(user);
        mobs.forEach(mob => console.log(mob.collision.time));
        mobs.forEach(mob => w.add(mob));
        return w;
    }
}
