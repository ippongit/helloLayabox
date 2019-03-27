/**UniteScript */
export default class UniteScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        var sprite = this.owner.getChildByName('sprite');
        //获取clip的映射
        this.clip0 = sprite.getChildByName('clip0');
        this.clip1 = sprite.getChildByName('clip1');
        this.clip2 = sprite.getChildByName('clip2');
        this.clip3 = sprite.getChildByName('clip3');
        this.clip4 = sprite.getChildByName('clip4');
        this.clip5 = sprite.getChildByName('clip5');
        this.clip6 = sprite.getChildByName('clip6');
        this.clip7 = sprite.getChildByName('clip7');
        this.clip8 = sprite.getChildByName('clip8');
        this.clip9 = sprite.getChildByName('clip9');
        //测试飞轮运行代码
        this.owner.on(Laya.Event.CLICK, this, function () {
            this.run(8);
        });
    }
}

/**运行飞轮，并停止在指定位置 */
UniteScript.prototype.run = function (select) {
    this.select = select;
    this.minSpeed = 0.2;
    this.maxSpeed = 0.5;
    this.speed = 0;
    this.acceleration = 0.0002;//每毫秒0.2像素
    this.addSpeed = true;
    this.delay = 2000;
    this.mayStop = false;

    Laya.timer.frameLoop(1, this, this.onFrameLoop)
}

UniteScript.prototype.onFrameLoop = function () {
    if (this.addSpeed == true) {
        if (this.speed <= this.maxSpeed)
            this.speed += Laya.timer.delta * this.acceleration;
        else {
            this.speed = this.maxSpeed;
            this.addSpeed = false;
        }
    }
    else {
        if (this.delay > 0) {
            this.delay -= Laya.timer.delta;
        }
        else {
            if (this.speed > this.minSpeed) {
                this.speed -= Laya.timer.delta * this.acceleration;
            }
            else {
                this.mayStop = true;
            }
        }
    }

    this.clip0.y -= this.speed * Laya.timer.delta;

    if (this.clip0.y < -900) this.clip0.y = 100;

    if (this.clip0.y < -700) {
        this.clip9.y = this.clip0.y + 900;
    }
    else {
        this.clip9.y = this.clip0.y - 100;
    }

    this.clip1.y = this.clip0.y + 100;
    this.clip2.y = this.clip0.y + 200;
    this.clip3.y = this.clip0.y + 300;
    this.clip4.y = this.clip0.y + 400;
    this.clip5.y = this.clip0.y + 500;
    this.clip6.y = this.clip0.y + 600;
    this.clip7.y = this.clip0.y + 700;
    this.clip8.y = this.clip0.y + 800;

    //根据设定判断飞轮停止位置
    if (this.mayStop === true) {
        switch (this.select) {
            case 0: if (Math.abs(this.clip0.y) < 2) {
                this.speed = 0;
            } break;
            case 1: if (Math.abs(this.clip1.y) < 2) {
                this.speed = 0;
            } break;
            case 2: if (Math.abs(this.clip2.y) < 2) {
                this.speed = 0;
            } break;
            case 3: if (Math.abs(this.clip3.y) < 2) {
                this.speed = 0;
            } break;
            case 4: if (Math.abs(this.clip4.y) < 2) {
                this.speed = 0;
            } break;
            case 5: if (Math.abs(this.clip5.y) < 2) {
                this.speed = 0;
            } break;
            case 6: if (Math.abs(this.clip6.y) < 2) {
                this.speed = 0;
            } break;
            case 7: if (Math.abs(this.clip7.y) < 2) {
                this.speed = 0;
            } break;
            case 8: if (Math.abs(this.clip8.y) < 2) {
                this.speed = 0;
            } break;
            case 9: if (Math.abs(this.clip9.y) < 2) {
                this.speed = 0;
            } break;
        }
    }
}

