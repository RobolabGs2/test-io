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
    setControl(entity, type) {
        switch (type) {
            case "nothing": {
                return;
            }
            case "user": {
                this.operators.push(new UserOperator(this, entity));
                return;
            }
            case "bot": {
                this.operators.push(new BotOperator(this, entity));
                return;
            }
            case "random": {
                this.operators.push(new RandomTextureOperator(this, entity));
                return;
            }
        }
    }
}

"use strict";
class BotOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.slave.body.jumpSpeed = 100;
        slave.body.addCollisionEvent((entity => this.slave.avatar.moveLeft = entity.avatar.moveLeft));
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
            slave.avatar.moveLeft,
            new FillRectangleTexture(new Color(255, 255, 255, 12)),
            new AnimatedFillRectangleTexture(new Color(255, 255, 255, 12)),
            new StrokeRectangleTexture(new Color(126, 63, 32)),
            new ImageTexture("duck16x16.png")
        ];
        this.controller.world.keepTrackOf(new FakePoint(slave.hitbox.position, new Point({ x: slave.hitbox.width / 2, y: slave.hitbox.height / 2 })));
        this.controller.user = slave;
        let speed = 150;
        this.controller.input.addPressAction(true, Actions.left, () => {
            slave.body.runSpeed = -speed;
            return true;
        }).addPressAction(false, Actions.left, () => {
            slave.body.runSpeed = 0;
            return true;
        }).addPressAction(true, Actions.right, () => {
            slave.body.runSpeed = speed;
            return true;
        }).addPressAction(false, Actions.right, () => {
            slave.body.runSpeed = 0;
            return true;
        }).addPressAction(true, Actions.jump, () => {
            slave.body.jumpSpeed = 150;
            return true;
        }).addPressAction(false, Actions.jump, () => {
            slave.body.jumpSpeed = 0;
            return true;
        }).addPressAction(false, Actions.clone, () => {
            this.controller.world.createEntity({
                avatar: new CompositeAvatar(textures[getRandomInt(0, textures.length - 1)]),
                controllerType: "bot",
                body: {
                    hitbox: new Hitbox(slave.hitbox.position.Sum(new Point({ x: 50, y: 0 })), 32, 32),
                    material: "stone",
                    movable: true
                }
            });
        });
    }
    tick(dt) {
    }
}
class RandomTextureOperator {
    constructor(controller, slave) {
        this.slave = slave;
        this.controller = controller;
        this.slave.body.jumpSpeed = 300;
        this.eventnum = slave.body.addCollisionEvent(((_) => {
            console.log("hello");
            this.slave.body.jumpSpeed = 0;
            this.slave.body.removeCollisionEvent(this.eventnum);
        }));
        slave.body.addCollisionEvent((entity => this.slave.avatar.moveLeft = entity.avatar.moveLeft));
    }
    tick(dt) {
    }
}
