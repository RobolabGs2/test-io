"use strict";
class CollisionPair {
    constructor(b1, b2, time, vector) {
        if (b2 && time && vector) {
            this.b1 = b1;
            this.b2 = b2;
            this.time = time;
            this.vector = vector;
        }
        else {
            this.b1 = b1;
            this.b2 = b1;
            this.time = Infinity;
            this.vector = new Point({});
        }
    }
}
