"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["stop"] = 0] = "stop";
    Direction[Direction["left"] = 1] = "left";
    Direction[Direction["right"] = 2] = "right";
})(Direction || (Direction = {}));
class AvatarState {
    play(dt) {
        this.tick += dt;
        if (this.tick > 1)
            this.tick -= 1;
        if (this.tick < 0)
            this.tick += 1;
    }
    constructor({ tick = 0, direction = Direction.stop }) {
        this.tick = tick;
        this.direction = direction;
    }
}
class Avatar {
    constructor(moveRight, moveLeft) {
        this.moveRight = moveRight;
        this.moveLeft = moveLeft;
        this.state = new AvatarState({});
    }
    toJSON() {
        return undefined; //this.texture;
    }
}
function speedToDirection(speed) {
    if (speed === 0)
        return Direction.stop;
    return speed < 0 ? Direction.left : Direction.right;
}
class CompositeAvatar extends Avatar {
    drawHitbox(hitbox, camera) {
        switch (this.state.direction) {
            case Direction.left:
                return camera.draw(hitbox.position, (context) => this.moveLeft.draw(context, hitbox, this.state.tick));
            case Direction.stop:
            case Direction.right:
                return camera.draw(hitbox.position, (context) => this.moveRight.draw(context, hitbox, this.state.tick));
        }
    }
    move(dt, direction) {
        this.state.direction =
            direction == Direction.stop ? this.state.direction : direction;
        this.state.play(dt);
    }
    constructor(moveRight, moveLeft) {
        super(moveRight, moveLeft ? moveLeft : new ReflectModificator(moveRight));
    }
}
class CaudateAvatar {
    constructor(main, tail, tailSize = 20) {
        this.main = main;
        this.tail = tail ? tail : new CompositeAvatar(main.moveRight, main.moveLeft);
        this.history = new RingBuffer(tailSize);
    }
    move(dt, direction) {
        this.main.move(dt, direction);
    }
    get moveRight() {
        return this.main.moveRight;
    }
    get moveLeft() {
        return this.main.moveLeft;
    }
    //counter = 0;
    drawHitbox(hitbox, camera) {
        this.history.forEach(history => {
            this.tail.state = history.state;
            this.tail.drawHitbox(history.hitbox, camera);
        });
        this.main.drawHitbox(hitbox, camera);
        //this.counter++;
        //if(this.counter > -1) {
        this.history.put({
            state: new AvatarState(this.main.state),
            hitbox: new Hitbox(new Point(hitbox.position), hitbox.width, hitbox.height)
        });
        //this.counter = 0;
        //}
        return true;
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
        this._scale = 1;
        this.size = size ? size : { width: mainCanvas.clientWidth, height: mainCanvas.clientHeight };
        console.log(`Camera width: ${this.size.width}, height: ${this.size.height}`);
        this.mainCanvas.width = this.size.width;
        this.mainCanvas.height = this.size.height;
        this.context = this.mainCanvas.getContext("2d");
        this._position = new Point({});
        this.context.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    }
    setPosition(position) {
        this._position = new PointInHitbox(new ReadonlyHitbox(position, this.size.width / 2, this.size.height / 2));
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
        return new Point(this._position);
    }
    xy2uv(xy) {
        return xy.Sum(this.position.Neg());
    }
    uv2xy(uv) {
        return uv.Sum(this.position);
    }
    canvas2xy(canvas) {
        let xy = canvas.Sum(new Point({ x: -this.size.width / 2, y: -this.size.height / 2 }));
        xy.x *= this._scale;
        xy.y *= this._scale;
        let position = this.position;
        xy.x += position.x;
        xy.y += position.y;
        return xy;
    }
    screen2uv(screen) {
        return screen
            .SMult(this._scale);
    }
    toJSON() {
        return undefined;
    }
    draw(where, how) {
        this.context.save();
        let uv = this.xy2uv(where);
        this.context.translate(uv.x, uv.y);
        let b = how(this.context);
        this.context.restore();
        return b;
    }
    clear() {
        this.context.fillStyle = "#000";
        this.context.fillRect(-this.size.width / 2 * this._scale, -this.size.height / 2 * this._scale, this.size.width * this._scale, this.size.height * this._scale);
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
class AbstractAnimatedTexture extends Typeable {
}
class ModificatorTexture extends AbstractAnimatedTexture {
    constructor(original, _type) {
        super(_type);
        this.original = original;
    }
    draw(context, hitbox, progress) {
        this.predraw(context, hitbox);
        return this.original.draw(context, hitbox, this.recalcProgress(progress));
    }
}
class ReflectModificator extends ModificatorTexture {
    recalcProgress(progress) {
        return 1 - progress;
    }
    predraw(context, hitbox) {
        context.translate(hitbox.width, 0);
        context.scale(-1, 1);
    }
    constructor(original) {
        super(original, "ReflectModificator");
    }
}
class Color extends Typeable {
    constructor(R, G, B, A = 1, _type = "Color") {
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
class ColoredTexture extends AbstractAnimatedTexture {
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
        this.color = this.animated.progress(progress);
    }
    constructor(from = new Color(255, 128, 0), to = new Color(0, 128, 255)) {
        super(from);
        this.animated = new Gradient(from, to);
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
class ImageTexture extends AbstractAnimatedTexture {
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
        let dt = Math.floor((frameCount - 1) * progress);
        context.drawImage(this.bitmap, (this.frameSize) * dt, 0, this.frameSize, this.bitmap.height, 0, 0, hitbox.width, hitbox.height);
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
