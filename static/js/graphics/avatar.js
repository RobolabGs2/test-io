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
class SimpleAvatar extends Avatar {
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
class ReflectedAvatar extends SimpleAvatar {
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
        this.normal = new SimpleAvatar(texture);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBoaWNzL2F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxNQUFNO0lBQ1IsWUFBbUIsT0FBaUMsRUFBUyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBUyxTQUFTLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUFySCxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXNDO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFVeEksV0FBTSxHQUFHLENBQUMsQ0FBQztRQVRQLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZSxFQUFFLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFJRCxLQUFLLENBQUMsS0FBYTtRQUNmLElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN6QyxJQUFHLFNBQVMsSUFBRSxNQUFNO1lBQ2hCLE9BQU07UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxT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