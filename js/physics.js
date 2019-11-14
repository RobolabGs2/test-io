"use strict";
class CollisionPair {
    constructor(b1, b2, time, vector) {
        if (b2 && time && vector) {
            this.b1 = b1;
            this.b2 = b2;
            this.time = time;
            this.vector = vector;
        }
        else {
            this.b1 = b1;
            this.b2 = b1;
            this.time = Infinity;
            this.vector = new Point({});
        }
        this.tag1 = -1;
        this.tag2 = -1;
    }
}

"use strict";
class Body {
    get time() { return this.collision.time; }
    ;
    get mass() { return this.hitbox.height * this.hitbox.width * this.material.density; }
    ;
    constructor(hitbox, velocity, physics, material, movable = true) {
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = 0;
        this.collision = new CollisionPair(this);
        this.phisics = physics;
        this.acceleration = new Point({});
        this.runSpeed = 0;
        this.jumpSpeed = 0;
        this.material = material;
        this.collisionEvents = new Array();
        this.addTime = 0;
    }
    tick(dt) {
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
        this.collision.time -= dt;
    }
    addCollisionEvent(event) {
        return this.collisionEvents.push(event) - 1;
    }
    removeCollisionEvent(num) {
        delete this.collisionEvents[num];
    }
    collisionEvent(appendix) {
        this.collisionEvents.forEach(e => e(appendix));
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
    release() {
    }
    toJSON() {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}
class ChunkBodyCollision {
    get time() { return this.collision.time; }
    ;
    get tag() { return (this.collision.b1 == this.body) ? this.collision.tag1 : this.collision.tag2; }
    set tag(t) { if (this.collision.b1 == this.body)
        this.collision.tag1 = t;
    else
        this.collision.tag2 = t; }
    constructor(collision, body) {
        this.collision = collision;
        this.body = body;
    }
}
class ChunkBody {
    get time() { return (this.queue.size > 0) ? this.queue.Better().time : Infinity; }
    ;
    get mass() { return this.hitbox.height * this.hitbox.width * this.material.density; }
    ;
    constructor(hitbox, velocity, physics, material, movable = true) {
        this.hitbox = hitbox;
        this.velocity = velocity;
        this.movable = movable;
        this.tag = -1;
        this.phisics = physics;
        this.acceleration = new Point({});
        this.runSpeed = 0;
        this.jumpSpeed = 0;
        this.material = material;
        this.collisionEvents = new Array();
        this.addTime = 0;
        this.queue = new PriorityQueue();
    }
    tick(dt) {
        this.hitbox.position.x += dt * this.velocity.x + dt * dt * this.Acceleration().x / 2;
        this.hitbox.position.y += dt * this.velocity.y + dt * dt * this.Acceleration().y / 2;
        this.velocity.x += this.Acceleration().x * dt;
        this.velocity.y += this.Acceleration().y * dt;
    }
    clearCollisions() {
        this.queue.clear();
    }
    addCollisionEvent(event) {
        return this.collisionEvents.push(event) - 1;
    }
    removeCollisionEvent(num) {
        delete this.collisionEvents[num];
    }
    collisionEvent(appendix) {
        this.collisionEvents.forEach(e => e(appendix));
    }
    Acceleration() {
        if (this.movable)
            return this.phisics.gravity.Sum(this.acceleration);
        return new Point({});
    }
    setAcceleration(acceleration) {
        this.acceleration = acceleration;
    }
    setVelocity(velocity) {
        this.velocity = velocity;
    }
    addVelocity(velocity) {
        this.velocity = this.velocity.Sum(velocity);
    }
    release() {
        this.phisics.releaseBody(this);
    }
    toJSON() {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}

"use strict";
class HashMap {
    constructor() {
        this.map = new Map();
        this.size = 0;
    }
    set(p, v) {
        let under = this.map.get(p.x);
        if (!under) {
            under = new Map();
            this.map.set(p.x, under);
        }
        ++this.size;
        under.set(p.y, v);
    }
    get(p) {
        let under = this.map.get(p.x);
        if (!under)
            return undefined;
        return under.get(p.y);
    }
    has(p) {
        let under = this.map.get(p.x);
        if (!under)
            return false;
        return under.has(p.y);
    }
    delete(p) {
        let under = this.map.get(p.x);
        if (!under)
            return false;
        let ret = under.delete(p.y);
        if (under.size == 0)
            this.map.delete(p.x);
        if (ret)
            --this.size;
        return ret;
    }
    forEach(pred) {
        this.map.forEach((value1, key1) => value1.forEach((value2, key2) => pred(value2, new Point({ x: key1, y: key2 }))));
    }
}
class ChunkTable {
    constructor(func, chunkSize) {
        this.chunkSize = chunkSize;
        this.func = func;
        this.elems = new Map();
        this.table = new HashMap();
        this.validTable = new HashMap();
    }
    Add(value, dt) {
        var rect = this.GetRctangle(value, dt);
        let node = { rectangle: rect.rectangle, r: rect.r, value: value };
        this.elems.set(value, node);
        for (let i = node.rectangle.X1; i <= node.rectangle.X2; ++i)
            for (let j = node.rectangle.Y1; j <= node.rectangle.Y2; ++j)
                this.AddFromKey(new Point({ x: i, y: j }), node);
    }
    Remove(value) {
        let node = this.elems.get(value);
        if (!node)
            return false;
        this.elems.delete(value);
        for (let i = node.rectangle.X1; i <= node.rectangle.X2; ++i)
            for (let j = node.rectangle.Y1; j <= node.rectangle.Y2; ++j)
                this.RemoveFromKey(new Point({ x: i, y: j }), node);
        return true;
    }
    Update(value, dt) {
        let node = this.elems.get(value);
        if (node)
            this.MoveNode(node, dt);
    }
    GetRctangle(value, dt) {
        let rect = this.func(value, dt);
        return { rectangle: this.Scale(rect), r: rect };
    }
    Scale(rectangle) {
        return {
            X1: Math.floor(rectangle.x1 / this.chunkSize.x),
            Y1: Math.floor(rectangle.y1 / this.chunkSize.y),
            X2: Math.floor(rectangle.x2 / this.chunkSize.x),
            Y2: Math.floor(rectangle.y2 / this.chunkSize.y),
        };
    }
    MoveNode(node, dt) {
        var rect = this.GetRctangle(node.value, dt);
        let newR = rect.rectangle;
        let lastR = node.rectangle;
        node.rectangle = newR;
        node.r = rect.r;
        if (newR.X1 == lastR.X1 &&
            newR.X2 == lastR.X2 &&
            newR.Y1 == lastR.Y1 &&
            newR.Y2 == lastR.Y2)
            return;
        for (let i = lastR.X1; i <= lastR.X2; ++i)
            if (i < newR.X1 || i > newR.X2)
                for (let j = lastR.Y1; j <= lastR.Y2; ++j)
                    this.RemoveFromKey(new Point({ x: i, y: j }), node);
        for (let j = lastR.Y1; j <= lastR.Y2; ++j)
            if (j < newR.Y1 || j > newR.Y2)
                for (let i = lastR.X1; i <= lastR.X2; ++i)
                    if (!(i < newR.X1 || i > newR.X2))
                        this.RemoveFromKey(new Point({ x: i, y: j }), node);
        for (let i = newR.X1; i <= newR.X2; ++i)
            if (i < lastR.X1 || i > lastR.X2)
                for (let j = newR.Y1; j <= newR.Y2; ++j)
                    this.AddFromKey(new Point({ x: i, y: j }), node);
        for (let j = newR.Y1; j <= newR.Y2; ++j)
            if (j < lastR.Y1 || j > lastR.Y2)
                for (let i = newR.X1; i <= newR.X2; ++i)
                    if (!(i < lastR.X1 || i > lastR.X2))
                        this.AddFromKey(new Point({ x: i, y: j }), node);
    }
    AddFromKey(key, node) {
        let nodes = this.table.get(key);
        if (!nodes) {
            nodes = new Array();
            this.table.set(key, nodes);
        }
        nodes.push(node);
        if (nodes.length == 2)
            this.validTable.set(key, nodes);
    }
    RemoveFromKey(key, node) {
        let nodes = this.table.get(key);
        if (!nodes)
            return;
        let nodeIdx = nodes.findIndex(n => n == node);
        nodes.splice(nodeIdx, 1);
        if (nodes.length == 1)
            this.validTable.delete(key);
        if (nodes.length == 0)
            this.table.delete(key);
    }
    Refresh(dt) {
        this.elems.forEach(n => this.MoveNode(n, dt));
    }
    IsCollision(n1, n2) {
        return !(n1.r.x2 < n2.r.x1 ||
            n2.r.x2 < n1.r.x1 ||
            n1.r.y2 < n2.r.y1 ||
            n2.r.y2 < n1.r.y1);
    }
    forEachCollisions(pred) {
        /*
                this.elems.forEach((value1: ChunkTableNode<T>, key1: T) =>{
                    let f = false;
                    
                    this.elems.forEach((value2: ChunkTableNode<T>, key2: T) =>{
                        if(key1 == key2){
                            f = true;
                            return;
                        }
                        if(!f) return;
        
                        pred(key1, key2);
                    });
                });*/
        this.table.forEach((value, key) => {
            for (let i = 0; i < value.length; ++i)
                for (let j = i + 1; j < value.length; ++j) {
                    let node1 = value[i];
                    let node2 = value[j];
                    if (node1 != node2
                        && !((node1.rectangle.X1 < key.x && node2.rectangle.X1 < key.x) || (node1.rectangle.Y1 < key.y && node2.rectangle.Y1 < key.y))
                        && this.IsCollision(node1, node2))
                        pred(node1.value, node2.value);
                }
        });
    }
    forEachCollisionsWith(t, pred) {
        /*
                    this.elems.forEach((value2: ChunkTableNode<T>, key2: T) =>{
                        if(t == key2)
                            return;
                        pred(t, key2);
                    });*/
        let node = this.elems.get(t);
        if (!node)
            return;
        let node1 = node;
        let start_i = node1.rectangle.X1;
        let start_j = node1.rectangle.Y1;
        for (let i = start_i; i <= node1.rectangle.X2; ++i)
            for (let j = start_j; j <= node1.rectangle.Y2; ++j) {
                let chunk = this.table.get(new Point({ x: i, y: j }));
                if (chunk)
                    chunk.forEach((node2) => {
                        if (node1 == node2)
                            return;
                        if (i == start_i && j == start_j) {
                            if (this.IsCollision(node1, node2))
                                pred(node2.value);
                        }
                        else if (i == start_i) {
                            if (!(node2.rectangle.Y1 < j)
                                && this.IsCollision(node1, node2))
                                pred(node2.value);
                        }
                        else if (j == start_j) {
                            if (!(node2.rectangle.X1 < i) && this.IsCollision(node1, node2))
                                pred(node2.value);
                        }
                        else {
                            if (!(node2.rectangle.X1 < i) || (node2.rectangle.Y1 < j)
                                && this.IsCollision(node1, node2))
                                pred(node2.value);
                        }
                    });
            }
    }
}

"use strict";
class Collision {
    static BodyTime(b1, b2, time, currentTime) {
        let sq1 = b1.hitbox;
        let sq2 = b2.hitbox;
        /*let dV = b2.velocity.Sum(b1.velocity.Neg());
        let dg = b2.Acceleration().Sum(b1.Acceleration().Neg());
        {
            let xCenter = (sq1.x1 + sq1.x2) / 2;
            let aCenter = (sq2.x1 + sq2.x2) / 2;
            let dx = Math.abs(xCenter - aCenter);
            let maxLen = (sq1.width + sq2.width) / 2 + Math.abs(dV.x * time) + Math.abs(dg.x * time * time);
            if (dx > maxLen)
                return {time: time, vector: new Point({x: 0, y: 0})};

            let yCenter = (sq1.y1 + sq1.y2) / 2;
            let bCenter = (sq2.y1 + sq2.y2) / 2;
            dx = Math.abs(yCenter - bCenter);
            maxLen = (sq1.height + sq2.height) / 2 + Math.abs(dV.y * time) + Math.abs(dg.y * time * time);
            if (dx > maxLen)
            return {time: time, vector: new Point({x: 0, y: 0})};
        }*/
        let V = new Point(b1.velocity);
        let U = new Point(b2.velocity);
        let g = b1.Acceleration();
        let h = b2.Acceleration();
        //console.log(time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        let prTime = time;
        V = V.Revers();
        U = U.Revers();
        g = g.Revers();
        h = h.Revers();
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        if (time == prTime)
            return { time: time, vector: new Point({ x: 1, y: 0 }) };
        else
            return { time: time, vector: new Point({ x: 0, y: 1 }) };
    }
    static LinesTime(x, y1, y2, a, b1, b2, V, U, g, h, time, addt1, addt2, currentTime) {
        let A = (h.x - g.x);
        let B = U.x - V.x + g.x * addt1 - h.x * addt2;
        if (A == 0) {
            //console.log("x = ", x, a, "v = ", V.x, U.x, "g = ", g.x, h.x, "addt = ", addt1, addt2);
            if (B == 0)
                time;
            let C = a - x - (U.x * addt2 - V.x * addt1) + (h.x * addt2 * addt2 - g.x * addt1 * addt1) / 2;
            //console.log("A = ", A, "B = ", B, "C = ", C);
            let t = -C / B;
            if (t >= currentTime && t < time) {
                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t - addt1);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t - addt2);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t;
            }
        }
        else {
            let C = (a - x - (U.x * addt2 - V.x * addt1)) * 2 + (h.x * addt2 * addt2 - g.x * addt1 * addt1);
            let underSqrt = B * B - A * C;
            if (underSqrt < 0)
                return time;
            let sqt = Math.sqrt(underSqrt);
            let t1 = (-B + sqt) / A;
            let t2 = (-B - sqt) / A;
            if (t1 >= currentTime && t1 < time) {
                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t1);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t1);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t1;
            }
            if (t2 >= currentTime && t2 < time) {
                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t2);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t2);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t2;
            }
        }
        return time;
    }
    static Move(x, V, g, t) {
        return x + V * t + g * (t * t) / 2;
    }
    static CheckLines(x1, x2, a1, a2) {
        return !(x2 < a1 || a2 < x1);
    }
}

"use strict";
class impact {
    static mean(a, b) {
        return Math.sqrt(a * b);
    }
    static hit(body1, body2, vector) {
        let m1 = body1.mass;
        let m2 = body2.mass;
        if (Math.abs(vector.x) >= Math.abs(vector.y)) {
            let vel = this.bounce(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable, this.mean(body1.material.elasticityCoefficient, body2.material.elasticityCoefficient));
            body1.velocity.x = vel.v;
            body2.velocity.x = vel.u;
            let fric = this.friction(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable, this.mean(body1.material.frictionСoefficient, body2.material.frictionСoefficient));
            body1.velocity.y = fric.v;
            body2.velocity.y = fric.u;
        }
        else {
            let vel = this.jump(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable, this.mean(body1.material.elasticityCoefficient, body2.material.elasticityCoefficient), body1.jumpSpeed, body2.jumpSpeed);
            body1.velocity.y = vel.v;
            body2.velocity.y = vel.u;
            let fric = this.run(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable, this.mean(body1.material.frictionСoefficient, body2.material.frictionСoefficient), body2.runSpeed - body1.runSpeed);
            body1.velocity.x = fric.v;
            body2.velocity.x = fric.u;
        }
    }
    static bounce(v, u, m1, m2, mov1, mov2, k) {
        let u1 = u - v;
        let p = 20 * Math.min(m1, m2);
        let root = 1 - k + p * (m1 + m2) / (m1 * m2 * u1 * u1);
        let mult = Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }
        else if (mov2) {
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return { v: v, u: u };
    }
    static friction(v, u, m1, m2, mov1, mov2, k) {
        let u1 = u - v;
        let root = 1 - k;
        let mult = -Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }
        else if (mov2) {
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return { v: v, u: u };
    }
    static run(v, u, m1, m2, mov1, mov2, k, S) {
        let u1 = u - v;
        let root = 1 - k;
        let mult = Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = (u1 * (m2 + m1 * mult) + m1 * S * (1 - mult)) / (m2 + m1);
            let v2 = m2 * (u1 - S) * (1 - mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let u2 = u1;
            let v2 = (u1 - S) * (1 - mult);
            u = v + u2;
            v = v + v2;
        }
        else if (mov2) {
            let u2 = u1 * mult + S * (1 - mult);
            let v2 = 0;
            u = v + u2;
            v = v + v2;
        }
        return { v: v, u: u };
    }
    static jump(v, u, m1, m2, mov1, mov2, k, jvel1, jvel2) {
        let u1 = u - v;
        let p = 20 * Math.min(m1, m2) + m1 * jvel1 * jvel1 + m2 * jvel2 * jvel2;
        let root = 1 - k + p * (m1 + m2) / (m1 * m2 * u1 * u1);
        let mult = Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }
        else if (mov2) {
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return { v: v, u: u };
    }
}

"use strict";
class physicalMaterial {
    constructor(frictionСoefficient, elasticityCoefficient, density) {
        this.frictionСoefficient = frictionСoefficient;
        this.elasticityCoefficient = elasticityCoefficient;
        this.density = density;
    }
}

"use strict";
class Physics {
    constructor() {
        this.objects = new Array();
        this.queue = new PriorityQueue();
        this.gravity = new Point({ x: 0, y: 9.8 * 10 });
    }
    tick(dt) {
        if (dt > 0.1)
            dt = 0.1;
        let count = 0;
        do {
            let pair = this.queue.Better().collision;
            let contact = pair.time <= dt;
            if (!contact) {
                this.objects.forEach(obj => obj.tick(dt));
                dt = -1;
                continue;
            }
            dt -= pair.time;
            let delta = pair.time - 1e-9;
            this.objects.forEach(obj => obj.tick(delta));
            impact.hit(pair.b1, pair.b2, pair.vector);
            this.Update(pair.b1);
            this.Update(pair.b2);
            pair.b1.collisionEvent(pair.b2.appendix);
            pair.b2.collisionEvent(pair.b1.appendix);
            ++count;
        } while (dt > 0);
        //console.log(this.queue.list.length, count, this.queue.Better().collision.time);
    }
    createBody(hitbox, velocity, material, movable = true) {
        let body = new Body(hitbox, velocity, this, material, movable);
        this.add(body);
        return body;
    }
    add(body) {
        console.log("len = ", this.objects.length);
        this.objects.push(body);
        this.queue.Add(body);
        this.Update(body);
    }
    Update(body) {
        let time = Infinity;
        let other = body;
        let vector = new Point({});
        for (let i = 0; i < this.objects.length; ++i) {
            let current = this.objects[i];
            if (current != body) {
                let collision = Collision.BodyTime(body, current, time, 0);
                let currentTime = collision.time;
                if (currentTime < time && currentTime < current.collision.time) {
                    other = current;
                    time = currentTime;
                    vector = collision.vector;
                }
            }
        }
        let pair1 = new CollisionPair(body, other, time, vector);
        body.collision = pair1;
        this.queue.Relocate(body.tag);
        if (body != other) {
            let otherPair = other.collision;
            let pair2 = new CollisionPair(body, other, time, vector);
            other.collision = pair2;
            this.queue.Relocate(other.tag);
            if (otherPair.b1 != other && otherPair.b1 != body)
                this.Update(otherPair.b1);
            else if (otherPair.b2 != other && otherPair.b2 != body)
                this.Update(otherPair.b2);
        }
    }
    //либо можно возвращать, что нужно в конструкторе
    toJSON() {
        return undefined;
    }
}
class ChunkPhysics {
    constructor() {
        this.table = new ChunkTable((b, dt) => {
            let dx = Math.abs(b.velocity.x * dt) + Math.abs(this.gravity.x / 2 * dt * dt) + 1e-1;
            let dy = Math.abs(b.velocity.y * dt) + Math.abs(this.gravity.y / 2 * dt * dt) + 1e-1;
            return new Hitbox(b.hitbox.position.Sum(new Point({ x: -dx, y: -dy })), b.hitbox.width + dx * 2, b.hitbox.height + dy * 2);
        }, new Point({ x: 33.3, y: 33.3 }));
        this.objects = new Array();
        this.gravity = new Point({ x: 0, y: 9.8 * 10 });
    }
    tick(dt) {
        if (dt > 0.1)
            dt = 0.1;
        this.table.Refresh(dt);
        let queue = new PriorityQueue();
        this.table.forEachCollisions((v1, v2) => this.calcPair(v1, v2, dt, 0, queue));
        let currentTime = 0;
        let count = 0;
        do {
            let pair;
            if (queue.size > 0 && queue.Better().time != Infinity) {
                pair = queue.Better().queue.Better().collision;
            }
            else
                pair = new CollisionPair(this.objects[0]);
            let contact = pair.time <= dt;
            if (!contact) {
                this.objects.forEach(obj => {
                    let delt = dt - obj.addTime;
                    obj.tick(delt);
                    obj.addTime = 0;
                    obj.tag = -1;
                    obj.queue.clear();
                });
                dt = -1;
                continue;
            }
            let delta = Math.max(pair.time - 1e-11, pair.b1.addTime, pair.b2.addTime);
            currentTime = delta;
            pair.b1.tick(delta - pair.b1.addTime);
            pair.b1.addTime = delta;
            pair.b2.tick(delta - pair.b2.addTime);
            pair.b2.addTime = delta;
            impact.hit(pair.b1, pair.b2, pair.vector);
            this.table.Update(pair.b1, dt - pair.time);
            this.table.Update(pair.b2, dt - pair.time);
            queue.Remove(pair.b1.tag);
            pair.b1.tag = -1;
            while (pair.b1.queue.size != 0) {
                let del = pair.b1.queue.Better().collision;
                del.b1.queue.Remove(del.tag1);
                del.b2.queue.Remove(del.tag2);
                if (del.b1 != pair.b1)
                    queue.Relocate(del.b1.tag);
                else
                    queue.Relocate(del.b2.tag);
            }
            queue.Remove(pair.b2.tag);
            pair.b2.tag = -1;
            while (pair.b2.queue.size != 0) {
                let del = pair.b2.queue.Better().collision;
                del.b1.queue.Remove(del.tag1);
                del.b2.queue.Remove(del.tag2);
                if (del.b1 != pair.b2)
                    queue.Relocate(del.b1.tag);
                else
                    queue.Relocate(del.b2.tag);
            }
            this.table.forEachCollisionsWith(pair.b1, (v2) => this.calcPair(pair.b1, v2, dt, currentTime, queue));
            this.table.forEachCollisionsWith(pair.b2, (v2) => {
                if (pair.b1 == v2)
                    return;
                this.calcPair(pair.b2, v2, dt, currentTime, queue);
            });
            pair.b1.collisionEvent(pair.b2.appendix);
            pair.b2.collisionEvent(pair.b1.appendix);
            ++count;
        } while (dt > 0);
    }
    calcPair(v1, v2, dt, currentTime, queue) {
        if (v1 == v2)
            console.log("pupupriam");
        let t = Collision.BodyTime(v1, v2, dt + 1e-9, currentTime);
        if (t.time > dt)
            return;
        let coll = new CollisionPair(v1, v2, t.time, t.vector);
        v1.queue.Add(new ChunkBodyCollision(coll, v1));
        if (v1.tag == -1)
            queue.Add(v1);
        else
            queue.Relocate(v1.tag);
        v2.queue.Add(new ChunkBodyCollision(coll, v2));
        if (v2.tag == -1)
            queue.Add(v2);
        else
            queue.Relocate(v2.tag);
    }
    releaseBody(body) {
        let idx = this.objects.findIndex((b) => b == body);
        this.objects.splice(idx, 1);
        this.table.Remove(body);
    }
    createBody(hitbox, velocity, material, movable = true) {
        let body = new ChunkBody(hitbox, velocity, this, material, movable);
        this.add(body);
        return body;
    }
    add(body) {
        console.log("len = ", this.objects.length);
        this.objects.push(body);
        this.table.Add(body, 0);
    }
}

"use strict";
class PriorityQueue {
    constructor() {
        this.list = new Array();
    }
    get size() { return this.list.length; }
    ;
    Add(body) {
        body.tag = this.list.length;
        this.list.push(body);
        this.Up(body.tag);
    }
    Up(i) {
        let prev = this.Prev(i);
        while (i > 0 && this.list[i].time < this.list[prev].time) {
            this.Swap(i, prev);
            i = prev;
            prev = this.Prev(i);
        }
    }
    Left(i) {
        return 2 * i + 1;
    }
    Right(i) {
        return 2 * i + 2;
    }
    Prev(i) {
        return Math.floor((i - 1) / 2);
    }
    Valid(i) {
        return i < this.list.length;
    }
    Remove(i) {
        if (i == this.list.length - 1) {
            this.list.pop();
            return;
        }
        this.Swap(i, this.list.length - 1);
        this.list.pop();
        this.Relocate(i);
    }
    clear() {
        this.list = new Array();
    }
    popTop() {
        if (this.list.length == 1) {
            this.list.pop();
            return;
        }
        this.Swap(0, this.list.length - 1);
        this.list.pop();
        this.Heapify(0);
    }
    Swap(i, j) {
        let buf = this.list[i];
        this.list[i] = this.list[j];
        this.list[j] = buf;
        this.list[i].tag = i;
        this.list[j].tag = j;
    }
    Heapify(i) {
        if (!this.Valid(i))
            return;
        let min = i;
        let left = this.Left(i);
        let right = this.Right(i);
        if (this.Valid(left) && this.list[left].time < this.list[min].time)
            min = left;
        if (this.Valid(right) && this.list[right].time < this.list[min].time)
            min = right;
        if (min == i)
            return;
        this.Swap(i, min);
        this.Heapify(min);
    }
    Better() {
        return this.list[0];
    }
    Relocate(i) {
        this.Up(i);
        this.Heapify(i);
    }
}
