/**CallDialogControl */
import FirstDialog from "./FirstDialog";
export default class CallDialogControl extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.btn_dialog.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡            
            var dialog = new FirstDialog();
            dialog.x = 50;
            dialog.y = 150;
            dialog.popup();
            // dialog.show();
        })
    }
}