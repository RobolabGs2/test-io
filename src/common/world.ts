interface Drawable {
    draw(camera: Camera): void;
}

interface DrawableMaker {
    makeDrawable(): Drawable;
}

interface Operable {
    controllerType: string;
}


class Entity extends Typeable implements DrawableMaker, Operable{
    makeDrawable(): Drawable {
        return {draw: this.avatar.bindContext(this.hitbox)};
    }

    tick(dt: number) {
        this.avatar.play(this.body.velocity.x/50*dt)
    }

    get hitbox() {return this.body.hitbox}

    constructor(public avatar: Avatar, public body: IBody, public controllerType: string) {
        super("Entity");
    }
}

class World extends Typeable {
    
    setCamera(camera: Camera, user: Entity) {
        this.camera = camera
        this.camera.setPosition(user.hitbox.position, new Point({x:user.hitbox.width/2, y:user.hitbox.height/2}));
    }
    
    draw(): void {
        this.camera.clear()
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
    }

    mobs: Array<Entity>;
    drawables = new Array<Drawable>();
    private camera!: Camera;
    physics: IPhysics;
    controller: Controller;
    materials: ResourceManager<physicalMaterial>;

    constructor(physics: IPhysics) {
        super("World");
        this.mobs = new Array<Entity>();
        this.physics = physics;
        this.materials = new ResourceManager();
        this.controller = new Controller(this);

        this.materials.set("duck", new physicalMaterial(0.9, 0.05, 30));
        this.materials.set("stone", new physicalMaterial(0.9, 0.05, 170));
    }

    tick(dt: number){
        this.physics.tick(dt);
        this.controller.tikc(dt);
        this.mobs.forEach(m => m.tick(dt));
    }

    private pushEntity(entity: Entity) {
        this.mobs.push(entity);
        this.pushDrawable(entity);
    }

    createEntity({avatar, controllerType, body:{hitbox, material, movable = true}}:
                {avatar: Avatar, controllerType: string, body:{hitbox: Hitbox, material: string, movable: boolean}}){
        let entity = new Entity(avatar, this.physics.createBody(hitbox, new Point({}), this.materials.get(material) as physicalMaterial, movable), controllerType);
        this.controller.setControl(entity, controllerType);

        this.pushEntity(entity);
        return entity;
    }

    pushDrawable(drawable: Drawable|DrawableMaker) {
        if(!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }

    toJSON() {
        return this.mobs;
    }
}