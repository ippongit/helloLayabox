// CDScript
export default class CDScript extends Laya.Script {
    /** @prop {name:CDprop,tips:"冷却时间",type:number,default:1000}*/
    constructor() { super(); }
    onEnable() {
        /**定时器更新的时间间隔(毫秒) */
        this.cdUpdateTime = 100;
        this.endRotation = -90;//结束角度
        this.coolDowning = false;

        this.owner.width = 100;
        this.owner.height = 100;

        if (!this.CDprop) this.CDprop = 1000;
        var CDprop = this.CDprop;//1000;
        this.setCD(CDprop);

        var cdSprite = this.owner.getChildByName("cdSprite");
        //创建遮罩对象
        this.cMask = new Laya.Sprite();
        //画一个圆形的遮罩区域
        this.cMask.graphics.drawPie(0, 0, 70, -90, 270, "#ff0000");
        //圆形所在的位置坐标
        this.cMask.pos(50, 50);
        //实现img显示对象的遮罩效果
        cdSprite.mask = this.cMask;

        //添加鼠标响应
        this.owner.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            e.stopPropagation();//阻止冒泡
            if (this.coolDowning == false) {
                this.coolDowning = true;
                this.coolDown();
            }
        });
    }
}

/**设置CD时间 */
CDScript.prototype.setCD = function (fireCD) {
    this.CDTime = fireCD;//1000;
    /**每次定时器更新的角度增量 */
    this.cdOffset = 360 * this.cdUpdateTime / this.CDTime;
}

/**冷却 */
CDScript.prototype.coolDown = function () {
    Laya.timer.loop(this.cdUpdateTime, this, this.update);
}

CDScript.prototype.update = function () {
    this.endRotation += this.cdOffset;
    this.cMask.graphics.clear(true);
    this.cMask.graphics.drawPie(0, 0, 70, -90, this.endRotation, "#ff0000");
    if (this.endRotation >= 270) {
        this.endRotation = -90;
        this.coolDowning = false;
        Laya.timer.clear(this, this.update);
    }
}
