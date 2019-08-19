interface CollisionBody{

    hitbox: Hitbox;
    velocity: Point;
    movable: boolean;
    mass: number;
    Acceleration(): Point;
    addTime: number;
}

class Collision{
    
    static BodyTime(b1: CollisionBody, b2: CollisionBody, time: number, currentTime: number): {time: number, vector: Point}{
        
        let sq1 = b1.hitbox;
        let sq2 = b2.hitbox;
        /*let dV = b2.velocity.Sum(b1.velocity.Neg());
        let dg = b2.Acceleration().Sum(b1.Acceleration().Neg());
        {
            let xCenter = (sq1.x1 + sq1.x2) / 2;
            let aCenter = (sq2.x1 + sq2.x2) / 2;
            let dx = Math.abs(xCenter - aCenter);
            let maxLen = (sq1.width + sq2.width) / 2 + Math.abs(dV.x * time) + Math.abs(dg.x * time * time);
            if (dx > maxLen)
                return {time: time, vector: new Point({x: 0, y: 0})};

            let yCenter = (sq1.y1 + sq1.y2) / 2;
            let bCenter = (sq2.y1 + sq2.y2) / 2;
            dx = Math.abs(yCenter - bCenter);
            maxLen = (sq1.height + sq2.height) / 2 + Math.abs(dV.y * time) + Math.abs(dg.y * time * time);
            if (dx > maxLen)
            return {time: time, vector: new Point({x: 0, y: 0})};
        }*/        

        let V = new Point(b1.velocity);
        let U = new Point(b2.velocity);
        let g = b1.Acceleration();
        let h = b2.Acceleration();

        //console.log(time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x1, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x1, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.x2, sq1.y1, sq1.y2, sq2.x2, sq2.y1, sq2.y2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        let prTime = time;

        V = V.Revers();
        U = U.Revers();
        g = g.Revers();
        h = h.Revers();
        
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y1, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y1, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);
        time = this.LinesTime(sq1.y2, sq1.x1, sq1.x2, sq2.y2, sq2.x1, sq2.x2, V, U, g, h, time, b1.addTime, b2.addTime, currentTime);
        //console.log(time);

        if(time == prTime)
            return {time: time, vector: new Point({x: 1, y: 0})};
        else
            return {time: time, vector: new Point({x: 0, y: 1})};
    }

    private static LinesTime(x: number, y1: number, y2: number, a: number, b1: number, b2: number,
        V: Point, U: Point, g: Point, h: Point, time: number, addt1: number, addt2: number, currentTime: number): number{

        let A = (h.x - g.x);
        let B = U.x - V.x + g.x * addt1 - h.x * addt2;
        if (A == 0)
        {
            //console.log("x = ", x, a, "v = ", V.x, U.x, "g = ", g.x, h.x, "addt = ", addt1, addt2);
            if (B == 0)
                time;
         
            let C = a - x - (U.x * addt2 - V.x * addt1) + (h.x * addt2 * addt2 - g.x * addt1 * addt1) / 2;
            
            //console.log("A = ", A, "B = ", B, "C = ", C);
            let t = - C / B;
            if(t >= currentTime && t < time)
            {
                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t - addt1);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t - addt2);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t;
            }

        }else
        {
            let C = (a - x - (U.x * addt2 - V.x * addt1)) * 2 + (h.x * addt2 * addt2 - g.x * addt1 * addt1);
            let underSqrt = B * B - A * C;
            if (underSqrt < 0)
                return time;
            let sqt = Math.sqrt(underSqrt);
            let t1 = (-B + sqt) / A;
            let t2 = (-B - sqt) / A;
            
            if (t1 >= currentTime && t1 < time)
            {
                    

                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t1);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t1);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t1;
            }

            if (t2 >= currentTime && t2 < time)
            {
                let b12 = this.Move(b1, U.y - V.y, h.y - g.y, t2);
                let b22 = this.Move(b2, U.y - V.y, h.y - g.y, t2);

                if (this.CheckLines(y1, y2, b12, b22))
                    time = t2;
            }
        }
        return time;
    }

    private static Move(x: number, V: number, g: number,  t: number): number{
        return x + V * t + g * (t * t) / 2;
    }
    
    private static CheckLines(x1: number, x2: number, a1: number, a2: number): boolean{
        return !(x2 < a1 || a2 < x1); 
    }

} 