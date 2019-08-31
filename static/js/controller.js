"use strict";
class Controller {
    constructor(input, world) {
        this.input = input;
        this.world = world;
        this.operators = new Array();
    }
    tick(dt) {
        this.input.tick(dt);
        this.operators.forEach((op) => { op.tick(dt); });
    }
    releaseOperator(op) {
        let idx = this.operators.findIndex((o) => o == op);
        this.operators.splice(idx, 1);
    }
    setControl(entity, type) {
        let operator;
        switch (type) {
            case "nothing": {
                return;
            }
            case "user": {
                operator = new UserOperator(this, entity);
                break;
            }
            case "bot": {
                operator = new BotOperator(this, entity);
                break;
            }
            case "random": {
                operator = new RandomTextureOperator(this, entity);
                break;
            }
            case "explosion": {
                operator = new ExplosionOperator(this, entity);
                break;
            }
            case "bullet": {
                operator = new BulletOperator(this, entity);
                break;
            }
            default: {
                return;
            }
        }
        entity.addDeathListener((_) => this.releaseOperator(operator));
        this.operators.push(operator);
    }
}

"use strict";
class BotOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.slave.body.jumpSpeed = 100;
    }
    tick(dt) {
        if (this.controller.user && this.controller.user.hitbox.x1 > this.slave.hitbox.x1)
            this.slave.body.runSpeed = 100;
        else
            this.slave.body.runSpeed = -100;
    }
}
class UserOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        let textures = [
            slave.avatar.moveRight,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];
        this.controller.world.keepTrackOf(new FakePoint(slave.hitbox.position, new Point({ x: slave.hitbox.width / 2, y: slave.hitbox.height / 2 })));
        this.controller.user = slave;
        let speed = 150;
        this.controller.input.addPressAction(2 /* left */, (pressed) => {
            slave.body.runSpeed = pressed ? -speed : 0;
            return true;
        }).addPressAction(3 /* right */, (pressed) => {
            slave.body.runSpeed = pressed ? speed : 0;
            return true;
        }).addPressAction(1 /* jump */, (pressed) => {
            slave.body.jumpSpeed = pressed ? 150 : 0;
            return true;
        }).addPressAction(6 /* clone */, (pressed) => {
            if (pressed)
                return;
            this.controller.world.createEntity({
                avatar: new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]),
                controllerType: "bot",
                body: {
                    hitbox: new Hitbox(slave.hitbox.position.Sum(new Point({ x: slave.hitbox.width + 10, y: 0 })), 32, 32),
                    material: "stone",
                    movable: true
                }
            });
        });
    }
    tick(dt) {
        let textures = [
            new AnimatedFillRectangleTexture(new Color(255, 255, 255)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(0, 0, 255)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(255, 0, 0)),
            new AnimatedFillRectangleTexture(new Color(0, 255, 0), new Color(255, 0, 255)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
        ];
        if (!this.controller.input.mouse.clicks[0].empty) {
            this.controller.input.mouse.clicks[0].flush().forEach(position => {
                let pos = new Point({ x: this.slave.hitbox.width / 2, y: this.slave.hitbox.height / 2 }).Sum(this.slave.hitbox.position);
                let vect = position.Sum(pos.Neg());
                vect = vect.SMult(1 / vect.length());
                let t = textures[getRandomInt(0, textures.length - 1)];
                this.controller.world.createEntity({
                    avatar: new CaudateAvatar(new CompositeAvatar(t)),
                    controllerType: "explosion",
                    body: {
                        hitbox: new Hitbox(pos.Sum(vect.SMult(40)).Sum(new Point({ x: -5, y: -5 })), 10, 10),
                        material: "stone",
                        movable: true,
                        velocity: vect.SMult(200)
                    }
                });
            });
        }
    }
}
class RandomTextureOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
    }
    tick(dt) {
    }
}
class ExplosionOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.eventnum = slave.body.addCollisionEvent(((appendix) => {
            this.slave.body.removeCollisionEvent(this.eventnum);
            this.slave.die();
            let target = appendix;
            if (target.controllerType == "bot")
                target.die();
            for (let i = 1; i < 6; ++i) {
                let vect = new Point({ x: Math.sin(i / 6 * Math.PI + Math.PI / 2), y: -Math.cos(i / 6 * Math.PI - Math.PI / 2) });
                let t1 = new FillRectangleTexture(new Color(255, 200, 20));
                let t2 = new StrokeRectangleTexture(new Color(200, 20, 20, 0.25));
                this.controller.world.createEntity({
                    avatar: new CaudateAvatar(new CompositeAvatar(t1), new CompositeAvatar(t2)),
                    controllerType: "bullet",
                    body: {
                        hitbox: new Hitbox(slave.hitbox.position.Sum(vect.SMult(30)), slave.body.hitbox.width, slave.body.hitbox.height),
                        material: "stone",
                        movable: true,
                        velocity: vect.SMult(100)
                    }
                });
            }
        }));
    }
    tick(dt) {
    }
}
class BulletOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.time = 0;
    }
    tick(dt) {
        this.time += dt;
        if (this.time >= 2)
            this.slave.die();
    }
}
