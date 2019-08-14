"use strict";
class ReadonlyHitbox {
    constructor(position, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
    }
    center() { return new Point({ x: (this.position.x + this.width / 2), y: (this.position.y + this.height / 2) }); }
}
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
    SMult(a) {
        return new Point({ x: this.x * a, y: this.y * a });
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
class FakePoint {
    constructor(origin, offset) {
        this.origin = origin;
        this.offset = offset;
    }
    get x() {
        return this.origin.x + this.offset.x;
    }
    get y() {
        return this.origin.y + this.offset.y;
    }
}
class MiddlePoint {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
    get x() {
        return (this.first.x + this.second.x) / 2;
    }
    get y() {
        return (this.first.y + this.second.y) / 2;
    }
}
class PointInHitbox {
    constructor(hitbox) {
        this.hitbox = hitbox;
        this.position = new Point(hitbox.position);
    }
    get x() {
        let dx = this.hitbox.position.x - this.position.x;
        const radius = this.hitbox.width / 2;
        if (Math.abs(dx) > radius)
            this.position.x += dx > 0 ? dx - radius : dx + radius;
        return this.position.x;
    }
    get y() {
        let dy = this.hitbox.position.y - this.position.y;
        const radius = this.hitbox.height / 2;
        if (Math.abs(dy) > radius)
            this.position.y += dy > 0 ? dy - radius : dy + radius;
        return this.position.y;
    }
}
