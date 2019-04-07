import GameConfig from "./GameConfig";
import GameManager from "./scripts/GameManager";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		this.sdk = new laya.cloud.CloudSDK("cloud_8696", laya.cloud.Environment.INTERNET_TEST, this, this.onSDKInited);
		// this.sdk.setIntranetServerIP('192.168.5.6');
	}

	onSDKInited() {
		console.log('LayaCloud初始化完成');
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded() {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded() {
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);

		//使用账号登录游戏 Laya账号、浏览器中可以登录QQ、微信
		this.sdk.login(this, this.onLogin);

		Laya.stage.on(Laya.Event.MESSAGE, this, function (data) {
			switch (data.type) {
				case 'match': {//匹配对手
					//切换到匹配场景
					Laya.Scene.open("Match.scene");
					//发送匹配请求
					this.sdk.match("common", this, this.onGameMatch);
				} break;
				case 'cancelMatch': {//取消匹配对手
					//发送取消匹配请求
					this.sdk.cancelMatch();
					//返回开始场景
					Laya.Scene.open("Start.scene");
				} break;
				case 'getSceneScript': {//获取主场景脚本
					this.mainScenceScript = data.target;
					// this.mainScenceScript.onFrameUpdate();
				} break;
				case 'syncopt': {//发送帧同步数据
					// data.info
					var item = "actor1";
					if (GameManager.getInstance().isMaster === false) item = "actor2";
					this.sdk.syncopt(item, data.info);
				} break;
				default: break;
			}
		});

		// 绑定接受广播监听回调
		this.sdk.on(laya.cloud.CloudEvent.BROADCAST, this, this.onBroadcast);

		// 绑定接受帧同步监听回调
		this.sdk.on(laya.cloud.CloudEvent.FRAMEUPDATE, this, this.onFrameUpdate);

		// 绑定帧同步开始事件的监听回调
		this.sdk.on(laya.cloud.CloudEvent.GAMESTARTED, this, function (data) {
			console.log('帧同步开始事件 ', data);
			//正常开始时获取的结果: Object {code: 0}
		});
	}

	/**接受帧同步事件 */
	onFrameUpdate(data) {
		// console.log('帧同步事件 ', data);
		if (data.f.length > 0) {//丢弃空包
			for (var i = 0; i < data.f.length; i++) {
				// console.log("-------", data.f[index].ds);
				var info = data.f[i].ds;//data.f[index].ds是一个数组
				// console.log(info);
				for (var index = 0; index < info.length; index++) {
					// console.log(info[index].o);
					// console.log('typeof(info[index].o) ===> ',typeof(info[index].o));

					//屏蔽自己发出的操作
					if (info[index].id === GameManager.getInstance().userInfo.userid) continue;
					var info_o = JSON.parse(info[index].o);
					// console.log('info_o.option ===> ',info_o.option);
					this.mainScenceScript.onFrameUpdate(info_o);
				}
			}
		}
	}

	/** 接受到服务端发送过来的广播*/
	onBroadcast(data) {
		console.log('接受到广播----> ', data);
		var dataInfo = JSON.parse(data);
		console.log('dataInfo ', dataInfo);
		switch (dataInfo.cmd) {
			case "start": {
				GameManager.getInstance().randomSeed = parseInt(dataInfo.randomSeed);
				//如果是房主，发送帧同步请求
				if (GameManager.getInstance().matchData.master === GameManager.getInstance().userInfo.userid)
					this.sdk.startGame();
			} break;
			default: break;
		}
	}

	/**登录服务器 */
	onLogin(userInfo) {
		console.log("客户端--->登录成功！");
		GameManager.getInstance().userInfo = userInfo;
		console.log("GameManager.userInfo ---> ", GameManager.getInstance().userInfo);
		// 用户必须在某一个房间里,登录后进入大厅即 single
		// joinRoom的房间标识, 如果需要加入默认房间, 传递默认房间类型名称, 如 single
		this.sdk.joinRoom(GameManager.getInstance().userInfo.serverid, 'single',
			GameManager.getInstance().userInfo.token, this, this.onJoinHall);
	}

	/**进入大厅 */
	onJoinHall(data) {
		console.log("客户端--->进入大厅成功", data);
		var hall = data.room;
		console.log("hall--->", hall, hall.status);//status:房间状态，0为正常		
	}

	/** 收到匹配成功消息*/
	onGameMatch(data) {
		console.log("收到匹配成功消息------------------------>>", data);
		GameManager.getInstance().matchData = data;//存储匹配数据

		//确定身份是否是房主
		if (GameManager.getInstance().matchData.master === GameManager.getInstance().userInfo.userid)
			GameManager.getInstance().isMaster = true;
		else GameManager.getInstance().isMaster = false;

		//打开主场景
		Laya.Scene.open('main.scene');

		//进入匹配好的房间
		this.sdk.joinRoom(GameManager.getInstance().matchData.serverid,
			GameManager.getInstance().matchData.roomname,
			GameManager.getInstance().matchData.token, this, this.onJoinMatchRoom);
	}

	/**进入匹配的房间 */
	onJoinMatchRoom(data) {
		console.log("客户端--->进入房间成功", data);
		var room = data.room;
		console.log("room--->", room, room.status);//status:房间状态，0为正常		
	}
}
//激活启动类
new Main();
