/**MainScript */
import ActorScript from "./ActorScript";
export default class MainSceneScript extends Laya.Script {
    /** @prop {name:actor,tips:"actor预制体对象",type:Prefab}*/
    constructor() { super(); }
    onEnable() {
        var ground = this.owner.getChildByName('ground');
        var mainActor = ground.getChildByName('mainActor');
        var mainActorScript = mainActor.getComponent(ActorScript);

        Laya.stage.on(Laya.Event.KEY_DOWN, this, function (e) {
            switch (e.keyCode) {
                case laya.events.Keyboard.A: {
                    mainActorScript.moveLeft();
                } break;
                case laya.events.Keyboard.S: {
                    mainActorScript.down();
                } break;
                case laya.events.Keyboard.D: {
                    mainActorScript.moveRight();
                } break;
                case laya.events.Keyboard.W: {
                    mainActorScript.up();
                } break;

                case laya.events.Keyboard.SPACE: {
                    mainActorScript.shot();
                } break;
            }
        });
        Laya.stage.on(Laya.Event.KEY_UP, this, function (e) {
            switch (e.keyCode) {
                case laya.events.Keyboard.A: {
                    mainActorScript.stand();
                } break;
                case laya.events.Keyboard.D: {
                    mainActorScript.stand();
                } break;
            }
        })

        for (var i = 0; i < 10; i++) {
            var actor = Laya.Pool.getItemByCreateFun("actor",
                this.actor.create, this.actor);
            actor.x = 400 + i * 100;
            actor.y = 200;
            ground.addChild(actor);
        }
    }
}
