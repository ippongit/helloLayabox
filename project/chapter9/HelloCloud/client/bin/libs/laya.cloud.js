
(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
Laya.interface('laya.cloud.union.IUnion');
/**
*...
*@author
*/
//class laya.cloud.CloudEvent
var CloudEvent=(function(){
	function CloudEvent(){}
	__class(CloudEvent,'laya.cloud.CloudEvent');
	CloudEvent.FRAMEUPDATE='frameupdate';
	CloudEvent.BROADCAST='broadcast';
	CloudEvent.LEAVEROOM='leaveroom';
	CloudEvent.MESSAGE='message';
	CloudEvent.GAMESTARTED="gamestarted";
	CloudEvent.ERROR='error';
	CloudEvent.SOCKETCLOSED='socketclosed';
	return CloudEvent;
})()


/**
*...
*@author jiayanzhao
*/
//class laya.cloud.union.Union_LayaMarket
var Union_LayaMarket=(function(){
	function Union_LayaMarket(){
		this.reloadCount=0;
		this.market=null;
		CloudSDK.window.openId=CloudSDK.instance.appId;
		Union_LayaMarket.instance=this;
		this._loadLayaGameMarket();
	}

	__class(Union_LayaMarket,'laya.cloud.union.Union_LayaMarket');
	var __proto=Union_LayaMarket.prototype;
	Laya.imps(__proto,{"laya.cloud.union.IUnion":true})
	/*INTERFACE laya.cloud.union.IUnion */
	__proto.login=function(callback){
		this.market.login("",function(res){
			res=JSON.parse(res);
			callback(res);
		});
	}

	__proto._loadLayaGameMarket=function(){
		if (CloudSDK.window['LayaBoxMarketH5']){
			CloudSDK.window.setTimeout(Union_LayaMarket.instance._onLayaGameMarketLoaded,1);
			}else{
			if (Union_LayaMarket.instance.reloadCount > 3){
				throw new Error('LayaBoxMarket无法正常加载, 请检查是否已经正确引用。');
			}
			Union_LayaMarket.instance.reloadCount++;
			CloudSDK.window.setTimeout(Union_LayaMarket.instance._loadLayaGameMarket,1000);
		}
	}

	__proto._onLayaGameMarketLoaded=function(){
		console.log("_onLayaGameMarketLoaded");
		Union_LayaMarket.instance.market=CloudSDK.window['LayaBoxMarketH5'].getInstance({openId:CloudSDK.instance.appId});
		CloudSDK.instance.market=Union_LayaMarket.instance.market;
		CloudSDK.instance.tiggerListener("cb_inited");
	}

	Union_LayaMarket.instance=null;
	return Union_LayaMarket;
})()


/**
*...
*@author ...
*/
//class laya.cloud.Environment
var Environment=(function(){
	function Environment(){}
	__class(Environment,'laya.cloud.Environment');
	Environment.INTERNET_TEST='internet_test';
	Environment.INTRANET_TEST='intranet_test';
	Environment.LAYACLOUD='layacloud';
	return Environment;
})()


/**
*...
*@author ...
*/
//class laya.cloud.CallbackType
var CallbackType=(function(){
	function CallbackType(){}
	__class(CallbackType,'laya.cloud.CallbackType');
	CallbackType.INITED="cb_inited";
	CallbackType.LOGINED="cb_logined";
	CallbackType.MATCHED="cb_matched";
	CallbackType.JOINEDROOM="cb_joinroom";
	CallbackType.GAMESTARTED="cb_gamestarted";
	CallbackType.SYNCEDOPT="cb_syncedopt";
	CallbackType.BROADCASTED="cb_broadcasted";
	CallbackType.LEAVEROOM="cb_leaveroom";
	CallbackType.MATCHCANCELED="cb_matchcanceled";
	CallbackType.ROOMCREATED="cb_roomcreated";
	CallbackType.ONGOTSPECIALROOM="cb_ongotspecialroom";
	return CallbackType;
})()


/**
*Laya Game Cloud SDK
*@author
*/
//class laya.cloud.CloudSDK
var CloudSDK=(function(){
	function CloudSDK(appId,env,caller,callback){
		//public static var isDebug:Boolean=false;
		this.appId=null;
		this._callbacks=null;
		this.gameSocket=null;
		this.union=null;
		this.userId=null;
		this.token=null;
		this.market=null;
		this.servers={};
		this._intranetServerIP='127.0.0.1';
		CloudSDK.instance=this;
		this.appId=appId;
		CloudSDK.window=window;
		CloudSDK.document=CloudSDK.window.document;
		this._callbacks=new Object();
		laya.cloud.CloudSDK.environment=env;
		this.once("cb_inited",caller,callback);
		this.union=new Union_LayaMarket();
	}

	__class(CloudSDK,'laya.cloud.CloudSDK');
	var __proto=CloudSDK.prototype;
	__proto._addListener=function(key,caller,callback,once){
		(once===void 0)&& (once=false);
		if (callback==null)return;
		if (!this._callbacks[key]){
			this._callbacks[key]=[];
		}
		for (var i=0;i < this._callbacks[key].length;i++){
			if (caller==this._callbacks[key][i]['caller'] && callback==this._callbacks[key][i]['callback'] && this._callbacks[key][i]['once']==once){
				return;
			}
		};
		var handler={caller:caller,callback:callback,once:once};
		this._callbacks[key].push(handler);
	}

	__proto.tiggerListener=function(key,args){
		var listeners=this._callbacks[key];
		if (listeners && listeners.length > 0){
			for (var i=0;i < listeners.length;i++){
				if (listeners[i]){
					listeners[i]['callback'].apply(listeners[i]['caller'],[args]);
					if (listeners[i]['once']){
						listeners[i]=null;
					}
				}
			}
			for (var j=listeners.length-1;j >=0;j--){
				if (!listeners[j]){
					listeners.splice(j,1);
				}
			}
		}
	}

	/**
	*设置本地调试服务器的局域网IP，适用于局域网内多人协作测试
	*@param ip
	*/
	__proto.setIntranetServerIP=function(ip){
		this._intranetServerIP=ip;
	}

	/**
	*发起登录行为,如果未登录会弹出登录对话框
	*@param caller 登录完成后的回调对象
	*@param callback 登录完成后的回调函数
	*/
	__proto.login=function(caller,callback){
		var _$this=this;
		this.once("cb_logined",caller,callback);
		this.union.login(function(res){
			if (res.result==0){
				_$this.userId=res.data.userId;
				if (!res.data.sign || !res.data.time){
					_$this.tiggerListener("cb_logined",{"code":-2});
					return;
				}
				_$this.token=res.data.sign+"."+res.data.time;
				var addr=_$this.getRouterAddr();
				var handler=new GameMessageHandler();
				_$this.gameSocket=new CloudSocket('',addr.ip,addr.port,addr.ssl_port,_$this.isSSL());
				_$this.gameSocket.onOpen=function (e){
					_$this.gameSocket.send('user.login',{"gameid":_$this.appId,"userid":_$this.userId,"token":_$this.token});
				}
				_$this.gameSocket.onMessage=function (e){
					var msg=JSON.parse(e.data);
					if (msg.url){
						var key=msg.url.replace('.','_');
						if (handler[key]){
							handler[key].apply(handler,[msg.params]);
						}
					}
				}
				_$this.gameSocket.onError=function (e){
					_$this.tiggerListener('error',e);
				}
				_$this.gameSocket.onClose=function (e){
					_$this.tiggerListener('socketclosed',e);
				}
				}else{
				_$this.tiggerListener("cb_logined",{"code":res.result});
			}
		});
	}

	__proto.isSSL=function(){
		if ('https:'==CloudSDK.window.location.protocol){
			return true;
			}else{
			if (laya.cloud.CloudSDK.environment !='intranet_test' && laya.cloud.CloudSDK.environment!==true){
				return true;
			}
			return false;
		}
	}

	__proto.getRouterAddr=function(){
		switch (laya.cloud.CloudSDK.environment){
			case 'intranet_test':
			case true:
				return {ip:this._intranetServerIP,port:9000,ssl_port:9001};
			case 'internet_test':
			case false:
				return {ip:'proxy.cloud.layabox.com',port:29000,ssl_port:29001};
			case 'layacloud':
				return {ip:'proxy.cloud.layabox.com',port:31000,ssl_port:31001};
			default :
				return {ip:this._intranetServerIP,port:9000,ssl_port:9001};
			}
	}

	/**
	*加入房间,所需要的参数在匹配(match)接口的回调函数中可以获得
	*@param serverId 房间所在服务器的标识
	*@param roomName 房间标识,如果需要加入默认房间,传递默认房间类型名称,如 single
	*@param token 令牌,用于服务器校验加入房间的用户身份
	*@param caller 加入房间后的回调对象
	*@param callback 加入房间后的回调函数
	*/
	__proto.joinRoom=function(serverId,roomName,token,caller,callback){
		var _$this=this;
		var linkData=this.servers[serverId];
		if (null==linkData){
			console.log('指定的服务器信息不存在:'+serverId);
			return;
		}
		this.offAll("cb_joinroom");
		this.on("cb_joinroom",caller,callback);
		if (this.gameSocket.serverId==serverId){
			this.gameSocket.send('room.join',{
				'gameid':this.appId,
				'roomname':roomName,
				'userid':laya.cloud.CloudSDK.instance.userId,
				'token':token
			});
			}else{
			this.gameSocket.close();
			this.gameSocket=new CloudSocket(serverId,linkData.ip,linkData.port,linkData.ssl_port,this.isSSL());
			var handler=GameMessageHandler.getInstance();
			this.once("cb_logined",this,function(e){
				if (e.code==0){
					_$this.gameSocket.send('room.join',{
						'gameid':_$this.appId,
						'roomname':roomName,
						'userid':laya.cloud.CloudSDK.instance.userId,
						'token':token
					});
					}else{
					_$this.tiggerListener("cb_joinroom",{message:'login error',code:-1});
				}
			});
			this.gameSocket.onOpen=function (){
				_$this.gameSocket.send('user.login',{"gameid":_$this.appId,"userid":laya.cloud.CloudSDK.instance.userId,"token":laya.cloud.CloudSDK.instance.token});
			};
			this.gameSocket.onMessage=function (e){
				var msg=JSON.parse(e.data);
				if (msg.url){
					var key=msg.url.replace('.','_');
					if (handler[key]){
						handler[key].apply(handler,[msg.params]);
					}
				}
			};
			this.gameSocket.onClose=function (e){
				_$this.tiggerListener('socketclosed',e);
			};
			this.gameSocket.onError=function (e){
				_$this.tiggerListener('error',e);
			};
		}
	}

	/**
	*离开房间
	*@param reason 离开原因,1=断线,2=主动离开
	*@param caller 离开房间后的回调对象
	*@param callback 离开房间后的回调函数
	*/
	__proto.leaveRoom=function(reason){
		this.gameSocket && this.gameSocket.send('room.leave',{
			reason:reason
		});
		this.tiggerListener('leaveroom',{"reason":2,"userid":this.userId});
	}

	/**
	*开始匹配对手
	*@param roomtype 匹配的房间类型,在 server/config.json 中定义
	*@param caller 匹配后的回调对象
	*@param callback 匹配后的回调函数
	*/
	__proto.match=function(roomtype,caller,callback){
		this.once("cb_matched",caller,callback);
		this.gameSocket && this.gameSocket.send('user.match',{roomtype:roomtype});
	}

	/**
	*取消匹配
	*@param caller 取消匹配后的回调对象
	*@param callback 取消匹配后的回调函数
	*/
	__proto.cancelMatch=function(caller,callback){
		this.once("cb_matchcanceled",caller,callback);
		this.gameSocket && this.gameSocket.send('user.cancelmatch',{});
	}

	/**
	*创建房间(通过此接口创建的房间不会参与匹配)
	*@param roomtype 房间类型
	*@param caller
	*@param callback
	*/
	__proto.createRoom=function(roomtype,caller,callback){
		this.once("cb_roomcreated",caller,callback);
		this.gameSocket && this.gameSocket.send('room.create',{roomtype:roomtype});
	}

	/**
	*根据房间标识加入特定的房间
	*@param roomname 房间标识
	*@param caller
	*@param callback
	*/
	__proto.joinSpecialRoom=function(roomname,caller,callback){
		this.once("cb_ongotspecialroom",caller,callback);
		this.gameSocket && this.gameSocket.send('room.joinspecial',{roomname:roomname});
	}

	/**
	*进入房间后,房主调用此函数开始游戏,调用后会开启帧同步,不使用帧同步不要调用此函数
	*游戏开始后会触发 CloudEvent.GAMESTARTED 事件
	*/
	__proto.startGame=function(){
		this.gameSocket && this.gameSocket.send('room.startgame',{});
	}

	/**
	*房间内广播消息
	*通过监听 CloudEvent.BROADCAST 事件来获得广播数据
	*@param data 需要广播的数据
	*/
	__proto.broadcast=function(data){
		this.gameSocket && this.gameSocket.send('room.broadcast',{
			data:data
		});
	}

	/**
	*发送帧同步指令
	*通过监听 CloudEvent.FRAMEUPDATE 事件来获得帧同步数据
	*@param item 当前帧需要消耗的物品
	*@param data 需要进行帧同步的数据
	*/
	__proto.syncopt=function(item,data){
		this.gameSocket && this.gameSocket.send('room.syncopt',{
			i:item,
			o:data
		});
	}

	/**
	*发送用户自定义事件
	*@param eventName 事件名称
	*@param eventValue 事件参数
	*/
	__proto.userEvent=function(eventName,eventValue){
		var data={};
		data[eventName]=eventValue;
		this.gameSocket && this.gameSocket.send('room.evt',data);
	}

	/**
	*监听Cloud事件,事件类型由CloudEvent定义
	*@param type 事件类型
	*@param caller 回调对象
	*@param listener 回调函数
	*/
	__proto.on=function(type,caller,listener){
		this._addListener(type,caller,listener);
	}

	/**
	*监听Cloud事件,事件类型由CloudEvent定义，触发一次后取消
	*@param type 事件类型
	*@param caller 回调对象
	*@param listener 回调函数
	*/
	__proto.once=function(type,caller,listener){
		this._addListener(type,caller,listener,true);
	}

	/**
	*取消监听Cloud事件
	*@param type 事件类型
	*@param caller 回调对象
	*@param listener 回调函数
	*@param onceOnly 是否只取消一次性事件监听
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (this._callbacks[type] && this._callbacks[type].length > 0){
			for (var i=this._callbacks[type].length-1;i >=0;i--){
				if (this._callbacks[type][i]['caller']==caller && this._callbacks[type][i]['callback']==listener){
					if (!onceOnly || (onceOnly && this._callbacks[type][i]['once'])){
						this._callbacks[type].splice(i,1);
					}
				}
			}
		}
	}

	/**
	*取消监听所有Cloud事件
	*@param type 指定特定的事件类型,不传为取消所有类型的事件监听
	*/
	__proto.offAll=function(type){
		if (null==type){
			this._callbacks={};
			}else{
			this._callbacks[type]=[];
		}
	}

	__proto.putServer=function(serverId,linkData){
		this.servers[serverId]=linkData;
	}

	CloudSDK.version='1.0.0';
	CloudSDK.window=null;
	CloudSDK.document=null;
	CloudSDK.instance=null;
	CloudSDK.environment=null;
	return CloudSDK;
})()


/**
*...
*@author ...
*/
//class laya.cloud.GameMessageHandler
var GameMessageHandler=(function(){
	function GameMessageHandler(){}
	__class(GameMessageHandler,'laya.cloud.GameMessageHandler');
	var __proto=GameMessageHandler.prototype;
	__proto.room_joined=function(data){
		CloudSDK.instance.tiggerListener("cb_joinroom",data);
	}

	__proto.room_left=function(data){
		CloudSDK.instance.tiggerListener('leaveroom',data);
	}

	__proto.room_gamestarted=function(data){
		CloudSDK.instance.tiggerListener("gamestarted",data);
	}

	__proto.room_syncopt=function(data){
		CloudSDK.instance.tiggerListener("cb_syncedopt",data);
	}

	__proto.room_push=function(data){
		CloudSDK.instance.tiggerListener('frameupdate',data);
	}

	__proto.room_broadcast=function(data){
		CloudSDK.instance.tiggerListener('broadcast',data.data);
	}

	__proto.room_msg=function(data){
		CloudSDK.instance.tiggerListener('message',data);
	}

	__proto.user_logined=function(data){
		if (data.code==0){
			CloudSDK.instance.gameSocket.serverId=data.serverid;
			CloudSDK.instance.putServer(data.serverid,{ip:CloudSDK.instance.gameSocket.ip,port:CloudSDK.instance.gameSocket.port,ssl_port:CloudSDK.instance.gameSocket.ssl_port});
			CloudSDK.instance.tiggerListener("cb_logined",{
				'code':0,
				'userid':CloudSDK.instance.userId,
				'token':CloudSDK.instance.token,
				'serverid':data.serverid
			});
			}else{
			CloudSDK.instance.tiggerListener("cb_logined",{
				'code':data.code
			});
		}
	}

	__proto.user_togame=function(data){
		var addr=data.ip.split(':');
		var sslAddr=data.sslip.split(':');
		CloudSDK.instance.putServer(data.serverid,{ip:addr[0],port:addr[1],ssl_port:sslAddr[1]});
		if (data.cbu==1){
			if (data.master==CloudSDK.instance.userId){
				CloudSDK.instance.tiggerListener("cb_roomcreated",data);
				}else{
				CloudSDK.instance.tiggerListener("cb_ongotspecialroom",data);
			}
			}else{
			CloudSDK.instance.tiggerListener("cb_matched",data);
		}
	}

	__proto.user_matchcanceled=function(data){
		CloudSDK.instance.tiggerListener("cb_matchcanceled",data);
	}

	GameMessageHandler.getInstance=function(){
		if (GameMessageHandler._instance==null){
			GameMessageHandler._instance=new GameMessageHandler();
		}
		return GameMessageHandler._instance;
	}

	GameMessageHandler._instance=null;
	return GameMessageHandler;
})()


/**
*...
*@author
*/
//class laya.cloud.socket.CloudSocket
var CloudSocket=(function(){
	function CloudSocket(serverId,ip,port,ssl_port,ssl){
		this.socket=null;
		this.heartBeatHandler=0;
		this.checkHeartBeatTimeSpan=10000;
		this.lastSendMessageTime=0;
		this.lastReceiveMessageTime=0;
		this.serverId='';
		this.ip=null;
		this.port=0;
		this.ssl_port=0;
		this.ssl=false;
		this.onOpen=null;
		this.onClose=null;
		this.onError=null;
		this.onMessage=null;
		this.serverId=serverId;
		this.ip=ip;
		this.port=port;
		this.ssl_port=ssl_port;
		this.ssl=ssl;
		var url=ssl ? ('wss://'+ip+':'+ssl_port+'/wss'):('ws://'+ip+':'+port+'/ws');
		var that=this;
		this.socket=new CloudSDK.window['WebSocket'](url);
		this.socket.url=url;
		this.socket.onopen=function (e){
			that.onOpen(e);
			that.startHeartBeat();
		};
		this.socket.onclose=function (e){
			that.stopHeartBeat();
			that.onClose(e);
		};
		this.socket.onerror=function (e){
			that.stopHeartBeat();
			that.onError(e);
		};
		this.socket.onmessage=function (e){
			that.lastReceiveMessageTime=new Date().valueOf();
			that.onMessage(e);
		};
	}

	__class(CloudSocket,'laya.cloud.socket.CloudSocket');
	var __proto=CloudSocket.prototype;
	__proto.startHeartBeat=function(){
		var that=this;
		this.heartBeatHandler=CloudSDK.window.setInterval(function(){
			that.checkHeartBeat();
		},this.checkHeartBeatTimeSpan);
	}

	__proto.checkHeartBeat=function(){
		var now=new Date().valueOf();
		if (now-this.lastSendMessageTime > 10000){
			this.lastSendMessageTime=now;
			this.socket.send('{}');
		}
		if (now-this.lastReceiveMessageTime > 30000){
			this.socket.close();
		}
	}

	__proto.stopHeartBeat=function(){
		CloudSDK.window.clearInterval(this.heartBeatHandler);
		this.heartBeatHandler=0;
	}

	__proto.send=function(url,params){
		this.lastSendMessageTime=new Date().valueOf();
		var msg={
			url:url,
			params:params
		};
		this.socket.send(JSON.stringify(msg));
	}

	__proto.close=function(){
		this.socket.close();
	}

	return CloudSocket;
})()



})(window,document,Laya);
