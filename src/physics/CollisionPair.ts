class CollisionPair<T>{
    b1: T;
    b2: T;
    public time: number;
    vector: Point;
    tag1: number;
    tag2: number;

    constructor(b: T)
    constructor(b1: T, b2: T, time: number, vector: Point)
    constructor(b1: T, b2?: T, time?: number, vector?: Point){
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
        this.tag1 = -1;
        this.tag2 = -1;
    }
}