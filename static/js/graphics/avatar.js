"use strict";
class Camera {
    constructor(mainCanvas, width, height) {
        this.mainCanvas = mainCanvas;
        this.offset = new Point({});
        this._scale = 1;
        console.log(`Camera width: ${width}, height: ${height}`);
        this.mainCanvas.width = width;
        this.mainCanvas.height = height;
        this.context = this.mainCanvas.getContext("2d");
        this.hitbox = new Hitbox(new Point({}), width, height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBoaWNzL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxNQUFNO0lBSVIsWUFBbUIsVUFBNkIsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUE1RCxlQUFVLEdBQVYsVUFBVSxDQUFtQjtRQUZ4QyxXQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7UUFpQjlCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFkUCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixLQUFLLGFBQWEsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUE2QixDQUFDO1FBQzVFLElBQUksQ0FBQyxNQUFNLEdBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFlLEVBQUUsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUlELEtB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