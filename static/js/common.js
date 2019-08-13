"use strict";
class Buffer {
    constructor() {
        this.buf = new Array();
    }
    push(elem) {
        this.buf.push(elem);
    }
    get size() {
        return this.buf.length;
    }
    get empty() {
        return this.buf.length == 0;
    }
    flush() {
        let b = this.buf;
        this.buf = new Array();
        return b;
    }
}

"use strict";
class Typeable {
    constructor(type) {
        this._type = type;
    }
}
function parseWorld(json) {
    let physics = new Physics();
    let world = new World(physics);
    let avatarFactory = new AvatarFactory();
    JSON.parse(json, (key, value) => {
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
                    return world.createEntity(value);
                case "Color":
                    return Color.unpack(value);
            }
        }
        return value;
    });
    return world;
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
class Queue {
    constructor() {
        this.first = 1;
        this.last = 1;
        this.elems = new Array();
        this.capacity = Number.MAX_SAFE_INTEGER;
        this._size = 0;
    }
    get size() {
        return this._size;
    }
    inc(a, d = 1) {
        return (a + d) % this.capacity;
    }
    enqueue(data) {
        this.elems[this.last] = data;
        this.last = this.inc(this.last);
        this._size++;
        if (this._size > this.capacity)
            throw new Error("Queue overflow");
    }
    dequeue() {
        let deletedData;
        if (this._size > 0) {
            deletedData = this.elems[this.first];
            delete this.elems[this.first];
            this.first = (this.first + 1) % this.capacity;
            this._size--;
        }
        return deletedData;
    }
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
        this.body = body;
    }
    makeDrawable() {
        return { draw: this.avatar.bindContext(this.hitbox) };
    }
    tick(dt) {
        this.avatar.play(this.body.velocity.x / 50 * dt);
    }
    get hitbox() { return this.body.hitbox; }
    //лучше было переопределить toJson в Body, чтоб он возвращал {movable, что-ещё нужно для создания}
    //деструктурирующее присваивание позволяет парсить и более глубоко, так что можно было бы это отловить в 
    //Entity.unpack, либо передать как объект в createBody
    toJSON() {
        return { hitbox: this.hitbox, avatar: this.avatar, movable: this.body.movable, _type: this._type };
    }
}
class World extends Typeable {
    constructor(physics) {
        super("World");
        this.drawables = new Array();
        this.mobs = new Array();
        this.physics = physics;
        this.materials = new Map();
        this.controller = new Controller(this);
        this.materials.set("duck", new physicalMaterial(0.9, 0.05, 30));
        this.materials.set("stone", new physicalMaterial(0.9, 0.05, 170));
    }
    setCamera(camera, user) {
        this.camera = camera;
        this.camera.setPosition(user.hitbox.position, new Point({ x: user.hitbox.width / 2, y: user.hitbox.height / 2 }));
    }
    draw() {
        this.camera.clear();
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
    }
    tick(dt) {
        this.physics.tick(dt);
        this.controller.tikc(dt);
        this.mobs.forEach(m => m.tick(dt));
    }
    pushEntity(entity) {
        this.mobs.push(entity);
        this.pushDrawable(entity);
    }
    createEntity({ hitbox, avatar, controllerType, material, movable = true }) {
        let entity = new Entity(avatar, this.physics.createBody(hitbox, new Point({}), this.materials.get(material), movable));
        this.controller.setControl(entity, controllerType);
        this.pushEntity(entity);
        return entity;
    }
    pushDrawable(drawable) {
        if (!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }
}
