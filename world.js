"use strict";
class Point {
    constructor({ x = 0, y = 0 }) {
        this.x = x;
        this.y = y;
    }
}
class Hitbox {
    constructor(position, w, h) {
        this.position = position;
        this.height = h;
        this.width = w;
    }
}
class Entity {
    constructor(hitbox, avatar) {
        this.drawHitbox = (hitbox) => { };
        this.hitbox = hitbox;
        this.avatar = avatar;
    }
    setContext(context) {
        this.drawHitbox = this.avatar.bindContext(context);
        return this;
    }
    draw() {
        this.drawHitbox(this.hitbox);
    }
}
class World {
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
        this.user = user;
        this.mobs = new Array();
    }
    pushDrawable(entity) {
        this.mobs.push(entity.setContext(this.context));
    }
}
