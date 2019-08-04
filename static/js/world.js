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
}
class Hitbox extends Typeable {
    constructor(position, width, height) {
        super("Hitbox");
        this.position = position;
        this.width = width;
        this.height = height;
    }
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
    }
    setContext(context) {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw() {
        this.drawHitbox(this.hitbox);
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
    pushDrawable(entity) {
        this.mobs.push(entity.setContext(this.context));
    }
    static unpack({ user, mobs }) {
        let w = new World(user);
        w.mobs = mobs;
        return w;
    }
}
