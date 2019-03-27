/**FirstDialog */
export default class FirstDialog extends Laya.Dialog {
    constructor() {
        super();
        //对话框的尺寸
        this.width = 320;
        this.height = 240;
        // //不在屏幕中央显示对话框
        this.isPopupCenter = false;
        // 拖动区域
        this.dragArea = "0,0," + this.width + "," + this.height;
        //加载场景
        this.loadScene("as_dialog");
    }
    onEnable() {
        this.btn_close.on(Laya.Event.CLICK, this, function () {
            this.close();
        });
    }
}