enum Actions {
    wtf, jump, left, right, up, down, clone, zoom, unzoom, COUNT  
}


type PressingAction = (dt: number) => boolean;
type PressAction = (pressed: boolean) => void;
type ClickAction = (position: Point) => void;

class InputDevices {
    public mouse: Mouse;
    private keyboard: Keyboard;
    pressingActions = new Map<Actions, PressingAction>()
    pressActions = new Map<Actions, PressAction>()
    action2key = new Array<string>(Actions.COUNT);

    get mousePosition() {
        return this.mouse.position;
    }

    get mouseCursore() {
        return this.mouse.getCursore();
    }

    addPressingAction(action: Actions, consumer: PressingAction) {
        this.pressingActions.set(action, consumer);
        return this;
    }

    addPressAction(action: Actions, consumer: PressAction) {
            this.pressActions.set(action, consumer);
        return this;
    }

    tick(dt: number) {
        this.action2key.forEach(
            (key: string, action: Actions) => {
                if(this.keyboard.keys.get(key) && this.pressingActions.has(action))
                    this.keyboard.keys.set(key, (this.pressingActions.get(action) as PressingAction)(dt));
            }
        );

        enumValues(KeyState).forEach(keyState => {
            this.keyboard.getBufferOfKeys(keyState).forEach(
                (key: string) => {
                    let action = this.action2key.indexOf(key);
                    if(this.pressActions.has(action))
                        (this.pressActions.get(action) as PressAction)(keyState === KeyState.Down);
                }
            );
        })
        
        let wheel = this.mouse.whell;/*
        if(this.pressActions.has(Actions.zoom))
            for(let i = 0; i<wheel/100; ++i)
                (this.pressActions.get(Actions.zoom) as PressAction)()
        if(this.pressActions.has(Actions.unzoom))
            for(let i = 0; i<-wheel/100; ++i)
                (this.pressActions.get(Actions.unzoom) as PressAction)()
            */
    }

    constructor(camera: Camera) {
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        let html = document.createElement('div');
        html.classList.add('keyboard');
        html.innerHTML = `<header>${"Keyboard_1"}</header>`;
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
            key.textContent = Actions[action]//keyCode;
            key.addEventListener('mousedown', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Down);
            });
            key.addEventListener('mouseup', (ev) => {
                ev.preventDefault();
                this.keyboard.set(keyCode, KeyState.Up);
            });
            keys.appendChild(key);
        });
        let keyboardsPanel = document.getElementById('keyboard') as HTMLElement;
        if(keyboardsPanel === null)
            throw new Error("Keyboard panel not found!");
        keyboardsPanel.appendChild(html);
    }
}