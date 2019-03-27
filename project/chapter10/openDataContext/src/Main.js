/**Main.js*/
import GameConfig from "./GameConfig";
import ui from "./ui/layaMaxUI";
import Rank from "./script/Rank";
class Main {
	constructor() {
		Laya.isWXOpenDataContext = true;
		//根据IDE设置初始化引擎	
		Laya.init(GameConfig.width, GameConfig.height);

		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		this.onConfigLoaded();
	}

	onConfigLoaded() {
		wx.onMessage(function (message) {
			switch (message.type) {
				case "show": {
					console.log("显示信息： ", message);
					if (this.rank) return;
					this.rank = new Rank();
					Laya.stage.addChild(this.rank);
					this.rank.submitUserDate(message.bestScore);
				} break;
				case "close": {
					if (this.rank) {
						this.rank.destroy(true);
						this.rank = null;
					}
				} break;
			}
		});
	}
}
//激活启动类
new Main();
