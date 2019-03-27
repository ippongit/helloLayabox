/** script/ About_slider.js */
export default class About_slider extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.HSlider_1.value = 50;//设置水平进度条的初始值
        this.VSlider_1.value = 75;//设置垂直进度条的初始值
        //监听水平进度条的数值改变
        this.HSlider_1.on(Laya.Event.CHANGE, this, function () {
            console.log('HSlider_1的值是：', this.HSlider_1.value);
        });
        //监听垂直进度条的数值改变
        this.VSlider_1.on(Laya.Event.CHANGE, this, function () {
            console.log('VSlider_1的值是：', this.VSlider_1.value);
        });
    }
}