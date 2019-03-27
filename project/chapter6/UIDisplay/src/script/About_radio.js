/** script/About_radio.js */
export default class About_radio extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.Radio_1.on(Laya.Event.CHANGE,this,function(){
            console.log("单选按钮选中状态是：", this.Radio_1.selected );
        });

        this.RadioGroup_1.on(Laya.Event.CHANGE,this,function(){
            console.log("单选按钮组选中索引是： ", this.RadioGroup_1.selectedIndex );
        });
    }
}