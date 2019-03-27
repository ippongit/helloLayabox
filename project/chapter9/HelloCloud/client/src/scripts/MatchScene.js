/**MatchScene */
export default class MatchScene extends Laya.Scene{
    constructor() { super(); }
    onEnable(){
        this.btn_cancel.on(Laya.Event.CLICK,this,function(){
            //取消匹配玩家
            Laya.stage.event(Laya.Event.MESSAGE,{type:'cancelMatch'});

        })
    }
}