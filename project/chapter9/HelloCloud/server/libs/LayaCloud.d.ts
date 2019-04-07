declare module laya.cloud {
    
    interface IServerScript {
        /**
		 * 当房间创建时被调用, this指针为room对象
		 */
		oncreated():void;
		/**
		 * 当房主发送开始指令时被调用，指示房间开始帧同步
		 */
		onstart():void;
		/**
		 * 房间关闭时被调用
		 */
		onclose():void;
		/**
		 * 玩家进入房间时被调用
		 * @param	userid 进入房间的用户ID
		 * @param	data 进入房间的用户数据
		 */
		onuserin(userid:string, data:any):void;
		/**
		 * 玩家离开房间时被调用
		 * @param	userid
		 */
		onuserout(userid:string):void;
		/**
		 * 当玩家发送自定义事件时被调用
		 * @param	userid 发送事件的用户ID
		 * @param	key 事件的key
		 * @param	val 事件的value
		 */
		onuserevent(userid:string, key:string, val:string):void;

		/**
		 * 定时器启动后, 会每隔1秒调用1次onupdate函数 
		 */
		onupdate():void;
    }

    class ServerScriptBase{
        /**
		 * 房间标识, 只读属性
		 */
        readonly name:string;
        /**
		 * 房主的userid, 只读属性
		 */
        readonly master:string;
        /**
		 * 当前房间帧速度, 只读属性
		 */
        readonly fps:number;
        /**
		 * 帧同步持续时间秒, 只读属性
		 */
        readonly duration:number;
        /**
		 * 当前房间内的玩家数量, 只读属性
		 */
        readonly usernum:number;

        /**
		 * 获取房间内所有用户的用户ID
		 * @return 用户ID数组
		 */
		getusersid():Array<string>;
		
		/**
		 * 获取用户数据
		 * @param	userid 用户ID
		 * @return	用户数据
		 */
		getuserdata(userid:string):any;
		
		/**
		 * 保存用户数据
		 * @param	userid 用户ID
		 */
		saveuserdata(userid:string):void;
		/**
		 * 向房间内用户广播一条消息
		 * @param	data 要广播的消息字符串
		 */
		broadcast(data:string):void;
		/**
		 * 向指定用户发送一条事件
		 * @param	userid 接收事件的用户ID
		 * @param	key 事件的key
		 * @param	val 事件的value
		 */
		send(userid:string, key:string, val:string):void;
		/**
		 * 关闭房间
		 */
		close():void;

		/**
		 * 启动定时器, 此函数调用后会每隔1秒调用一次onupdate函数
		 * 如果需要停止定时器, 需要调用stopupdate函数
		 */
		startupdate():void;
		
		/**
		 * 停止定时器
		 */
		stopupdate():void;

		/**
		 * 获取房间内所有用户的用户数据
		 */
		getalluserdata():any;
		
	}		
}