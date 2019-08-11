"use strict";
class Hitbox extends Typeable {
    constructor(position, width, height) {
        super("Hitbox");
        this.position = position;
        this.width = width;
        this.height = height;
    }
    get x1() { return this.position.x; }
    get x2() { return this.position.x + this.width; }
    get y1() { return this.position.y; }
    get y2() { return this.position.y + this.height; }
    center() { return new Point({ x: (this.position.x + this.width / 2), y: (this.position.y + this.height / 2) }); }
    static unpack({ position, width, height }) {
        return new Hitbox(position, width, height);
    }
}

"use strict";
class Point extends Typeable {
    constructor({ x = 0, y = 0 }) {
        super("Point");
        this.x = x;
        this.y = y;
    }
    Revers() {
        return new Point({ x: this.y, y: this.x });
    }
    Sum(point) {
        return new Point({ x: this.x + point.x, y: this.y + point.y });
    }
    Neg() {
        return new Point({ x: -this.x, y: -this.y });
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
