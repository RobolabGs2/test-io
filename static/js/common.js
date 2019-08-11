"use strict";
class Typeable {
    constructor(type) {
        this._type = type;
    }
}
function parseWorld(json) {
    let physics = new Physics();
    let avatarFactory = new AvatarFactory();
    return JSON.parse(json, (key, value) => {
        let _type = value["_type"];
        if (typeof _type === "string") {
            if (key === "avatar") {
                return avatarFactory.make(_type, value);
            }
            switch (_type) {
                case "Point":
                    return new Point(value);
                case "Hitbox":
                    return Hitbox.unpack(value);
                case "Entity":
                    return Entity.unpack(value, physics);
                case "World":
                    return World.unpack(value, physics);
                case "Color":
                    return Color.unpack(value);
            }
        }
        return value;
    });
}
function loadWorld(filename, start) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./static/worlds/" + filename, false);
    xhr.onreadystatechange = function () {
        console.log(this.responseText);
        if (this.readyState === 4 && this.status !== 404) {
            start(parseWorld(this.responseText));
        }
    };
    xhr.send();
}
function saveLocal(save, world) {
    let str = JSON.stringify(world, null, "  ");
    console.log(str);
    localStorage.setItem(save, str);
}
function loadLocal(save) {
    return parseWorld(localStorage.getItem(save));
}

"use strict";
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

"use strict";
class Entity extends Typeable {
    constructor(avatar, body) {
        super("Entity");
        this.avatar = avatar;
        this.counter = 0;
        this.drawHitbox = (hitbox) => { };
        this.body = body;
    }
    setCamera(camera) {
        this.drawHitbox = this.avatar.bindContext(camera);
        return this;
    }
    draw() {
        this.drawHitbox(this.hitbox);
    }
    tick(dt) {
        this.avatar.play(this.body.velocity.x / 50 * dt);
    }
    get hitbox() { return this.body.hitbox; }
    static unpack({ hitbox, avatar, movable = true }, physics) {
        return new Entity(avatar, physics.createBody(hitbox, new Point({}), movable));
    }
    //лучше было переопределить toJson в Body, чтоб он возвращал {movable, что-ещё нужно для создания}
    //деструктурирующее присваивание позволяет парсить и более глубоко, так что можно было бы это отловить в 
    //Entity.unpack, либо передать как объект в createBody
    toJSON() {
        return { hitbox: this.hitbox, avatar: this.avatar, movable: this.body.movable, _type: this._type };
    }
}
class World extends Typeable {
    setCamera(camera) {
        this.camera = camera;
        this.mobs.forEach(mob => mob.setCamera(camera));
        this.user.setCamera(camera);
        this.camera.setPosition(this.user.hitbox.position, new Point({ x: this.user.hitbox.width / 2, y: this.user.hitbox.height / 2 }));
        return this;
    }
    draw() {
        this.camera.clear();
        this.mobs.forEach(mob => {
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
        this.mobs.forEach(m => m.tick(dt));
        this.user.tick(dt);
    }
    pushDrawable(entity) {
        this.mobs.push(entity);
        entity.setCamera(this.camera);
    }
    static unpack({ user, mobs }, physics) {
        let w = new World(user, physics);
        mobs.forEach(mob => w.pushDrawable(mob));
        return w;
    }
}
