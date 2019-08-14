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
class WorldCreator {
    constructor(camera, input) {
        this.camera = camera;
        this.input = input;
        this.avatarFactory = new AvatarFactory();
    }
    loadJson(worldName, component) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `./static/worlds/${worldName}/${component}.json`, false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status !== 404) {
                console.log(xhr.responseText);
            }
        };
        xhr.send();
        return xhr.responseText;
    }
    loadWorld(worldName, start) {
        const physics = new Physics();
        const world = new World(physics, this.camera, world => new Controller(this.input, world));
        this.parseResource(this.loadJson(worldName, "material"), world.pushMaterial.bind(world));
        this.parseEntity(this.loadJson(worldName, "entity"), world.createEntity.bind(world));
        start(world);
    }
    parseResource(json, push) {
        let resources = JSON.parse(json);
        for (const name in resources) {
            if (resources.hasOwnProperty(name)) {
                push(name, resources[name]);
            }
        }
    }
    parseEntity(json, push) {
        return JSON.parse(json, (key, value) => {
            let _type = value["_type"];
            if (typeof _type === "string") {
                if (key === "avatar") {
                    return this.avatarFactory.make(_type, value);
                }
                switch (_type) {
                    case "Point":
                        return new Point(value);
                    case "Hitbox":
                        return Hitbox.unpack(value);
                    case "Color":
                        return Color.unpack(value);
                    case "Entity":
                        push(value);
                        break;
                }
            }
            return value;
        });
    }
    saveLocal(save, world) {
        let str = JSON.stringify(world, null, " ");
        console.log(str);
        localStorage.setItem(save, str);
    }
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
class ResourceManager {
    constructor() {
        this.resources = new Map();
    }
    set(name, resource) {
        resource.toJSON = () => { return name; };
        this.resources.set(name, resource);
    }
    get(name) {
        let res = this.resources.get(name);
        if (!res)
            throw new Error(`Ресурс ${name} отсутствует!`);
        return res;
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
class NotSerialasableDrawable {
    constructor(draw) {
        this.draw = draw;
    }
    toJSON() { return undefined; }
}
class Entity extends Typeable {
    constructor(avatar, body, controllerType) {
        super("Entity");
        this.avatar = avatar;
        this.body = body;
        this.controllerType = controllerType;
        this.body.appendix = this;
    }
    makeDrawable() {
        return new NotSerialasableDrawable((camera) => this.avatar.drawHitbox(this.hitbox, camera));
    }
    tick(dt) {
        this.avatar.move(this.body.velocity.x * dt / this.body.hitbox.width, speedToDirection(this.body.runSpeed));
    }
    get hitbox() { return this.body.hitbox; }
}
class World extends Typeable {
    constructor(physics, camera, controllerMaker) {
        super("World");
        this.camera = camera;
        this.drawables = new Array();
        this.mobs = new Array();
        this.physics = physics;
        this.materials = new ResourceManager();
        this.controller = controllerMaker(this);
    }
    keepTrackOf(traceable) {
        this.camera.setPosition(traceable.hitbox.position, new Point({ x: traceable.hitbox.width / 2, y: traceable.hitbox.height / 2 }));
    }
    draw() {
        this.camera.clear();
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
    }
    tick(dt) {
        this.physics.tick(dt);
        this.controller.tick(dt);
        this.mobs.forEach(m => m.tick(dt));
    }
    pushEntity(entity) {
        this.mobs.push(entity);
        this.pushDrawable(entity);
    }
    createEntity({ avatar, controllerType, body: { hitbox, material, movable = true } }) {
        let entity = new Entity(avatar, this.physics.createBody(hitbox, new Point({}), this.materials.get(material), movable), controllerType);
        this.controller.setControl(entity, controllerType);
        this.pushEntity(entity);
        return entity;
    }
    pushDrawable(drawable) {
        if (!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }
    pushMaterial(name, material) {
        this.materials.set(name, material);
    }
    toJSON() {
        return this.mobs;
    }
}
