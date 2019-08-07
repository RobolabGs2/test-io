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
    //либо можно возвращать, что нужно в конструкторе
    toJSON() {
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGh5c2ljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9waHlzaWNzL3BoeXNpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE1BQU0sT0FBTztJQU1UO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVU7UUFDWCxJQUFHLEVBQUUsR0FBRyxHQUFHO1lBQ1AsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQ0E7WUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUV6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsT0FBTyxFQUFDO2dCQUNULElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO2dCQUN6QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsU0FBUzthQUNaO1lBRUQsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUss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