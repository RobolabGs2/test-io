"use strict";
class Camera {
    constructor(context, hitbox = new Hitbox(new Point({}), 512, 512), offset = new Point({})) {
        this.context = context;
        this.hitbox = hitbox;
        this.offset = offset;
        this._scale = 1;
        let center = hitbox.center();
        context.translate(center.x, center.y);
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
class ReflectedAvatar extends Avatar {
    modification(context, hitbox) {
        context.translate(hitbox.width, 0);
        context.scale(-1, 1);
        return context;
    }
}
class AvatarFactory {
    constructor() {
        this.textureFactory = new TextureFactory();
    }
    make(type, src) {
        let t = this.textureFactory.make(type, src);
        if (t != false)
            return new Avatar(t);
        return t;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBoaWNzL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxNQUFNO0lBQ1IsWUFBbUIsT0FBaUMsRUFBUyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBUyxTQUFTLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUFySCxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXNDO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFVeEksV0FBTSxHQUFHLENBQUMsQ0FBQztRQVRQLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZSxFQUFFLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFJRCxLQUFLLENBQUMsS0FBYTtRQUNmLElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN6QyxJQUFHLFNBQVMsSUFBRSxNQUFNO1lBQ2hCLE9BQU07UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxT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