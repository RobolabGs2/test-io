class Mouse {
    
    private _whell = 0;
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
    readonly position = new Point({});
    readonly clicks = new Array<Buffer<Point>>(
        new Buffer<Point>(), 
        new Buffer<Point>(), 
        new Buffer<Point>());
    private buttons = new Array<boolean>(false, false, false, false, false);

    constructor(private camera: Camera) {
        let element = camera.mainCanvas;
        element.addEventListener("wheel", (event:WheelEvent) => {
            this._whell += event.deltaY
            event.preventDefault();
        });
        element.addEventListener("mousemove", (event: MouseEvent) => {
            this.setPositionByEvent(event);
            event.preventDefault()
        });
        element.addEventListener("mousedown", (event: MouseEvent) => {
            this.setButton(event.button, true);
            //event.preventDefault();
        });
        element.addEventListener("mouseup", (event: MouseEvent) => {
            this.setButton(event.button, false);
            event.preventDefault();
        });
        element.addEventListener("contextmenu", (event: MouseEvent) => {
            this.setPositionByEvent(event);
            this.addClick(2, new Point(this.position));
            event.preventDefault()
        })
        element.addEventListener("click", (event: MouseEvent) => {
            this.setPositionByEvent(event);
            this.addClick(0, new Point(this.position));
            event.preventDefault()
        })
        element.addEventListener("dblclick", (event: MouseEvent) => {
            event.preventDefault()
        })
    }

    getCursore() {
        return new MouseCursore(this.position);
    }

    private setPositionByEvent(event: MouseEvent) {
        let newPosition = new Point({x:event.offsetX, y:event.offsetY})
        newPosition = this.camera.canvas2xy(newPosition)
        this.position.x = newPosition.x
        this.position.y = newPosition.y
        //console.log(`${event.offsetX}:${event.offsetY}`)
    }

    private setButton(button: number, state: boolean) {
        if (button < this.buttons.length)
            this.buttons[button] = state;
    }

    private addClick(button: number, position: Point) {
        if (button < this.clicks.length)
            this.clicks[button].push(position);
    }
}

class MouseCursore implements Drawable{
    avatar = new BaseAvatar(new FillRectangleTexture(new Color(0, 255, 255, 0.8)));

    constructor(private position: Point) {
        this.draw = this.avatar.bindContext(new Hitbox(this.position, 10, 10));

    }
    draw(camera: Camera): void {
    }
    
    set texture(texture: AnimatedTexture) {
        this.avatar.texture = texture;
    }
}