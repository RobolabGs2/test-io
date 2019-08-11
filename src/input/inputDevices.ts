enum Actions {
    wtf, jump, left, right, up, down, clone, zoom, unzoom, COUNT  
}

type PressingAction = (dt: number) => boolean;
type DownAction = () => void;
type UpAction = () => void;
type ClickAction = (position: Point) => void;

class InputDevices {
    public mouse: Mouse;
    private keyboard: Keyboard;
    pressingActions = new Map<Actions, PressingAction>()
    upActions = new Map<Actions, UpAction>()
    downActions = new Map<Actions, DownAction>()
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

    addPressAction(press: boolean, action: Actions, consumer: DownAction|UpAction) {
        if(press)
            this.downActions.set(action, consumer);
        else
            this.upActions.set(action, consumer);
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
                if(this.downActions.has(action))
                    (this.downActions.get(action) as DownAction)();
            }
        );
        let wheel = this.mouse.whell;
        if(this.downActions.has(Actions.zoom))
            for(let i = 0; i<wheel/100; ++i)
                (this.downActions.get(Actions.zoom) as DownAction)()
        if(this.downActions.has(Actions.unzoom))
            for(let i = 0; i<-wheel/100; ++i)
                (this.downActions.get(Actions.unzoom) as DownAction)()
            

        this.keyboard.getBuferOfKeys(false).forEach(
            (key: string) => {
                let action = this.action2key.indexOf(key);
                if(this.upActions.has(action))
                    (this.upActions.get(action) as DownAction)();
            }
        );
    }

    constructor(camera: Camera) {
        this.mouse = new Mouse(camera);
        this.keyboard = new Keyboard();
        this.action2key[Actions.jump] = "Space";
        this.action2key[Actions.right] = "KeyD";
        this.action2key[Actions.left] = "KeyA";
        this.action2key[Actions.down] = "KeyS";
        this.action2key[Actions.clone] = "KeyF";
    }
}