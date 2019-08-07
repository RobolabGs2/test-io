"use strict";
class CollisionPair {
    constructor(b1, b2, time, vector) {
        if (b2 && time && vector) {
            this.b1 = b1;
            this.b2 = b2;
            this.time = time;
            this.vector = vector;
        }
        else {
            this.b1 = b1;
            this.b2 = b1;
            this.time = Infinity;
            this.vector = new Point({});
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uUGFpci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9waHlzaWNzL0NvbGxpc2lvblBhaXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sYUFBYTtJQVFmLFlBQVksRUFBUSxFQUFFLEVBQVMsRUFBRSxJQUFhLEVBQUUsTUFBYztRQUMxRCxJQUFHLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFDO1lBQ3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUN4QjthQUFJO1lBQ0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0I7SUFDTCxDQUFDO0NBQ0oifQ==