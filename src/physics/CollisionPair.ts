class CollisionPair{
    e1: Entity;
    e2: Entity;
    public time: number;
    vector: Point;

    constructor(e: Entity)
    constructor(e1: Entity, e2: Entity, time: number, vector: Point)
    constructor(e1: Entity, e2?: Entity, time?: number, vector?: Point){
        if(e2 && time && vector){
            this.e1 = e1;
            this.e2 = e2;
            this.time = time;
            this.vector = vector;
        }else{
            this.e1 = e1;
            this.e2 = e1;
            this.time = Infinity;
            this.vector = new Point({});
        }
    }
}