// TODO: create InputDevice as class
class InputDevicesManager implements InputDevice {
    public mouse: Mouse;
    private keyboard: Keyboard;
    // TODO: multiaction
    pressingActions = new Map<Actions, PressingAction>()
    pressActions = new Map<Actions, PressAction>()
    clickActions = new Array<ClickAction>(MouseButtons.COUNT)
    action2key = new Array<string>(Actions.COUNT);
    scroll2action = new Array<Actions>(2); //[0] - up, [1] - down

    getInputDevice(): InputDevice {
        return this;
    }

    get mouseCursore() {
        return this.mouse.getCursore();
    }

    addClickAction(button: MouseButtons, consumer: ClickAction) {
        this.clickActions[button] = consumer
        return this
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
                if (this.keyboard.keys.get(key) && this.pressingActions.has(action))
                    this.keyboard.keys.set(key, (this.pressingActions.get(action) as PressingAction)(dt));
            }
        );

        enumValues(KeyState).forEach(keyState => {
            this.keyboard.getBufferOfKeys(keyState).forEach(
                (key: string) => {
                    let action = this.action2key.indexOf(key);
                    if (this.pressActions.has(action))
                        (this.pressActions.get(action) as PressAction)(keyState === KeyState.Down);
                }
            );
        })

        let wheel = this.mouse.whell/100;
        const upScroolAction = this.scroll2action[1];
        const downScroolAction = this.scroll2action[0];
        if(this.pressActions.has(upScroolAction)) {
            for(let i = 0; i<wheel; ++i) {
                const actionConsumer = this.pressActions.get(upScroolAction) as PressAction;
                actionConsumer(true);
                actionConsumer(false);
            }
        }
        if(this.pressActions.has(downScroolAction)) {
            for(let i = 0; i<-wheel; ++i) {
                const actionConsumer = this.pressActions.get(downScroolAction) as PressAction;
                actionConsumer(true);
                actionConsumer(false);
            }
        }

        for (let i = 0; i < MouseButtons.COUNT; ++i) {
            if (this.clickActions[i])
                this.mouse.clicks[i].flush().forEach(this.clickActions[i])
        }
    }

    constructor(camera: Camera) {
        this.mouse = new Mouse(camera);
        this.addPressAction(Actions.zoom, pressed => {
            if (pressed) {
                camera.scale(-0.1)
                console.debug(pressed)
            }
        })
        this.addPressAction(Actions.unzoom, pressed => {
            if (pressed)
                camera.scale(0.1)
        })
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
        this.action2key[Actions.zoom] = "Equal";
        this.action2key[Actions.unzoom] = "Minus";
        this.scroll2action[0] = Actions.zoom;
        this.scroll2action[1] = Actions.unzoom;
        this.action2key.forEach((keyCode, action) => {
            let key = document.createElement('div');
            key.classList.add('key');
            key.textContent = Actions[action]//keyCode;
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
        let keyboardsPanel = document.getElementById('keyboard') as HTMLElement;
        if (keyboardsPanel === null)
            throw new Error("Keyboard panel not found!");
        keyboardsPanel.appendChild(html);
    }
}