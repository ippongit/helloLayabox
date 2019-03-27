/** script/About_progressBar.js */
export default class About_progressBar extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        //设置进度条ProgressBar_1的进度为0.75
        this.ProgressBar_1.value = 0.75;
    }
}