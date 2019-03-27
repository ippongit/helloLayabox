/**TigerScript */
import UniteScript from "./UniteScript";

export default class TigerScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        var btn_run = this.owner.getChildByName('btn_run');
        var unite1 = this.owner.getChildByName('unite1');
        var unite2 = this.owner.getChildByName('unite2');
        var unite3 = this.owner.getChildByName('unite3');
        var unite4 = this.owner.getChildByName('unite4');
        var unite5 = this.owner.getChildByName('unite5');

        var uniteScript1 = unite1.getComponent(UniteScript);
        var uniteScript2 = unite2.getComponent(UniteScript);
        var uniteScript3 = unite3.getComponent(UniteScript);
        var uniteScript4 = unite4.getComponent(UniteScript);
        var uniteScript5 = unite5.getComponent(UniteScript);

        btn_run.on(Laya.Event.CLICK,this,function(){
            var value1 = Math.floor(Math.random()*10);
            var value2 = Math.floor(Math.random()*10);
            var value3 = Math.floor(Math.random()*10);
            var value4 = Math.floor(Math.random()*10);
            var value5 = Math.floor(Math.random()*10);

            uniteScript1.run(value1);
            Laya.timer.once(200,this,function(){uniteScript2.run(value2);});
            Laya.timer.once(400,this,function(){uniteScript3.run(value3);});
            Laya.timer.once(600,this,function(){uniteScript4.run(value4);});
            Laya.timer.once(800,this,function(){uniteScript5.run(value5);});
        })
    }
}