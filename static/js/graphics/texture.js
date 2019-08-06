"use strict";
class AnimatedTexture extends Typeable {
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
class ColoredTexture extends AnimatedTexture {
    constructor(type, colorStroke, colorFill) {
        super(type);
        this.colorStroke = colorStroke;
        this.colorFill = colorFill;
    }
    draw(context, hitbox, progress) {
        this.play(progress);
        if (this.colorFill != undefined)
            context.fillStyle = this.colorFill.to_string();
        if (this.colorStroke != undefined)
            context.strokeStyle = this.colorStroke.to_string();
        this.drawing(context, hitbox, progress);
        return true;
    }
    play(progress) { }
}
class FillRectangleTexture extends ColoredTexture {
    drawing(context, hitbox, progress) {
        context.fillRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }
    constructor(color) {
        super("FillRectangleTexture", undefined, color);
    }
}
class AnimatedFillRectangleTexture extends FillRectangleTexture {
    play(progress) {
        this.colorFill.R = 128 + 128 * progress;
        this.colorFill.B = 128 - 128 * progress;
    }
}
class StrokeRectangleTexture extends ColoredTexture {
    drawing(context, hitbox, progress) {
        context.strokeRect(hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }
    constructor(color) {
        super("StrokeRectangleTexture", color, undefined);
    }
}
class ImageTexture extends AnimatedTexture {
    constructor(filename, type = "ImageTexture") {
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
    loaded() {
        return this.bitmap != null;
    }
    drawing(context, hitbox, progress) {
        context.drawImage(this.bitmap, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }
    draw(context, hitbox, progress) {
        if (this.loaded()) {
            this.drawing(context, hitbox, progress);
            return true;
        }
        return false;
    }
    onload(bitmap) { }
}
class AnimatedImageTexture extends ImageTexture {
    constructor(filename, frameSize, type = "AnimatedImageTexture") {
        super(filename, type);
        this.frameSize = frameSize;
    }
    drawing(context, hitbox, progress) {
        const frameCount = this.bitmap.width / this.frameSize;
        let dt = Math.floor(frameCount * progress);
        context.drawImage(this.bitmap, (this.frameSize + 1) * dt, 0, this.frameSize, this.frameSize, hitbox.position.x, hitbox.position.y, hitbox.width, hitbox.height);
    }
}
function chooseExist(a, b) {
    if (a)
        return a;
    return b;
}
class TextureFactory {
    make(type, src) {
        switch (type) {
            case "FillRectangleTexture":
                return new FillRectangleTexture(chooseExist(src.color, src.colorFill));
            case "StrokeRectangleTexture":
                return new StrokeRectangleTexture(chooseExist(src.color, src.colorStroke));
            case "ImageTexture":
                return new ImageTexture(src.filename);
            case "AnimatedImageTexture":
                return new AnimatedImageTexture(src.filename, src.frameSize);
            default:
                return false;
        }
    }
}
