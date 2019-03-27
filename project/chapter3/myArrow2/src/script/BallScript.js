import GameManager from "./GameManager";
export default class BallScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        this.img_ball = this.owner.getChildByName('img_ball');
        //复位图形表现
        if (this.boom === true) {

            this.img_ball.texture = 'img/ball_red.png';
            this.img_ball.alpha = 1;
            this.owner.graphics.clear();
        }

        this.y_speed = 0;
        //每秒加速10像素
        this.Acceleration = 0.001;
        this.boom = false;
        this.radio = 30;
        this.radioRaise = 2;
    }
    onUpdate() {
        if (this.boom === true) {
            Laya.SoundManager.playSound("res/audio/papa.ogg", 1);
            this.owner.graphics.clear();
            this.radioRaise *= 2;
            var radio = this.radio + this.radioRaise;
            this.owner.graphics.drawCircle(0, 0, radio, null, '#9cdb5a', 1);
            if (radio >= 80) this.owner.removeSelf();
        }
        else {
            this.y_speed += this.Acceleration * Laya.timer.delta;
            this.owner.y += this.y_speed;
            if (this.owner.y > 1250) {
                //穿透底线，造成伤害
                GameManager.getInstance().hitpoint--;
                if (GameManager.getInstance().hitpoint < 0)
                    GameManager.getInstance().hitpoint = 0;
                this.boom = true;
                this.img_ball.alpha = 0;
                this.radio = 30;
                this.radioRaise = 2;
            }
        }
    }

    onDisable() {
        Laya.stage.event(Laya.Event.MESSAGE,'ballbreak');
        //球被移除时，回收球到对象池，方便下次复用，减少对象创建开销
        Laya.Pool.recover("ball", this.owner);
    }
}