/**StartScene */
export default class StartScene extends Laya.Scene{
    constructor() { super(); }
    onEnable(){
        this.btn_start.on(Laya.Event.CLICK,this,function(){
            //开始匹配玩家
            Laya.stage.event(Laya.Event.MESSAGE,{type:'match'});
        })
    }
}