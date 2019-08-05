"use strict";
class CollisionPair {
    constructor(e1, e2, time, vector) {
        if (e2 && time && vector) {
            this.e1 = e1;
            this.e2 = e2;
            this.time = time;
            this.vector = vector;
        }
        else {
            this.e1 = e1;
            this.e2 = e1;
            this.time = Infinity;
            this.vector = new Point({});
        }
    }
}
