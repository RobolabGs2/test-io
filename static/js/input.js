"use strict";
var Actions;
(function (Actions) {
    Actions[Actions["wtf"] = 0] = "wtf";
    Actions[Actions["jump"] = 1] = "jump";
    Actions[Actions["up"] = 2] = "up";
    Actions[Actions["down"] = 3] = "down";
    Actions[Actions["clone"] = 4] = "clone";
    Actions[Actions["zoom"] = 5] = "zoom";
    Actions[Actions["unzoom"] = 6] = "unzoom";
    Actions[Actions["left"] = 7] = "left";
    Actions[Actions["right"] = 8] = "right";
    Actions[Actions["COUNT"] = 9] = "COUNT";
})(Actions || (Actions = {}));
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["left"] = 0] = "left";
    MouseButtons[MouseButtons["center"] = 1] = "center";
    MouseButtons[MouseButtons["right"] = 2] = "right";
    MouseButtons[MouseButtons["COUNT"] = 3] = "COUNT";
})(MouseButtons || (MouseButtons = {}));

"use strict";
// TODO: create InputDevice as class
class InputDevicesManager {
    constructor(camera) {
        // TODO: multiaction
        this.pressingActions = new Map();
        this.pressActions = new Map();
        this.clickActions = new Array(MouseButtons.COUNT);
        this.action2key = new Array(Actions.COUNT);
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        let html = document.createElement('div');
        html.classList.add('keyboard');
        html.innerHTML = `<header>${"Keyboard"}</header>`;
        let keys = document.createElement('section');
        keys.classList.add('keys');
        html.appendChild(keys);
        this.action2key[Actions.jump] = "Space";
        this.action2key[Actions.right] = "KeyD";
        this.action2key[Actions.left] = "KeyA";
        this.action2key[Actions.clone] = "KeyF";
        this.action2key.forEach((keyCode, action) => {
            let key = document.createElement('div');
            key.classList.add('key');
            key.textContent = Actions[action]; //keyCode;
            // TODO: refactor
            key.addEventListener('mousedown', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Down);
            });
            key.addEventListener('touchstart', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Down);
            });
            key.addEventListener('mouseup', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Up);
            });
            key.addEventListener('touchend', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Up);
            });
            keys.appendChild(key);
        });
        let keyboardsPanel = document.getElementById('keyboard');
        if (keyboardsPanel === null)
            throw new Error("Keyboard panel not found!");
        keyboardsPanel.appendChild(html);
    }
    getInputDevice() {
        return this;
    }
    get mouseCursore() {
        return this.mouse.getCursore();
    }
    addClickAction(button, consumer) {
        this.clickActions[button] = consumer;
        return this;
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
        for (let i = 0; i < MouseButtons.COUNT; ++i) {
            if (this.clickActions[i])
                this.mouse.clicks[i].flush().forEach(this.clickActions[i]);
        }
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
