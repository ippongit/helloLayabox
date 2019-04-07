/**MainScript */
import ActorScript from "./ActorScript";
export default class MainSceneScript extends Laya.Script {
    constructor() { super(); }
    onEnable() {
        var mainActor = this.owner.getChildByName('mainActor')
        var mainActorScript = mainActor.getComponent(ActorScript);
        
        Laya.stage.on(Laya.Event.KEY_DOWN,this,function(e){
            switch(e.keyCode){
                case laya.events.Keyboard.A:{                    
                    mainActorScript.moveLeft();
                }break;
                case laya.events.Keyboard.D:{
                    mainActorScript.moveRight();
                }break;
                case laya.events.Keyboard.SPACE:{
                    mainActorScript.shot();
                }break;
            }
        });
        Laya.stage.on(Laya.Event.KEY_UP,this,function(e){
            switch(e.keyCode){
                case laya.events.Keyboard.A:{
                    mainActorScript.stand();
                }break;
                case laya.events.Keyboard.D:{
                    mainActorScript.stand();
                }break;
            }
        })
    }
}
