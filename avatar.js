"use strict";
class Color extends Typeable {
    constructor(r, g, b, a = 255) {
        super("Color");
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    to_string() {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }
    static unpack({ R, G, B, A }) {
        return new Color(R, G, B, A);
    }
}
class ImageAvatar extends Typeable {
    constructor(filename) {
        super("ImageAvatar");
        this.filename = filename;
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => this.bitmap = bitmap);
        };
        img.src = filename;
    }
    bindContext(context) {
        return (hitbox) => {
            context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
}
class RectangleAvatar extends Typeable {
    bindContext(context) {
        return (hitbox) => {
            context.fillStyle = this.color.to_string();
            context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(color) {
        super("RectangleAvatar");
        this.color = color;
    }
}
class StrokeRectangleAvatar extends Typeable {
    bindContext(context) {
        return (hitbox) => {
            context.strokeStyle = this.color.to_string();
            context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(color) {
        super("StrokeRectangleAvatar");
        this.color = color;
    }
}
