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
    
    static unpack({hitbox, avatar, movable = true}: {hitbox: Hitbox, avatar: Avatar, movable: boolean}, physics: IPhysics) {
        return new Entity(avatar, physics.createBody(hitbox, new Point({}), movable));
    }
    //лучше было переопределить toJson в Body, чтоб он возвращал {movable, что-ещё нужно для создания}
    //деструктурирующее присваивание позволяет парсить и более глубоко, так что можно было бы это отловить в 
    //Entity.unpack, либо передать как объект в createBody
    toJSON() {
        return {hitbox:this.hitbox, avatar:this.avatar, movable:this.body.movable, _type: this._type}
    }
}

class World extends Typeable {
    setCamera(camera: Camera) {
        this.camera = camera
        this.camera.setPosition(this.user.hitbox.position, new Point({x:this.user.hitbox.width/2, y:this.user.hitbox.height/2}));
    }

    draw(): void {
        this.camera.clear()
        this.drawables.forEach(mob => {
            mob.draw(this.camera);
        });
        this.drawableUser.draw(this.camera);
    }

    user: Entity;
    mobs: Array<Entity>;
    drawables = new Array<Drawable>();
    drawableUser: Drawable;
    private camera!: Camera;
    physics: IPhysics;

    constructor(user: Entity, physics: IPhysics) {
        super("World");
        this.user = user;
        this.drawableUser = user.makeDrawable();
        this.mobs = new Array<Entity>();
        this.physics = physics;
    }

    tick(dt: number){
        this.physics.tick(dt);
        this.mobs.forEach(m => m.tick(dt));
        this.user.tick(dt);
    }

    private pushEntity(entity: Entity) {
        this.mobs.push(entity);
        this.pushDrawable(entity);
    }

    pushRawEntity(avatar: Avatar, hitbox: Hitbox) {
        this.pushEntity(new Entity(avatar, this.physics.createBody(hitbox, new Point({}), true)));
    }

    pushDrawable(drawable: Drawable|DrawableMaker) {
        if(!("draw" in drawable))
            drawable = drawable.makeDrawable();
        this.drawables.push(drawable);
    }

    static unpack({user, mobs}: {user: Entity, mobs: Array<Entity>}, physics: IPhysics) {
        let w = new World(user, physics);            
        mobs.forEach(mob => w.pushEntity(mob));
        return w;
    }
}