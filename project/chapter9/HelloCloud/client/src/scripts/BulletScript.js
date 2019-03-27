/**BulletScript */
export default class BulletScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this.photo = this.owner.getChildByName('photo');
        this.RigidBody = this.owner.getComponent(Laya.RigidBody);
    }

    onUpdate() {
        // 如果子弹超出屏幕，则移除子弹
        if (this.owner.x < -100 || this.owner.x >1400) {
            this.owner.removeSelf();
        }
    }

    onDisable() {
        //子弹被移除时，回收子弹到对象池，方便下次复用，减少对象创建开销
        Laya.Pool.recover("bullet", this.owner);
    }

    onTriggerEnter(other, self, contact) {
        //如果被碰到，则移除子弹
        this.owner.removeSelf();
    }

    /**发射方向 */
    onFire(faceLeft) {
        this.faceLeft = faceLeft;
        if (this.faceLeft === true) {
            this.photo.scaleX = 1;
            this.RigidBody.setVelocity({ x: -20, y: 0 });
        }
        else {
            this.photo.scaleX = -1;
            this.RigidBody.setVelocity({ x: 20, y: 0 });
        }
    }
}