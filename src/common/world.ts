interface Drawable {
    draw(camera: Camera): void;
}

interface DrawableMaker {
    makeDrawable(): Drawable;
}

class Entity extends Typeable implements DrawableMaker{
    makeDrawable(): Drawable {
        return {draw: this.avatar.bindContext(this.hitbox)};
    }

    counter = 0
    tick(dt: number) {
        this.avatar.play(this.body.velocity.x/50*dt)
    }

    body: IBody; 
    get hitbox() {return this.body.hitbox}

    constructor(public avatar: Avatar, body: IBody) {
        super("Entity");
        this.body = body;
    }
    
    //лучше было переопределить toJson в Body, чтоб он возвращал {movable, что-ещё нужно для создания}
    //деструктурирующее присваивание позволяет парсить и более глубоко, так что можно было бы это отловить в 
    //Entity.unpack, либо передать как объект в createBody
    toJSON() {
        return {hitbox:this.hitbox, avatar:this.avatar, movable:this.body.movable, _type: this._type}
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
    materials: Map<string, physicalMaterial>;

    constructor(physics: IPhysics) {
        super("World");
        this.mobs = new Array<Entity>();
        this.physics = physics;
        this.materials = new Map();
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

    createEntity({hitbox, avatar, controllerType, material, movable = true}: {hitbox: Hitbox, avatar: Avatar, controllerType: string, material: string, movable: boolean}){
        let entity = new Entity(avatar, this.physics.createBody(hitbox, new Point({}), this.materials.get(material) as physicalMaterial, movable));
        this.controller.setControl(entity, controllerType);

        this.pushEntity(entity);
        return entity;
    }

    pushDrawable(drawable: Drawable|DrawableMaker) {
        if(!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }
}