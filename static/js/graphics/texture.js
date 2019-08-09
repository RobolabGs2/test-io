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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaGljcy90ZXh0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFhQSxNQUFlLGVBQWdCLFNBQVEsUUFBUTtDQUM5QztBQUVELE1BQU0sS0FBTSxTQUFRLFFBQVE7SUFDeEIsWUFBbUIsQ0FBUyxFQUFTLENBQVMsRUFBUyxDQUFTLEVBQVMsSUFBSSxHQUFHLEVBQUUsS0FBSyxHQUFHLE9BQU87UUFDN0YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBREUsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBTTtJQUVoRixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDM0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQWtEO1FBQ3hFLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNKO0FBTUQsTUFBTSxVQUFXLFNBQVEsUUFBUTtJQUM3QixRQUFRLENBQUMsUUFBZ0I7UUFDckIsSUFBRyxRQUFRLEdBQUcsQ0FBQztZQUNYLFFBQVEsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQzVCLFFBQVEsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFBO1FBQ3pCLE9BQU8sSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcs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