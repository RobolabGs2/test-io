"use strict";
class Avatar {
    constructor(texture) {
        this.texture = texture;
        this.tick = 0;
    }
    play(dt) {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1;
    }
    toJSON() {
        return this.texture;
    }
}
class BaseAvatar extends Avatar {
    modification(context, hitbox) {
        return context;
    }
    bindContext(camera) {
        return hitbox => {
            const context = camera.context;
            context.save();
            context.translate(-camera.position.x + hitbox.position.x, -camera.position.y + hitbox.position.y);
            let b = this.texture.draw(this.modification(context, hitbox), hitbox, this.tick);
            context.restore();
            return b;
        };
    }
}
class ReflectedAvatar extends BaseAvatar {
    modification(context, hitbox) {
        context.translate(hitbox.width, 0);
        context.scale(-1, 1);
        return context;
    }
}
class CompositeAvatar extends Avatar {
    constructor(texture) {
        super(texture);
        this.left = true;
        this.normal = new BaseAvatar(texture);
        this.reflect = new ReflectedAvatar(texture);
    }
    bindContext(camera) {
        let normal = this.normal.bindContext(camera);
        let reverse = this.reflect.bindContext(camera);
        return (hitbox) => {
            if (this.left)
                return normal(hitbox);
            return reverse(hitbox);
        };
    }
    play(dt) {
        this.left = dt >= 0;
        this.normal.play(dt);
        this.reflect.play(-dt);
    }
}
class AvatarFactory {
    constructor() {
        this.textureFactory = new TextureFactory();
    }
    make(type, src) {
        let t = this.textureFactory.make(type, src);
        if (t != false)
            return new CompositeAvatar(t);
        return t;
    }
}

"use strict";
class Camera {
    constructor(mainCanvas, size) {
        this.mainCanvas = mainCanvas;
        this.offset = new Point({});
        this._scale = 1;
        if (!size) {
            size = { width: mainCanvas.clientWidth, height: mainCanvas.clientHeight };
        }
        console.log(`Camera width: ${size.width}, height: ${size.height}`);
        this.mainCanvas.width = size.width;
        this.mainCanvas.height = size.height;
        this.context = this.mainCanvas.getContext("2d");
        this.hitbox = new Hitbox(new Point({}), size.width, size.height);
        let center = this.hitbox.center();
        this.context.translate(center.x, center.y);
    }
    setPosition(position, offset = new Point({})) {
        this.hitbox.position = position;
        this.offset = offset;
    }
    scale(delta) {
        let new_scale = (this._scale + delta);
        const newLocal = this._scale / new_scale;
        if (new_scale <= 0.0001)
            return;
        this.context.scale(newLocal, newLocal);
        this._scale = new_scale;
    }
    get position() {
        return new Point(this.hitbox.position.Sum(this.offset));
    }
    toJSON() {
        return undefined;
    }
    clear() {
        this.context.fillStyle = "#000";
        this.context.fillRect(-this.hitbox.width / 2 * this._scale, -this.hitbox.height / 2 * this._scale, this.hitbox.width * this._scale, this.hitbox.height * this._scale);
        //this.context.clearRect(0, 0, 256, 256);
        /*
        this.context.lineWidth = 5
        this.context.beginPath()
        this.context.moveTo(-this.hitbox.width/2, -this.hitbox.height/2)
        this.context.lineTo(this.hitbox.width, this.hitbox.height)
        this.context.moveTo(-this.hitbox.width/2, this.hitbox.height/2)
        this.context.lineTo(this.hitbox.width, -this.hitbox.height)
        this.context.stroke()*/
    }
}

"use strict";
class AnimatedTexture extends Typeable {
}
class Color extends Typeable {
    constructor(R, G, B, A = 255, _type = "Color") {
        super(_type);
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
    }
    toString() {
        return `rgba(${this.R},${this.G},${this.B},${this.A})`;
    }
    static unpack({ R, G, B, A }) {
        return new Color(R, G, B, A);
    }
}
class RedToGreen extends Typeable {
    progress(progress) {
        if (progress < 0)
            progress = 1 + progress;
        progress = progress - 0.5;
        return new Color(255 * Math.abs(2 * progress), 255 - 255 * Math.abs(2 * progress), 0);
    }
    constructor() {
        super("RedToGreen");
    }
}
class Gradient {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.dC = new Color(to.R - from.R, to.G - from.G, to.B - from.B);
    }
    progress(progress) {
        return new Color(this.from.R + progress * this.dC.R, this.from.G + progress * this.dC.G, this.from.B + progress * this.dC.B);
    }
}
class ColoredTexture extends AnimatedTexture {
    constructor(type, color) {
        super(type);
        this.color = color;
    }
    draw(context, hitbox, progress) {
        this.play(progress);
        if (this.color != undefined) {
            context.fillStyle = this.color.toString();
            context.strokeStyle = this.color.toString();
        }
        this.drawing(context, hitbox, progress);
        return true;
    }
    play(progress) { }
}
class FillRectangleTexture extends ColoredTexture {
    drawing(context, hitbox, progress) {
        context.fillRect(0, 0, hitbox.width, hitbox.height);
    }
    play(progress) {
    }
    constructor(color) {
        super("FillRectangleTexture", color);
    }
}
class AnimatedFillRectangleTexture extends FillRectangleTexture {
    play(progress) {
        progress = progress * 2;
        if (progress > 1)
            progress = 2 - progress;
        this.color = new Gradient(new Color(255, 128, 0), new Color(0, 128, 255)).progress(progress);
    }
}
class StrokeRectangleTexture extends ColoredTexture {
    drawing(context, hitbox, progress) {
        context.strokeRect(0, 0, hitbox.width, hitbox.height);
    }
    constructor(color) {
        super("StrokeRectangleTexture", color);
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
        context.drawImage(this.bitmap, 0, 0, hitbox.width, hitbox.height);
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
        context.drawImage(this.bitmap, (this.frameSize) * dt, 0, this.frameSize, this.frameSize, 0, 0, hitbox.width, hitbox.height);
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
