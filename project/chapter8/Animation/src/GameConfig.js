/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import MainScript from "./script/MainScript"
import ActorScript from "./script/ActorScript"
import BulletScript from "./script/BulletScript"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/MainScript.js",MainScript);
		reg("script/ActorScript.js",ActorScript);
		reg("script/BulletScript.js",BulletScript);
    }
}
GameConfig.width = 1280;
GameConfig.height = 720;
GameConfig.scaleMode ="showall";
GameConfig.screenMode = "horizontal";
GameConfig.alignV = "middle";
GameConfig.alignH = "center";
GameConfig.startScene = "main.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
