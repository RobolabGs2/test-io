"use strict";
class Physics {
    constructor() {
        this.objects = new Array();
        this.queue = new PriorityQueue();
        this.gravity = new Point({ x: 0, y: 9.8 });
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
    createBody(hitbox, velocity, movable = true) {
        let body = new Body(hitbox, velocity, this, movable);
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
            let pair2 = new CollisionPair(body, other, time, vector);
            other.collision = pair2;
            this.queue.Relocate(other.tag);
        }
    }
}
