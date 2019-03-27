/**ActorScript */
export default class ActorScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this.animation = this.owner.getChildByName("animation");

        //创建动画模板
        Laya.Animation.createFrames(this.aniUrls("walk", 4), "walk");
        Laya.Animation.createFrames(this.aniUrls("die", 6), "die");
        Laya.Animation.createFrames(this.aniUrls("stand", 4), "stand");
        Laya.Animation.createFrames(this.aniUrls("shot", 2), "shot");

        this.shotOver = true;
        this.isMoving = false;
        this.faceLeft = true;//默认面向右
        this.speed = 0.08;//每秒80像素
        this.stand();

        Laya.timer.frameLoop(1, this, function () {
            if (this.isMoving === true && this.shotOver === true) {
                var one = 1;
                //向左移动，减少x坐标值
                if (this.faceLeft === true) one = -1;
                this.owner.x += one * this.speed * Laya.timer.delta;
            }
        })
    }

    moveLeft() {
        if (this.isMoving === true) return;
        this.faceLeft = true;
        this.isMoving = true;
        this.animation.scaleX = 1;
        this.animation.play(0, true, "walk");
    }

    moveRight() {
        if (this.isMoving === true) return;
        this.faceLeft = false;
        this.isMoving = true;
        this.animation.scaleX = -1;
        this.animation.play(0, true, "walk");
    }

    walk() {
        this.animation.play(0, true, "walk");
    }

    stand() {
        this.animation.play(0, true, "stand");
        this.isMoving = false;
    }

    shot() {
        if (this.shotOver === false) return;
        this.shotOver = false;
        this.animation.play(0, false, "shot");
        Laya.timer.once(500, this, function () { this.shotOver = true; });

        // addLabel(label: String, index: int): void
        // 增加一个帧标签到指定索引的帧上。
        // 当动画播放到此索引的帧时会派发Event.LABEL事件，
        // 派发事件是在完成当前帧画面更新之后。
        this.animation.addLabel("SHOTOVER", 1);
        this.animation.once(Laya.Event.LABEL, this, function (e) {
            console.log('Label ', e);
            console.log('this.animation.index ', this.animation.index);
            console.log('子弹已经发射');
        });
        //once增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。
        this.animation.once(Laya.Event.COMPLETE, this, function () {
            console.log('this.animation.index ', this.animation.index);
            if (this.isMoving === true) this.animation.play(0, true, "walk");
            else this.animation.play(0, true, "stand");
        });
    }

    die() {
        this.animation.play(0, false, "die");
        this.animation.once(Laya.Event.COMPLETE, this, function () {
            console.log('ok, good bye!');
        });
    }

    /**
     * 创建一组动画的url数组（美术资源地址数组）
     * aniName  动作的名称，用于生成url
     * length   动画最后一帧的索引值，
     */
    aniUrls(aniName, length) {
        var urls = [];
        for (var i = 0; i < length; i++) {
            //动画资源路径要和动画图集打包前的资源命名对应起来
            urls.push("x13/" + aniName + i + ".png");
        }
        return urls;
    }
}