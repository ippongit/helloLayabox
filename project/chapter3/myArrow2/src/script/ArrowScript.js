export default class ArrowScript extends Laya.Script {
    constructor() { super(); }

    onEnable() {
        this.speed = 2;//每秒2000像素

        this.startPoint = new laya.maths.Point(this.owner.x, this.owner.y);
        this.x_speed = this.speed * Math.cos(this.owner.rotation * Math.PI / 180);
        this.y_speed = this.speed * Math.sin(this.owner.rotation * Math.PI / 180);

        this.alpha = 0;
    }

    onUpdate() {
        this.owner.x += this.x_speed * Laya.timer.delta;
        this.owner.y += this.y_speed * Laya.timer.delta;
        var distance = this.startPoint.distance(this.owner.x, this.owner.y);
        if (distance > 100) this.alpha = 1;
        if (distance > 2000) {
            this.owner.removeSelf();
        }
    }

    onDisable() {
        //箭被移除时，回收箭到对象池，方便下次复用，减少对象创建开销
        Laya.Pool.recover("arrow", this.owner);
    }
}