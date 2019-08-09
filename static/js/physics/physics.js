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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGh5c2ljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9waHlzaWNzL3BoeXNpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE1BQU0sT0FBTztJQU1UO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELElBQUksQ0FBQyxFQUFVO1FBQ1gsSUFBRyxFQUFFLEdBQUcsR0FBRztZQUNQLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxHQUNBO1lBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFFekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLE9BQU8sRUFBQztnQkFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDekMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFNBQVM7YUFDWjtZQUVELEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUks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