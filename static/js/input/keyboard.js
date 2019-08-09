"use strict";
class Keyboard {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.clone = false;
        window.addEventListener("keydown", (ev) => {
            keys.set(ev.code, true);
        });
        window.addEventListener("keyup", (ev) => {
            keys.set(ev.code, false);
        });
    }
    set(code, state) {
        switch (code) {
            case 'KeyW':
                keys.up = state;
                break;
            case 'KeyS':
                keys.down = state;
                break;
            case 'KeyA':
                keys.left = state;
                break;
            case 'KeyD':
                keys.right = state;
                break;
            case 'Space':
                keys.clone = state;
                break;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5wdXQva2V5Ym9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sUUFBUTtJQTJCVjtRQTFCQSxPQUFFLEdBQVksS0FBSyxDQUFDO1FBQ3BCLFNBQUksR0FBWSxLQUFLLENBQUM7UUFDdEIsU0FBSSxHQUFZLEtBQUssQ0FBQztRQUN0QixVQUFLLEdBQVksS0FBSyxDQUFDO1FBQ3ZCLFVBQUssR0FBWSxLQUFLLENBQUM7UUF1Qm5CLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFnQixFQUFDLEVBQUU7WUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQWdCLEVBQUMsRUFBRTtZQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBM0JELEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBYztRQUM1QixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssTUFBTTtnQkFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztnQkFDaEIsTUFBTTtZQUNULEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDbkIsTUFBTTtZQUNWLEtBQUssT0FBTztnQkFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDbkIsTUFBTTtTQUNiO0lBQ0wsQ0FBQztDQVVKIn0=