const enum Actions {
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
        this.keyboard.getBuferOfKeys(true).forEach(
            (key: string) => {
                let action = this.action2key.indexOf(key);
                if(this.pressActions.has(action))
                    (this.pressActions.get(action) as PressAction)(true);
            }
        );
        let wheel = this.mouse.whell;/*
        if(this.pressActions.has(Actions.zoom))
            for(let i = 0; i<wheel/100; ++i)
                (this.pressActions.get(Actions.zoom) as PressAction)()
        if(this.pressActions.has(Actions.unzoom))
            for(let i = 0; i<-wheel/100; ++i)
                (this.pressActions.get(Actions.unzoom) as PressAction)()
            */

        this.keyboard.getBuferOfKeys(false).forEach(
            (key: string) => {
                let action = this.action2key.indexOf(key);
                if(this.pressActions.has(action))
                    (this.pressActions.get(action) as PressAction)(false);
            }
        );
    }

    constructor(camera: Camera) {
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        //todo render in html
        this.action2key[Actions.jump] = "Space";
        this.action2key[Actions.right] = "KeyD";
        this.action2key[Actions.left] = "KeyA";
        this.action2key[Actions.down] = "KeyS";
        this.action2key[Actions.clone] = "KeyF";
    }
}