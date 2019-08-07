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
        context.fillRect(0, 0, hitbox.width, hitbox.height);
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
        context.strokeRect(0, 0, hitbox.width, hitbox.height);
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
        context.drawImage(this.bitmap, (this.frameSize + 1) * dt, 0, this.frameSize, this.frameSize, 0, 0, hitbox.width, hitbox.height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaGljcy90ZXh0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFLQSxNQUFlLGVBQWdCLFNBQVEsUUFBUTtDQUU5QztBQUVELE1BQU0sS0FBTSxTQUFRLFFBQVE7SUFNeEIsWUFBWSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFDLEdBQUcsR0FBRztRQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDRCxTQUFTO1FBQ0wsT0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMzRCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBa0Q7UUFDeEUsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0o7QUFFRCxNQUFlLGNBQWUsU0FBUSxlQUFlO0lBQ2pELFlBQVksSUFBWSxFQUFZLFdBQW1CLEVBQVksU0FBaUI7UUFDaEYsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRG9CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQVksY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUVwRixDQUFDO0lBR0QsSUFBSSxDQUFDLE9BQWlDLEVBQUUsTUFBZ0IsRUFBRSxRQUFnQjtRQUN0RSxJ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