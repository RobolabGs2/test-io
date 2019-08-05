class Physics
{
    objects: Array<Body>;
    private queue: PriorityQueue;

    constructor() {
        this.objects = new Array<Body>();
        this.queue = new PriorityQueue();
    }

    Contact(pair: CollisionPair){
        let buf = pair.b1.velocity;
        pair.b1.velocity = pair.b2.velocity;
        pair.b2.velocity = buf;
    }

    tick(dt: number){
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

            this.Contact(pair);

            this.Update(pair.b1);
            this.Update(pair.b2);
        } while (dt > 0);

        console.log(this.queue.list.length, this.queue.Better().collision.time);

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
        for (let i = 0; i < this.objects.length; ++i){
            let current = this.objects[i];
            if (current != body)
            {
                let currentTime = Collision.BodyTime(body, current, time);
                if (currentTime < time && currentTime < current.collision.time)
                {
                    other = current;
                    time = currentTime;
                }
            }
        }

        let pair1 = new CollisionPair(body, other, time, new Point({}));
        body.collision = pair1;
        this.queue.Relocate(body.tag);
        if(body != other)
        {
            let pair2 = new CollisionPair(body, other, time, new Point({}));
            other.collision = pair2;
            this.queue.Relocate(other.tag);
        }
    }
}