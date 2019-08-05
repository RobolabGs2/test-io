class CollisionPair{
    b1: Body;
    b2: Body;
    public time: number;
    vector: Point;

    constructor(b: Body)
    constructor(b1: Body, b2: Body, time: number, vector: Point)
    constructor(b1: Body, b2?: Body, time?: number, vector?: Point){
        if(b2 && time && vector){
            this.b1 = b1;
            this.b2 = b2;
            this.time = time;
            this.vector = vector;
        }else{
            this.b1 = b1;
            this.b2 = b1;
            this.time = Infinity;
            this.vector = new Point({});
        }
    }
}