interface IPhysics{
    tick(dt: number): void;
    createBody(hitbox: Hitbox, velocity: Point, material: physicalMaterial, movable: boolean): IBody;
    readonly gravity: Point;
} 

class Physics{

    private queue: PriorityQueue<Body>;
    private objects: Array<Body>;
    gravity: Point;

    constructor() {
        this.objects = new Array<Body>();
        this.queue = new PriorityQueue();
        this.gravity = new Point({x: 0, y: 9.8 * 10});
    }

    tick(dt: number){
        if(dt > 0.1)
            dt = 0.1;
        let count = 0;
        do
        {
            let pair = this.queue.Better().collision;

            let contact = pair.time <= dt;

            if (!contact){
                this.objects.forEach(obj => obj.tick(dt))
                dt = -1;
                continue;
            }

            dt -= pair.time;
            let delta = pair.time - 1e-9;
            this.objects.forEach(obj => obj.tick(delta))

            impact.hit(pair.b1, pair.b2, pair.vector);

            this.Update(pair.b1);
            this.Update(pair.b2);

            pair.b1.collisionEvent(pair.b2.appendix);
            pair.b2.collisionEvent(pair.b1.appendix);

            ++count;
        } while (dt > 0);

        //console.log(this.queue.list.length, count, this.queue.Better().collision.time);
    }

    createBody(hitbox: Hitbox, velocity: Point, material: physicalMaterial, movable: boolean = true): IBody{
        let body = new Body(hitbox, velocity, this, material, movable);
        this.add(body);
        return body;
    }

    add(body: Body){
        console.log("len = ", this.objects.length);
        this.objects.push(body);
        this.queue.Add(body);
        this.Update(body);
    }

    Update(body: Body)
    {
        let time = Infinity; 
        let other = body;
        let vector = new Point({});
        for (let i = 0; i < this.objects.length; ++i){
            let current = this.objects[i];
            if (current != body)
            {
                let collision = Collision.BodyTime(body, current, time, 0)
                let currentTime = collision.time;
                if (currentTime < time && currentTime < current.collision.time)
                {
                    other = current;
                    time = currentTime;
                    vector = collision.vector;
                }
            }
        }

        let pair1 = new CollisionPair(body, other, time, vector);
        body.collision = pair1;
        this.queue.Relocate(body.tag);
        if(body != other)
        {
            let otherPair = other.collision;
            let pair2 = new CollisionPair(body, other, time, vector);
            other.collision = pair2;
            this.queue.Relocate(other.tag);
            if(otherPair.b1 != other && otherPair.b1 != body)
                this.Update(otherPair.b1);
            else 
            if(otherPair.b2 != other && otherPair.b2 != body)
                this.Update(otherPair.b2);
        }
    }
    //либо можно возвращать, что нужно в конструкторе
    toJSON() {
        return undefined
    }
}

class ChunkPhysics implements IPhysics
{
    private table: ChunkTable<ChunkBody>;
    private objects: Array<ChunkBody>;
    gravity: Point;

    constructor() {

        this.table = new ChunkTable((b: ChunkBody, dt: number) => {
            
            let dx = Math.abs(b.velocity.x * dt) + Math.abs(this.gravity.x / 2 * dt * dt) + 1e-1;
            let dy = Math.abs(b.velocity.y * dt) + Math.abs(this.gravity.y / 2 * dt * dt) + 1e-1;
            return new Hitbox(b.hitbox.position.Sum(new Point({x: -dx, y: -dy})), b.hitbox.width + dx * 2, b.hitbox.height + dy * 2);
        }, new Point({x: 33.3, y: 33.3}));

        this.objects = new Array<ChunkBody>();
        this.gravity = new Point({x: 0, y: 9.8 * 10});
    }

    tick(dt: number){
        if(dt > 0.1)  dt = 0.1;

        this.table.Refresh(dt);
        let queue = new PriorityQueue<ChunkBody>();

        this.table.forEachCollisions((v1, v2) => this.calcPair(v1, v2, dt, 0, queue));

        let currentTime = 0;
        let count = 0;
        do
        {
            let pair: CollisionPair<ChunkBody>;

            if(queue.size > 0 && queue.Better().time != Infinity)
            {
                pair = queue.Better().queue.Better().collision;
            }
            else
                pair = new CollisionPair<ChunkBody>(this.objects[0]);
            
            let contact = pair.time <= dt;

            if (!contact)
            {

                this.objects.forEach(obj => {
                    let delt = dt - obj.addTime;
                    obj.tick(delt)
                    obj.addTime = 0;
                    obj.tag = -1;
                    obj.queue.clear();
                });
                dt = -1;
                continue;
            }
            
            currentTime = pair.time;

            let delta = pair.time - 1e-9;

            pair.b1.tick(delta - pair.b1.addTime);
            pair.b1.addTime = pair.time;
            pair.b2.tick(delta - pair.b2.addTime);
            pair.b2.addTime = pair.time;
     
            impact.hit(pair.b1, pair.b2, pair.vector);

            this.table.Update(pair.b1, dt - pair.time);
            this.table.Update(pair.b2, dt - pair.time);

            queue.Remove(pair.b1.tag);
            pair.b1.tag = -1;
            while(pair.b1.queue.size != 0){
                let del = pair.b1.queue.Better().collision;
                del.b1.queue.Remove(del.tag1);
                del.b2.queue.Remove(del.tag2);
                if(del.b1 != pair.b1)
                    queue.Relocate(del.b1.tag);
                else
                    queue.Relocate(del.b2.tag);
            }

            queue.Remove(pair.b2.tag);
            pair.b2.tag = -1;
            while(pair.b2.queue.size != 0){
                let del = pair.b2.queue.Better().collision;
                del.b1.queue.Remove(del.tag1);
                del.b2.queue.Remove(del.tag2);
                if(del.b1 != pair.b2)
                    queue.Relocate(del.b1.tag);
                else
                    queue.Relocate(del.b2.tag);
            }

            this.table.forEachCollisionsWith(pair.b1, (v2) => this.calcPair(pair.b1, v2, dt, currentTime, queue));
            this.table.forEachCollisionsWith(pair.b2, (v2) =>
            { 
                if(pair.b1 == v2)
                    return;
                this.calcPair(pair.b2, v2, dt, currentTime, queue);
            });
            pair.b1.collisionEvent(pair.b2.appendix);
            pair.b2.collisionEvent(pair.b1.appendix);
     
            ++count;
        } while (dt > 0);
    }

    calcPair(v1: ChunkBody, v2: ChunkBody, dt: number, currentTime: number, queue: PriorityQueue<ChunkBody>){

        if(v1 == v2)
            console.log("pupupriam");
        let t = Collision.BodyTime(v1, v2, dt + 1e-9, currentTime);
        
        if(t.time > dt)
            return;

        let coll = new CollisionPair(v1, v2, t.time, t.vector);
        
        v1.queue.Add(new ChunkBodyCollision(coll, v1));
        if(v1.tag == -1)
            queue.Add(v1);
        else
            queue.Relocate(v1.tag);
        
        v2.queue.Add(new ChunkBodyCollision(coll, v2));
        if(v2.tag == -1)
            queue.Add(v2);
        else
            queue.Relocate(v2.tag);
    }

    createBody(hitbox: Hitbox, velocity: Point, material: physicalMaterial, movable: boolean = true): IBody{
        let body = new ChunkBody(hitbox, velocity, this, material, movable);
        this.add(body);
        return body;
    }

    add(body: ChunkBody){
        console.log("len = ", this.objects.length);
        this.objects.push(body);
        this.table.Add(body, 0);
    }
}