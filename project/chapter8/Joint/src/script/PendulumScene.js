/**PendulumScene */
export default class PendulumScene extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        var hook = this.getChildByName("hook");
        var ball1 = this.getChildByName("ball1");
        Laya.timer.frameLoop(1, this, function () {
            this.graphics.clear();
            this.graphics.drawLine(hook.x + 15, hook.y + 15, ball1.x + 50, ball1.y + 50, '#0000ff', 10);
        });
    }
}