"use strict";
class InputDevices {
    constructor(camera) {
        this.pressingActions = new Map();
        this.pressActions = new Map();
        this.action2key = new Array(9 /* COUNT */);
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        //todo render in html
        this.action2key[1 /* jump */] = "Space";
        this.action2key[3 /* right */] = "KeyD";
        this.action2key[2 /* left */] = "KeyA";
        this.action2key[5 /* down */] = "KeyS";
        this.action2key[6 /* clone */] = "KeyF";
    }
    get mousePosition() {
        return this.mouse.position;
    }
    get mouseCursore() {
        return this.mouse.getCursore();
    }
    addPressingAction(action, consumer) {
        this.pressingActions.set(action, consumer);
        return this;
    }
    addPressAction(action, consumer) {
        this.pressActions.set(action, consumer);
        return this;
    }
    tick(dt) {
        this.action2key.forEach((key, action) => {
            if (this.keyboard.keys.get(key) && this.pressingActions.has(action))
                this.keyboard.keys.set(key, this.pressingActions.get(action)(dt));
        });
        enumValues(KeyState).forEach(keyState => {
            this.keyboard.getBufferOfKeys(keyState).forEach((key) => {
                let action = this.action2key.indexOf(key);
                if (this.pressActions.has(action))
                    this.pressActions.get(action)(keyState === KeyState.Down);
            });
        });
        let wheel = this.mouse.whell; /*
        if(this.pressActions.has(Actions.zoom))
            for(let i = 0; i<wheel/100; ++i)
                (this.pressActions.get(Actions.zoom) as PressAction)()
        if(this.pressActions.has(Actions.unzoom))
            for(let i = 0; i<-wheel/100; ++i)
                (this.pressActions.get(Actions.unzoom) as PressAction)()
            */
    }
}

"use strict";
var KeyState;
(function (KeyState) {
    KeyState[KeyState["Down"] = 1] = "Down";
    KeyState[KeyState["Up"] = 0] = "Up";
})(KeyState || (KeyState = {}));
class Keyboard {
    constructor() {
        this.keys = new Map();
        this.buffers = new Array(new Buffer(), new Buffer());
        window.addEventListener("keydown", this.createEventListener(KeyState.Down));
        window.addEventListener("keyup", this.createEventListener(KeyState.Up));
    }
    set(code, state) {
        this.keys.set(code, state === KeyState.Down);
        this.buffers[state].push(code);
    }
    createEventListener(keyState) {
        return (ev) => {
            this.set(ev.code, keyState);
            if (ev.code.startsWith('Key'))
                ev.preventDefault();
        };
    }
    getBufferOfKeys(press) {
        return this.buffers[press].flush();
    }
}

"use strict";
class Mouse {
    constructor(camera) {
        this.camera = camera;
        this._whell = 0;
        this.position = new Point({});
        this.clicks = new Array(new Buffer(), new Buffer(), new Buffer());
        this.buttons = new Array(false, false, false, false, false);
        let element = camera.mainCanvas;
        element.addEventListener("wheel", (event) => {
            this._whell += event.deltaY;
            event.preventDefault();
        });
        element.addEventListener("mousemove", (event) => {
            this.setPositionByEvent(event);
            event.preventDefault();
        });
        element.addEventListener("mousedown", (event) => {
            this.setButton(event.button, true);
            //event.preventDefault();
        });
        element.addEventListener("mouseup", (event) => {
            this.setButton(event.button, false);
            event.preventDefault();
        });
        element.addEventListener("contextmenu", (event) => {
            this.setPositionByEvent(event);
            this.addClick(2, new Point(this.position));
            event.preventDefault();
        });
        element.addEventListener("click", (event) => {
            this.setPositionByEvent(event);
            this.addClick(0, new Point(this.position));
            event.preventDefault();
        });
        element.addEventListener("dblclick", (event) => {
            event.preventDefault();
        });
    }
    get whell() {
        let c = this._whell;
        this._whell = 0;
        return c;
    }
    get left() {
        return this.buttons[0];
    }
    get center() {
        return this.buttons[1];
    }
    get right() {
        return this.buttons[2];
    }
    getCursore() {
        //return new MouseCursore(this.position);
    }
    setPositionByEvent(event) {
        let newPosition = new Point({ x: event.offsetX, y: event.offsetY });
        newPosition = this.camera.canvas2xy(newPosition);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
        //console.log(`${event.offsetX}:${event.offsetY}`)
    }
    setButton(button, state) {
        if (button < this.buttons.length)
            this.buttons[button] = state;
    }
    addClick(button, position) {
        if (button < this.clicks.length)
            this.clicks[button].push(position);
    }
}
/*class MouseCursore implements Drawable{
    avatar = new CompositeAvatar(new FillRectangleTexture(new Color(0, 255, 255, 0.8)));

    constructor(private position: Point) {
        this.draw = camera => this.avatar.drawHitbox(new Hitbox(this.position, 10, 10), camera);
    }
    draw(camera: Camera): void {
    }
    
    set texture(texture: AnimatedTexture) {
        this.avatar.moveRight = texture;
    }
}*/ 
