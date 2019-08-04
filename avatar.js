"use strict";
class Color {
    constructor(r, g, b, a = 255) {
        this.A = a;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    to_string() {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }
}
class ImageAvatar {
    bindContext(context) {
        return (hitbox) => {
            context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(filename) {
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => this.bitmap = bitmap);
        };
        img.src = filename;
    }
}
class RectangleAvatar {
    bindContext(context) {
        return (hitbox) => {
            context.fillStyle = this.color.to_string();
            context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(color) {
        this.color = color;
    }
}
class StrokeRectangleAvatar {
    bindContext(context) {
        return (hitbox) => {
            context.strokeStyle = this.color.to_string();
            context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
    constructor(color) {
        this.color = color;
    }
}
