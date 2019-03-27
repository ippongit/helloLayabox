/** script/About_button.js */
export default class About_button extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.btn_1.on(Laya.Event.CLICK, this, function () {
            console.log("Hi,I'm btn_1!");
        });
    }
}