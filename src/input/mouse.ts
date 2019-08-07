class Mouse {
    private _whell = 0;
    get whell() {
        let c = this._whell;
        this._whell = 0;
        return c;
    }

    constructor(element: HTMLElement) {
        element.addEventListener("wheel", (event:WheelEvent) => {
            this._whell += event.deltaY
            event.preventDefault();
        });
    }
}