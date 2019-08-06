"use strict";
class impact {
    static hit(body1, body2, vector) {
        let m1 = body1.mass;
        let m2 = body2.mass;
        if (Math.abs(vector.x) >= Math.abs(vector.y)) {
            let vel = this.bounce(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable);
            body1.velocity.x = vel.v;
            body2.velocity.x = vel.u;
            let fric = this.friction(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable);
            body1.velocity.y = fric.v;
            body2.velocity.y = fric.u;
        }
        else {
            let vel = this.bounce(body1.velocity.y, body2.velocity.y, m1, m2, body1.movable, body2.movable);
            body1.velocity.y = vel.v;
            body2.velocity.y = vel.u;
            let fric = this.friction(body1.velocity.x, body2.velocity.x, m1, m2, body1.movable, body2.movable);
            body1.velocity.x = fric.v;
            body2.velocity.x = fric.u;
        }
    }
    static bounce(v, u, m1, m2, mov1, mov2) {
        let k = 0.9;
        let u1 = u - v;
        let p = 20 * Math.min(m1 * m1, m2 * m2);
        let root = 1 - k + p * (m1 + m2) / (m1 * m1 * m2 * u1 * u1);
        let mult = Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }
        else if (mov2) {
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return { v: v, u: u };
    }
    static friction(v, u, m1, m2, mov1, mov2) {
        let k = 0.1;
        let u1 = u - v;
        let root = 1 - k;
        let mult = -Math.sqrt(root);
        if (mov1 && mov2) {
            let u2 = u1 * (m2 - m1 * mult) / (m2 + m1);
            let v2 = u1 * m2 * (1 + mult) / (m2 + m1);
            u = v + u2;
            v = v + v2;
        }
        else if (mov1) {
            let v2 = u1 * (1 + mult);
            v = v + v2;
        }
        else if (mov2) {
            let u2 = -u1 * mult;
            u = v + u2;
        }
        return { v: v, u: u };
    }
}
