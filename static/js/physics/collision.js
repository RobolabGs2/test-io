"use strict";
class Collision {
    static BodyTime(b1, b2, time) {
        let sq1 = b1.hitbox;
        let sq2 = b2.hitbox;
        let dV = b2.velocity.Sum(b1.velocity.Neg());
        let dg = b2.Acceleration().Sum(b1.Acceleration().Neg());
        {
            let xCenter = (sq1.x1 + sq1.x2) / 2;
            let aCenter = (sq2.x1 + sq2.x2) / 2;
            let dx = Math.abs(xCenter - aCenter);
            let maxLen = (sq1.width + sq2.width) / 2 + Math.abs(dV.x * time) + Math.abs(dg.x * time * time);
            if (dx > maxLen)
                return { time: time, vector: new Point({ x: 0, y: 0 }) };
            let yCenter = (sq1.y1 + sq1.y2) / 2;
            let bCenter = (sq2.y1 + sq2.y2) / 2;
            dx = Math.abs(yCenter - bCenter);
            maxLen = (sq1.height + sq2.height) / 2 + Math.abs(dV.y * time) + Math.abs(dg.y * time * time);
            if (dx > maxLen)
                return { time: time, vector: new Point({ x: 0, y: 0 }) };
        }
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, dV, dg, time);
        let prTime = time;
        dV = dV.Revers();
        dg = dg.Revers();
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, dV, dg, time);
        if (time == prTime)
            return { time: time, vector: new Point({ x: 1, y: 0 }) };
        else
            return { time: time, vector: new Point({ x: 0, y: 1 }) };
    }
    static LinesTime(x, y1, y2, a, b1, b2, dV, dg, time) {
        let dx = a - x;
        if (dg.x == 0) {
            if (dV.x == 0)
                time;
            let t = -dx / dV.x;
            if (t > 0 && t < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t);
                let b22 = this.Move(b2, dV.y, dg.y, t);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t;
            }
        }
        else {
            let underSqrt = dV.x * dV.x - 2 * dg.x * dx;
            if (underSqrt < 0)
                return time;
            let sqt = Math.sqrt(underSqrt);
            let t1 = (-dV.x + sqt) / dg.x;
            let t2 = (-dV.x - sqt) / dg.x;
            if (t1 > 0 && t1 < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t1);
                let b22 = this.Move(b2, dV.y, dg.y, t1);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t1;
            }
            if (t2 > 0 && t2 < time) {
                let b12 = this.Move(b1, dV.y, dg.y, t2);
                let b22 = this.Move(b2, dV.y, dg.y, t2);
                if (this.CheckLines(y1, y2, b12, b22))
                    time = t2;
            }
        }
        return time;
    }
    static Move(x, V, g, t) {
        return x + V * t + g * (t * t) / 2;
    }
    static CheckLines(x1, x2, a1, a2) {
        return !(x2 < a1 || a2 < x1);
    }
}
