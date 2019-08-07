"use strict";
class Mouse {
    constructor(element) {
        this._whell = 0;
        element.addEventListener("wheel", (event) => {
            this._whell += event.deltaY;
            event.preventDefault();
        });
    }
    get whell() {
        let c = this._whell;
        this._whell = 0;
        return c;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91c2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5wdXQvbW91c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sS0FBSztJQVFQLFlBQVksT0FBb0I7UUFQeEIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQVFmLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFnQixFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFBO1lBQzNCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFYRCxJQUFJLEtBQUs7UUFDTCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztDQVFKIn0=