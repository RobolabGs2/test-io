"use strict";
class Body {
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
    toJSON() {
        return { movable: this.movable, material: this.material, hitbox: this.hitbox };
    }
}

"use strict";
class Collision {
    static BodyTime(b1, b2, time) {
        let sq1 = b1.hitbox;
        let sq2 = b2.hitbox;
        let dV = b2.velocity.Sum(b1.velocity.Neg());
        let dg = b2.Acceleration().Sum(b1.Acceleration().Neg());
        {
            let xCenter = (sq1.x1 + sq1.x2) / 2;
            let aCenter = (sq2.x1 + sq2.x2) / 2;
            let dx = Math.abs(xCenter - aCenter);
            let maxLen = (sq1.width + sq2.width) / 2 + Math.abs(dV.x * time) + Math.abs(dg.x * time * time);
            if (dx > maxLen)
                return { time: time, vector: new Point({ x: 0, y: 0 }) };
            let yCenter = (sq1.y1 + sq1.y2) / 2;
            let bCenter = (sq2.y1 + sq2.y2) / 2;
            dx = Math.abs(yCenter - bCenter);
            maxLen = (sq1.height + sq2.height) / 2 + Math.abs(dV.y * time) + Math.abs(dg.y * time * time);
            if (dx > maxLen)
                return { time: time, vector: new Point({ x: 0, y: 0 }) };
        }
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        let prTime = time;
        dV = dV.Revers();
        dg = dg.Revers();
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);
        if (time == prTime)
            return { time: time, vector: new Point({ x: 1, y: 0 }) };
        else
            return { time: time, vector: new Point({ x: 0, y: 1 }) };
    }
    static LinesTime(x, y1, y2, a, b1, b2, dV, dg, time) {
        let dx = a - x;
        if (dg.x == 0) {
            if (dV.x == 0)
                time;
            let t = -dx / dV.x;
            if (t > 0 && t < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t);
                let b22 = this.Move(b2, dV.y, dg.y, t);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t;
            }
        }
        else {
            let underSqrt = dV.x * dV.x - 2 * dg.x * dx;
            if (underSqrt < 0)
                return time;
            let sqt = Math.sqrt(underSqrt);
            let t1 = (-dV.x + sqt) / dg.x;
            let t2 = (-dV.x - sqt) / dg.x;
            if (t1 > 0 && t1 < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t1);
                let b22 = this.Move(b2, dV.y, dg.y, t1);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t1;
            }
            if (t2 > 0 && t2 < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t2);
                let b22 = this.Move(b2, dV.y, dg.y, t2);
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
    }
}

"use strict";
class impact {
    static hit(body1, body2, vector) {
        let m1 = body1.mass;
        let m2 = body2.mass;
        if (Math.abs(vector.x) >= Math.abs(vector.y)) {
            let vel = this.bounce(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable);
            body1.velocity.x = vel.v;
            body2.velocity.x = vel.u;
            let fric = this.friction(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable);
            body1.velocity.y = fric.v;
            body2.velocity.y = fric.u;
        }
        else {
            let vel = this.jump(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable, body1.jumpSpeed, body2.jumpSpeed);
            body1.velocity.y = vel.v;
            body2.velocity.y = vel.u;
            let fric = this.run(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable, body2.runSpeed - body1.runSpeed);
            body1.velocity.x = fric.v;
            body2.velocity.x = fric.u;
        }
    }
    static bounce(v, u, m1, m2, mov1, mov2) {
        let k = 0.9;
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
    static friction(v, u, m1, m2, mov1, mov2) {
        let k = 0.3;
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
    static run(v, u, m1, m2, mov1, mov2, S) {
        let k = 0.3;
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
    static jump(v, u, m1, m2, mov1, mov2, jvel1, jvel2) {
        let k = 0.9;
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
            dt = 0.01;
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
                let collision = Collision.BodyTime(body, current, time);
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

"use strict";
class PriorityQueue {
    constructor() {
        this.list = new Array();
    }
    Add(body) {
        body.tag = this.list.length;
        this.list.push(body);
        this.Up(body.tag);
    }
    Up(i) {
        let prev = this.Prev(i);
        while (i > 0 && this.list[i].collision.time < this.list[prev].collision.time) {
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
        if (this.Valid(left) && this.list[left].collision.time < this.list[min].collision.time)
            min = left;
        if (this.Valid(right) && this.list[right].collision.time < this.list[min].collision.time)
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
