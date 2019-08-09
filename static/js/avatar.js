"use strict";
class Avatar extends Typeable {
    play(dt) { }
    ;
}
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
class ImageAvatar extends Avatar {
    constructor(filename) {
        super("ImageAvatar");
        this.filename = filename;
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => this.bitmap = bitmap);
        };
        img.src = "./static/img/" + filename;
    }
    bindContext(context) {
        return (hitbox) => {
            context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
        };
    }
}
class RectangleAvatar extends Avatar {
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
class StrokeRectangleAvatar extends Avatar {
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
class ImageSource extends Typeable {
    constructor(filename, type = "ImageSource") {
        super(type);
        this.filename = filename;
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => {
                this.bitmap = bitmap;
                this.onload(bitmap);
            });
        };
        img.src = "./static/img/" + filename;
    }
    onload(bitmap) { }
}
class AnimationSource extends ImageSource {
    constructor(filename, frameSize, type = "AnimationSource") {
        super(filename, type);
        this.frameSize = frameSize;
    }
    onload(bitmap) {
    }
}
class AnimatedAvatar extends Typeable {
    constructor(filename) {
        super("AnimatedAvatar");
        this.filename = filename;
        this.tick = 0;
        let img = new Image();
        img.onload = () => {
            createImageBitmap(img).then(bitmap => { this.bitmap = bitmap; });
        };
        img.src = "./static/img/" + filename;
    }
    bindContext(context) {
        return (hitbox) => {
            if (this.bitmap) {
                const frameSize = this.bitmap.height;
                const frameCount = this.bitmap.width / frameSize;
                let dt = Math.floor(frameCount * this.tick);
                console.log(`${dt} ${frameCount} ${this.tick}`);
                context.transform;
                context.drawImage(this.bitmap, (frameSize + 1) * dt, 0, frameSize, frameSize, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
            }
            ;
        };
    }
    play(dt) {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1;
    }
}
