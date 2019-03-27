/**PistonScene */
export default class PistonScene extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        var wheel = this.getChildByName("wheel");
        var hook = wheel.getChildByName("hook");
        var piston = this.getChildByName("piston");
        Laya.stage.graphics.drawLine(0, 500, 1300, 500, '#0000ff', 10);

        Laya.timer.frameLoop(1, this, function () {
            var hook_globalPos = wheel.localToGlobal(new laya.maths.Point(hook.x, hook.y));

            this.graphics.clear();
            this.graphics.drawLine(hook_globalPos.x, hook_globalPos.y, piston.x, piston.y, '#0000ff', 10);
        });
    }
}