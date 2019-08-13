interface IPhysics{
    tick(dt: number): void;
    createBody(hitbox: Hitbox, velocity: Point, material: physicalMaterial, movable: boolean): IBody;
} 

class Physics implements IPhysics
{
    private queue: PriorityQueue;
    private objects: Array<Body>;
    gravity: Point;

    constructor() {
        this.objects = new Array<Body>();
        this.queue = new PriorityQueue();
        this.gravity = new Point({x: 0, y: 9.8 * 10});
    }

    tick(dt: number){
        if(dt > 0.1)
            dt = 0.01;
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
                let collision = Collision.BodyTime(body, current, time)
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