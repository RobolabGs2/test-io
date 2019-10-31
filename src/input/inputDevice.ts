enum Actions {
    wtf, jump, up, down, clone, left, right, zoom, unzoom, COUNT  
}

enum MouseButtons {
    left = 0, center, right, COUNT
}

type PressingAction = (dt: number) => boolean;
type PressAction = (pressed: boolean) => void;
type ClickAction = (position: Point) => void;

interface InputDevice {
    addPressingAction(action: Actions, consumer: PressingAction): this;
    addPressAction(action: Actions, consumer: PressAction): this;
    addClickAction(button: MouseButtons, consumer: ClickAction): this;
}