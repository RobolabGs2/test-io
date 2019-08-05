"use strict";
class PriorityQueue {
    constructor() {
        this.list = new Array();
    }
    Add(entity) {
        entity.tag = this.list.length;
        this.list.push(entity);
        this.Up(entity.tag);
    }
    Up(i) {
        let prev = this.Prev(i);
        while (i > 0 && this.list[i].collision.time < this.list[prev].collision.time) {
            this.Swap(i, prev);
            i = prev;
            prev = this.Prev(i);
        }
    }
    Left(i) {
        return 2 * i + 1;
    }
    Right(i) {
        return 2 * i + 2;
    }
    Prev(i) {
        return Math.floor((i - 1) / 2);
    }
    Valid(i) {
        return i < this.list.length;
    }
    Swap(i, j) {
        let buf = this.list[i];
        this.list[i] = this.list[j];
        this.list[j] = buf;
        this.list[i].tag = i;
        this.list[j].tag = j;
    }
    Heapify(i) {
        if (!this.Valid(i))
            return;
        let min = i;
        let left = this.Left(i);
        let right = this.Right(i);
        if (this.Valid(left) && this.list[left].collision.time < this.list[min].collision.time)
            min = left;
        if (this.Valid(right) && this.list[right].collision.time < this.list[min].collision.time)
            min = right;
        if (min == i)
            return;
        this.Swap(i, min);
        this.Heapify(min);
    }
    Better() {
        return this.list[0];
    }
    Relocate(i) {
        this.Up(i);
        this.Heapify(i);
    }
}
