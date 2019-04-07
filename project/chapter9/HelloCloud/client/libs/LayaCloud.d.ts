declare module laya.cloud {
    class CloudSDK {
		/**
		 * 构造LayaCloud实例
		 * @param	appId 应用标识
		 * @param	env 连接的服务器环境, Environment.INTERNET_TEST/Environment.INTRANET_TEST/Environment.LAYACLOUD
		 * @param	caller 初始化完成后的回调对象
		 * @param	callback 初始化完成后的回调函数
		 */
		constructor(appId:string, env:string, caller:any, callback:Function);

		/**
		 * 设置本地调试服务器的局域网IP，适用于局域网内多人协作测试
		 * @param	ip
		 */
		setIntranetServerIP(ip:string):void;

		/**
		 * 发起登录行为, 如果未登录会弹出登录对话框
		 * @param caller 登录完成后的回调对象
		 * @param callback 登录完成后的回调函数
		 */
		login(caller:any, callback:Function):void;
		
		/**
		 * 加入房间, 所需要的参数在匹配(match)接口的回调函数中可以获得		 
		 * @param	serverId 房间所在服务器的标识
		 * @param	roomName 房间标识, 如果需要加入默认房间, 传递默认房间类型名称, 如 single
		 * @param	token 令牌, 用于服务器校验加入房间的用户身份
		 * @param	caller 加入房间后的回调对象
		 * @param	callback 加入房间后的回调函数
		 */
		joinRoom(serverId:string, roomName:string, token:string, caller:any, callback:Function):void;
		
		/**
		 * 离开房间
		 * @param	reason 离开原因, 1=断线, 2=主动离开
		 */
		leaveRoom(reason:number):void;
		
		/**
		 * 开始匹配对手
		 * @param	roomtype 匹配的房间类型, 在 server/config.json 中定义
		 * @param	caller 匹配后的回调对象
		 * @param	callback 匹配后的回调函数
		 */
		match(roomtype:string, caller:any, callback:Function):void;

		/**
		 * 创建房间(通过此接口创建的房间不会参与匹配)
		 * @param	roomtype 房间类型
		 * @param	caller
		 * @param	callback
		 */
		createRoom(roomtype:string, caller:any, callback:Function):void;	

		/**
		 * 根据房间标识加入特定的房间
		 * @param	roomname 房间标识
		 * @param	caller
		 * @param	callback
		 */
		joinSpecialRoom(roomname:string, caller:any, callback:Function):void;
		
		/**
		 * 进入房间后, 房主调用此函数开始游戏, 调用后会开启帧同步, 不使用帧同步不要调用此函数
		 */
		startGame():void;
		
		/**
		 * 房间内广播消息
		 * @param	data 需要广播的数据
		 */
		broadcast(data:string):void;
		
		/**
		 * 发送帧同步指令
		 * @param	item 当前帧需要消耗的物品
		 * @param	data 需要进行帧同步的数据
		 */
		syncopt(item:string, data:string):void;
		
		/**
		 * 发送用户自定义事件
		 * @param	eventName 事件名称
		 * @param	eventValue 事件参数
		 */
		userEvent(eventName:string, eventValue:string):void;
		
		/**
		 * 监听Cloud事件, 事件类型由CloudEvent定义
		 * @param	type 事件类型
		 * @param	caller 回调对象
		 * @param	listener 回调函数
		 */
		on(type:string, caller:any, listener:Function):void;
		
		/**
		 * 监听Cloud事件, 事件类型由CloudEvent定义，触发一次后取消
		 * @param	type 事件类型
		 * @param	caller 回调对象
		 * @param	listener 回调函数
		 */
		once(type:string, caller:any, listener:Function):void;
		
		/**
		 * 取消监听Cloud事件
		 * @param	type 事件类型
		 * @param	caller 回调对象
		 * @param	listener 回调函数
		 * @param	onceOnly 是否只取消一次性事件监听
		 */
		off(type:string, caller:any, listener:Function, onceOnly?:boolean):void;
		
		/**
		 * 取消监听所有Cloud事件
		 * @param	type 指定特定的事件类型, 不传为取消所有类型的事件监听
		 */
        offAll(type?:string):void;
    }

    enum CloudEvent {
        FRAMEUPDATE = 'frameupdate',
				BROADCAST = 'broadcast',
				
				LEAVEROOM = 'leaveroom',
				MESSAGE = 'message',
				GAMESTARTED = "gamestarted",
				
				ERROR = 'error',		
				SOCKETCLOSED = 'socketclosed'
		}
		
		enum Environment {
			/**
			 * 云端测试环境
			 */
			INTERNET_TEST = 'internet_test',
			/**
			 * 本地局域网测试环境
			 */
			INTRANET_TEST = 'intranet_test',
			/**
			 * LayaCloud正式生产环境
			 */
			LAYACLOUD = 'layacloud'
		}
}