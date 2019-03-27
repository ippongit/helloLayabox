/** script/About_checkBox.js */
export default class About_checkBox extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        this.CheckBox_1.on(Laya.Event.CHANGE,this,function(){
            console.log("CheckBox_1选中状态是：", this.CheckBox_1.selected );
        });
        this.CheckBox_2.on(Laya.Event.CHANGE,this,function(){
            console.log("CheckBox_2选中状态是：", this.CheckBox_2.selected );
        });
        this.CheckBox_3.on(Laya.Event.CHANGE,this,function(){
            console.log("CheckBox_3选中状态是：", this.CheckBox_3.selected );
        });
        this.CheckBox_4.on(Laya.Event.CHANGE,this,function(){
            console.log("CheckBox_4选中状态是：", this.CheckBox_4.selected );
        });
    }
}