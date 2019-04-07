(function(_g, factory){
    
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(_g) : 
    typeof define === 'function' && define.amd ? define(factory) : (_g.LayaBoxMarketH5 = factory(_g));
})(this, function(_g){
    _g = _g || window;
    
    var LayaCommon = _g.LayaCommon = (function(){

        var navigator = _g.navigator;
        var location = _g.location;
        var LayaCommon = function(){}
    
        /**
         * 判断是否是微信浏览器环境
         */
        LayaCommon.isWx = (function () {
            var ua = navigator && navigator.userAgent.toLowerCase();
            return Boolean(ua && ua.match && (ua.match(/MicroMessenger/i) === "micromessenger"));
        })()
    
        /**
         * 判断是否是PC浏览器
         */
        LayaCommon.isPC = (function() {
            
            if (navigator && navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                return false;
            } else {
                return true;
            }
        })()
    
        /**
         * 判断是否是iOS环境
         */
        LayaCommon.isIOS = (function() {
            if ((navigator && navigator.userAgent.match && navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)) || (_g.GameStatusInfo && GameStatusInfo.platform === "ios")) {
                return true;
            } else {
                return false;
            }
        })();
    
        /**
         * 判断是否是微信小游戏环境
         */
        LayaCommon.isWxGame = (function (){
            if (navigator && navigator.userAgent && navigator.userAgent.indexOf('MiniGame') > -1) {
                return true;
            } else {
                return false;
            }
        })()

        LayaCommon.isLimixiu = (function(){
            if ((_g.GameStatusInfo && GameStatusInfo.QQVer) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('limixiu') > -1)) {
                return true;
            } else {
                return false;
            }
        })()
    
        LayaCommon.init = function() {
            this.protocol = location &&location.protocol;
    
            if(this.protocol === "file:") {
                this.protocol = "http:";
            }
    
            if(this.isWxGame) {
                this.protocol = "https:";
            }
            
            if(this.isLimixiu) {
                this.protocol = "http:";
            }
            
            this.HOST_URL = this.protocol + "//openapi.layabox.com/";

            this.API_URL = this.HOST_URL + "developers/marketapi/";
            this.PAY_URL = this.HOST_URL + "paycenter/";
            this.UCENTER_URL = this.HOST_URL + "ucenter/";
            this.PAY_URL = this.HOST_URL + "developers/api/errorLog/"
            // this.API_URL = this.protocol + '//developers.devopen.layabox.com/marketapi/';
            // this.ErrorLogUrl = this.protocol + '//developers.masteropen.layabox.com/api/errorLog';
            // this.PAY_URL = this.protocol + '//paycenter.layabox.com/';
            // this.UCENTER_URL = this.protocol + '//ucenter.layabox.com/';
    
            return this;
        }
    
        /**
         * 加载文件
         */
        LayaCommon.loadScript = (function(){
            //  如果是小游戏环境，加载文件使用require
            if(LayaCommon.isWxGame) {
                return function(url, onload) {
                    var scp = require(url);
                    onload && onload({result:0, module : scp});
                }
            } else if(LayaCommon.isLimixiu){
                return function(url, onload) {
                    BK.Script.loadlib("GameRes://limixiu.js");
                    var loadTimer = new BK.Ticker();
                    loadTimer.interval = 1;
                    loadTimer.setTickerCallBack(function(){
                        if(_g.SPSdk) {
                            loadTimer.dispose();
                            onload && onload({result:0});
                        }
                    });
                }
            } else {
                return function (url, onload, onerror, errNum) {
                    errNum = errNum || 3;
                    var scp = document.createElement("script");
                    scp.onload = function () {
                        onload && onload({"result": 0});
                    };
                    scp.onerror = function () {
                        if(--errNum > 0) {
                            LayaCommon.loadScript(url, onload,onerror, errNum);
                        } else {
                            onerror && onerror({"result": -100, "desc": "脚本下载失败"});
                        }
                        
                    };
                    document.head.appendChild(scp);
                    scp.src = url;
                }
            }
            
        })();
    
        LayaCommon.getUniqueID = function (splitChar) {
            var uniqueID = "";
            for (var i = 1; i <= 32; i++) {
                uniqueID += Math.floor(Math.random() * 16.0).toString(16);
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    uniqueID += (splitChar ? splitChar : "");
            }
            return uniqueID;
        };
    
        LayaCommon.createCallback = function (callback, callbackName) {
            if (!callbackName)
                callbackName = "callback" + LayaCommon.getUniqueID("_");
            window[callbackName] = (function (name) {
                function CallbackHandler(param) {
                    if (window[CallbackHandler.funcName]) {
                        window[CallbackHandler.funcName] = null;
                        delete window[CallbackHandler.funcName];
                    }
                    if (document && document.head) {
                        var scp = document.getElementById(CallbackHandler.funcName)
                        scp && document.head.removeChild(scp);
                    }
                    callback && callback(param);
                }
    
                CallbackHandler.funcName = name;
                return CallbackHandler;
            })(callbackName);
            return callbackName;
        };
        
        /**
         * 请求数据
         */
        LayaCommon.getJson = (function(){
            
            if(LayaCommon.isWxGame) {
                return function(url, callback, errorCallback ,requestNum) {
                    requestNum = requestNum || 3;
                    var timer = null;
                    var isCallback = false;
                    wx.request({
                        url: url,
                        success: function (param){
                            isCallback = true;
                            timer && clearTimeout(timer);
                            callback && callback(param.data);
                        },
                        fail : failCallback
                    })
                    if(LBMH5.option.timeout !== void 0 && LBMH5.option.timeout !== 0) {
                        timer = setTimeout(failCallback, LBMH5.option.timeout * 1000);
                    }
                    function failCallback() {
                        timer && clearTimeout(timer);
                        if (!isCallback) {
                            isCallback = true;
                            if (--requestNum > 0) {
                                LayaCommon.getJson(url, callback, errorCallback,requestNum);
                            } else {
                                if (errorCallback) {
                                    errorCallback({ret : -2, msg : "Request Fail"});
                                    return false;
                                }
                                callback && callback({ret : -2, msg : "Request Fail"});
                            }
                        }
                    }
                    
                }
            } else if(LayaCommon.isLimixiu){

                return function(url , callback, errorCallback, requestNum) {
                    requestNum = requestNum || 3;
                    var httpimagreq = new BK.HttpUtil(url);
                    httpimagreq.setHttpMethod("get");
                    httpimagreq.requestAsync(function(res, code){
                        
                        
                        try {
                            var result = JSON.parse(res.readAsString(true));
                        } catch(e){
                            var result = res.readAsString();
                        }
                        callback && callback(result);
                        // console.log(res, code);
                        // console.log(arguments);
                    });
                }
                
            } else {
                return function(url, callback, errorCallback, requestNum) {
                    requestNum = requestNum || 3;
                    var timer = null;
                    var callbackName = LayaCommon.createCallback(function (param) {
                        isCallback = true;
                        timer &&clearTimeout(timer);
                        callback && callback(param);
                    });
                    var scp = document.createElement("script");
                    document.head.appendChild(scp);
                    scp.id = callbackName;
                    scp.onerror = failCallback;
                    scp.src = (url.indexOf("?") > -1) ? (url + "&callback=" + callbackName) : (url + "?callback=" + callbackName);
                    

                    if(LBMH5.option.timeout !== void 0 && LBMH5.option.timeout !== 0) {
                        timer = setTimeout(failCallback, LBMH5.option.timeout * 1000);
                    }

                    function failCallback() {
                        if (!isCallback) {
                            isCallback = true;
                            timer && clearTimeout(timer);
                            if (--requestNum > 0) {
                                LayaCommon.getJson(url, callback, errorCallback,requestNum);
                            } else {
                                if (errorCallback) {
                                    errorCallback({ret : -2, msg : "Request Fail"});
                                    return false;
                                }
                                callback && callback({ret : -2, msg : "Request Fail"});
                            }
                        }
                    }
                }
            }
    
        })();
    
        LayaCommon.getPostJson = function (targetUrl, params, method, accessToken, callback) {
            var url = this.API_URL + "marketapi/urlRequest?url=" + targetUrl + "&params=" + params + "&act=" + method;
            this.getJson(url, function (param) {
                callback && callback(param);
            }, function (param) {
                callback && callback(param);
            });
        };
    
        LayaCommon.errorLog = function(param){
            
            var str = [];
            for (var prop in param) {
                str.push(prop + "=" + encodeURIComponent(param[prop]));
            }
            str.push('errResourceUrl=' + encodeURIComponent(window.location.href));
            this.getJson(this.ErrorLogUrl + "?" + str.join("&"))
        };
    
        return LayaCommon.init();
    })();

    var LayaUserInfo = {
        avatarUrl: "",
        avatarBase64 : "",
        country :"",
        province:"",
        city :"",
        nickName:"",
        gender :"",
        language : "zh_CN"
    }
    
    var LayaBoxMarketH5 = function(){
        this.loginResult = null;
        this.instance = null;
        this.loginType = -1;
        this.loginResult = null;
        this.spSdk = null;
        this.basicInfo = {};
        this.queryParams = {};
    }

    var LBMH5 = null;

    /**
     * 获取实例
     * @param {Object} option  : {openId, spId, spName, debug, timeout}
     */
    LayaBoxMarketH5.getInstance = function(option){
        if (LayaBoxMarketH5.instance == null) {
            LBMH5 = _g.LBMH5 = LayaBoxMarketH5.instance = new LayaBoxMarketH5();
        }
        if(option.openId) {
            LayaBoxMarketH5.instance.option = option;
        } else {
            LBMH5.loginResult = {result : -5, desc: "openId not exist"};
        }
        
        return LayaBoxMarketH5.instance;
    }
    var  __proto = LayaBoxMarketH5.prototype;
    /**
     * 登录
     * @param {String} [param] 参数选填
     * @param {Function} callback 
     */
    __proto.login = function(param, callback) {
        if(typeof param === "function") {
            callback = param;
            param = "";
        }
    
        if(!param) {
            myInit();
            if(LayaCommon.isLimixiu) {
                var timer = new BK.Ticker();
                timer.interval = 1;
                timer.setTickerCallBack(function(){
                    if(LBMH5.loginResult) {
                        timer.dispose();
                        callback && callback(JSON.stringify(LBMH5.loginResult));
                    }
                });
            } else {
                var timer = setInterval(function() {
                    if(LBMH5.loginResult) {
                        clearInterval(timer);
                        callback && callback(JSON.stringify(LBMH5.loginResult));
                    }
                }, 16)
            }
   
        } else {
            innerLogin(param, function(data){
                callback && callback(JSON.stringify(data));
            })
        }
    }

    /**
     * 登录之后，检测其他方法是否可用
     * @param {String} name 
     * @return {Boolean}
     */
    __proto.canUse = function(name) {
        if(name === "recharge") {
            name = "pay";
        }
        var canName = "can" + name.substring(0,1).toUpperCase() + name.substring(1);
        if(LBMH5.spSdk && LBMH5.spSdk[canName]) {
            return Boolean(LBMH5.spSdk[canName]());
        } else {
            return Boolean(LBMH5.spSdk && LBMH5.spSdk[name]);
        }
    }

    __proto.logout = function(callback){
        checkApi("logout", callback, function(){
            LBMH5.loginResult = {result: 1000,data:{"loginType":parseInt(LBMH5.gameInfo.loginType)},desc: ""};
            LBMH5.spSdk.logout(function(param){
                callback && callback(JSON.stringify(param));
            });
        });
    }

    /**
     * 支付
     * @param {JSONString || Object} param 
     *  order_id: CP 方的订单号，如果没有order_id 的话传空,
     *  goods_name: 物品名称,
     *  amount: 人民币数量(单位分),
     *  goods_desc: 物品描述,
     *  serverId: 服务区号,
     *  params: 透传参数，market 在发货的时候会原样发回给游戏服务器 ,
     *  roleInfo: 角色信息 
     *  {
     *      roleName: 角色名称,
     *      roleId: 角色Id,
     *      balance: 用户游戏内虚拟币余额，如仙晶、元宝,
     *      gamerVip: 游戏内角色VIP 等级,
     *      level: 游戏内主角等级,
     *      partyName: 工会，帮派名称,
     *      serverName: 所在服务器名称,
     *  }
     *  
     * @param {Function} callback 
     */
    __proto.recharge = function(param, callback) {
        checkApi("pay", callback, function(){
            param = getParam(param);

            if(!param) {
                return false;
            }

            if (!param.params)
                param.params = param.order_id;
            
            var url = PAY_URL + "pay/" + (getSpId() || 40) + "/submit?" +
                "appId=" + LBMH5.gameInfo["openId"] +
                "&suserId=" + encodeURIComponent(LBMH5.userInfo["spuid"]) +
                "&stoken=" + encodeURIComponent(LBMH5.userInfo["sessionKey"] || '') +
                "&lang=" + (param.lang || 'cn') +
                "&amount=" + param.amount +
                "&payinfo=" + encodeURIComponent(param.goods_name) +
                "&params=" + encodeURIComponent(param.params || '') +
                "&token=" + (LBMH5.basicInfo["access_token"] || '') +
                "&currencyCode=" + (param.currency || 'CNY') +
                "&goodsDescription=" + encodeURIComponent(param.goods_desc) +
                "&gameId=" + LBMH5.gameInfo["openId"] +
                "&serverId=" + encodeURIComponent(param.serverId || 0) +
                "&userId=" + LBMH5.userInfo["unionUserId"]+
                (LBMH5.userInfo["other"] ? "&other=" + JSON.stringify(LBMH5.userInfo["other"]) : "")+
                "&channelExt=" + JSON.stringify(LBMH5.userInfo["channelExt"] || '');

            console.log(url);

            LayaCommon.getJson(url, function (param1) {
                if(param1.ret == 0){
                    param1.data.goodsName = param.goods_name;
                    param1.data.params = param.params;
                    param1.data.roleInfo = param.roleInfo;
                    LBMH5.spSdk.pay(param1, function (param2) {
                        callback && callback(JSON.stringify(param2));
                    });
                }else{
                    callback && callback(JSON.stringify({"result":-2,"desc":param1.msg}));
                }
            });
        });
    };

    /**
     * 分享
     * @param {JSONString || Object} param 
     *  "title" : 分享的标题,
        "link" : 分享后点击的页面url,
        // "icon" : 分享的icon 的url,
        "desc" : 分享界面的描述,
        "imgsrc" : 分享内容插图url,
        // "imgtitle" : 分享内容插图的标题,
        "ext" : 点开分享透传参数
     * @param {Function} callback 
     */
    __proto.share = function(param, callback) {
        checkApi("share", callback, function(){
            param = getParam(param);
            if(!param) {
                return false;
            }
            param.imgUrl = "";
            param.content = "";

            if (!param.imgUrl && param.imgsrc)
                param.imgUrl = param.imgsrc;

            if (!param.content && param.desc)
                param.content = param.desc;

            param.link = LBMH5.gameInfo["spGameUrl"] || param.link || "";
            LBMH5.spSdk.share(param, function(result) {
                callback && callback(JSON.stringify(result));
            });
        });
    }

    /**
     * @param {JSONString || Object} param 
     *  "title" : 分享的标题,
        "link" : 分享后点击的页面url,
        // "icon" : 分享的icon 的url,
        "desc" : 分享界面的描述,
        "imgsrc" : 分享内容插图url,
        // "imgtitle" : 分享内容插图的标题,
        "ext" : 分享透传参数
        "canvas" : 微信可用，  传入canvas图片
     * @param {Function} callback 
     */
    __proto.initShareInfo = function (param, callback) {
        param = getParam(param);
        if(!param) {
            return false;
        }
        LBMH5.configData = param;

        if(LBMH5.configData) {
            param.imgUrl = LBMH5.configData.imgsrc;
            param.content = LBMH5.configData.desc;
            param.title = LBMH5.configData.title;
        }
        if (!param.imgUrl && param.imgsrc)
            param.imgUrl = param.imgsrc;

        if (!param.content && param.desc)
            param.content = param.desc;
        checkApi("initShareInfo", function(){
            callback && callback(JSON.stringify({result:0}));
        }, function(){
            LBMH5.spSdk.initShareInfo(param, function(result){
                callback && callback(JSON.stringify(result));
            });
        })
    };

    /**
     * 显示二维码
     * @param {JSONString || Object} [param] 参数选填
     * @param {Function} callback 
     */
    __proto.showQRCode = function (param, callback) {
        checkApi("showQRCode", callback, function(){
            if(typeof param === "function") {
                callback = param;
                param = {};
            }
            LBMH5.spSdk.showQRCode(param, function(result){
                callback && callback(JSON.stringify(result));
            })
        })
    }

    /**
     * 发送到桌面
     * @param {JSONString || Object} param 
     * @param {Function} callback 
     */
    __proto.sendToDesktop = function (param, callback) {
        checkApi("sendToDesktop", callback, function(){
            param = getParam(param, callback);
            if(!param) return false;
            LBMH5.spSdk.sendToDesktop(param, function(result) {
                callback && callback(JSON.stringify(result));
            })
        })
    };

    /**
     * 绑定手机
     * @param {Function} callback 
     */
    __proto.bindPhone = function(callback) {
        checkApi("bindPhone", callback, function(){
            LBMH5.spSdk.bindPhone(function(param) {
                callback && callback(JSON.stringify(param));
            });
        })
    }

    /**
     * 收藏
     * @param {JSONString || Object} param 
     * @param {function} callback 
     */
    __proto.favorite = function(param, callback) {
        checkApi("favorite", callback, function() {
            param = getParam(param, callback);
            if(!param) {
                return false;
            };
           
            LBMH5.spSdk.favorite(param, function(result) {
                callback && callback(JSON.stringify(result));
            });
        })
    }

    /**
     * 添加监听，当webgl 的游戏在IOS 的APP 下的时候回home 会报错，需要监听此方法，根据回调的值来进行webgl 的暂停或者开始
     * @param {JSONString || Object} [param] 可选
     * @param {Function} callback 
     */
    __proto.registerAppLifecycleListener = function(param, callback) {
        checkApi("registerAppLifecycleListener", callback , function(){
            if(typeof param === "function") {
                callback = param;
                param = {};
            }
            param = getParam(param, callback);
            if(!param) return false;
            LBMH5.spSdk.registerAppLifecycleListener(param, function(result){
                callback && callback(JSON.stringify(result));
            })
        })
    }    

    /**
     * 数据上报 角色信息
     * @param {JSONString || Object} params 
     *  serverId: 服务器id
        serverName：服务器名称
        roleId：角色Id
        roleName：角色昵称
        level：角色等级
        fighting：角色战力
     * @param {Funtion} callback 
     */
    __proto.roleInfo = function(param, callback) {
        checkApi("roleInfo", function(){
            callback && callback({result:0})
        }, function(){
            param = getParam(param, callback);
            if(!param) {
                return false;
            }

            LBMH5.spSdk.roleInfo(param, function(result){
                callback && callback(JSON.stringify(result))
            });
        });
    }
    /**
     * 数据上报 创建角色
     * @param {JSONString || Object} param 
     * @param {Function} callback 
     */
    __proto.createRole = function(param, callback) {
        checkApi("createRole", function(){
            callback && callback({result:0});
        }, function(){
            param = getParam(param, callback);
            if(!param) {
                return false;
            };
            LBMH5.spSdk.createRole(param, function(result){
                callback&&callback(JSON.stringify(result));
            })
        });
    }

    /**
     * 自定义接口，此接口主要用于特殊渠道需求的使用
     * @param {String} name 自定义的方法名
     * @param {Array} array 参数值:[
            data:自定义函数需要的值(object),
            ……
            callback:自定义参数回调
        ]
     */
    __proto.customize = function (name, array) {
        checkApi(name, null, function(){
            LBMH5.spSdk[name].apply(LBMH5.spSdk,array);
        })
    }

    /**
     * 奖励广告
     * @param {String} placementID 广告Id
     * @param {Function} callback  1 开始视频 0 播放结束 -1 关闭视频 -2 错误 -3 关闭游戏
     */
    __proto.showRewardVideo = function(placementID, callback) {
        checkApi("showRewardVideo", callback, function(){
            LBMH5.spSdk.showRewardVideo(placementID, function(result) {
                callback && callback(JSON.stringify(result));
            })
        })
    }

    // 获取微信openId
    __proto.getUserOpenId = function(){
        return LBMH5.canUse("getUserOpenId") ? LBMH5.spSdk.getUserOpenId() : "";
    }

    /**
     * @param {String} adUnitId 广告Id
     * @param {String} style    广告样式
     * @param {Boolean} destroy 是否摧毁
     * @param {Function} callback 回调函数
     */
    __proto.showADBanner = function(adUnitId, style, destroy, callback){
        checkApi("showADBanner", callback, function(){
            LBMH5.spSdk.showADBanner(adUnitId, style, destroy, function(result) {
                callback && callback(JSON.stringify(result));
            })
        })
    }

    __proto.hideADBanner = function(adUnitId, callback){
        checkApi("hideADBanner", callback, function(){
            LBMH5.spSdk.hideADBanner(adUnitId, function(result) {
                callback && callback(JSON.stringify(result));
            })
        })
    }

    __proto.getGameData = function(param, callback) {
        checkApi("getGameData", callback, function(){
            LBMH5.spSdk.getGameData(param, function(result) {
                callback && callback(JSON.stringify(result));
            })
        });
    }

    __proto.getUserInfo = function(callback) {
        checkApi("getUserInfo", callback, function(){
            LBMH5.spSdk.getUserInfo(function(result) {
                // LayaUserInfo
                if(result.data) {
                    for(var key in LayaUserInfo) {
                        LayaUserInfo[key] = result.data[key] || (LBMH5.loginResult.data && LBMH5.loginResult.data[key]) || LayaUserInfo[key];
                    }
                    result.data = LayaUserInfo;
                }
                callback && callback(JSON.stringify(result));
            })
        });
    }

    __proto.getSelfGameData = function(param, callback) {
        checkApi("getSelfGameData", callback, function(){
            LBMH5.spSdk.getSelfGameData(param, function(result) {
                callback && callback(JSON.stringify(result));
            })
        });
    }

    __proto.reportedGameData = function(key, val ,callback) {
        checkApi("reportedGameData", callback, function(){
            LBMH5.spSdk.reportedGameData(key, val , function(result) {
                callback && callback(JSON.stringify(result));
            })
        });
    }

    __proto.showGameClubButton = function(style) {
        if(LBMH5.canUse("showGameClubButton")) {
            LBMH5.spSdk.showGameClubButton(style);
            return true;
        } else {
            return false;
        }
    }
    __proto.hideGameClubButton = function(style) {
        if(LBMH5.canUse("hideGameClubButton")) {
            LBMH5.spSdk.hideGameClubButton();
            return true;
        } else {
            return false;
        }
    }

    // 
    function getParam (param, callback) {
        if (typeof param === "string") {
            try {
                param = JSON.parse(param);
            } catch (e) {
                callback && callback(JSON.stringify({"result": -1, "desc": "json parse error"}));
                return false;
            }
        } else if (!param){
            
            return {};
        } else {
            return param;
        }
    }

    // 检测API是否支持
    function checkApi (name, callback, success) {
        if (LBMH5.canUse(name)) {
            success()
        } else {
            callback && callback(JSON.stringify({result:-2, desc:"not support " + name}))
        }
    }

    function innerLogin(param, callback) {
        if(LBMH5.loginType === 0) {
            LBMH5.loginResult = {
                result : -100,
                desc : "error",
            }
            return false;
        }

        LBMH5.spSdk.login(LBMH5.logonKey, function(param) {
            if(param.result === 0) {
                LBMH5.userInfo = param;
                if(LBMH5.option.debug) {
                    var result = JSON.parse(JSON.stringify(param));
                    LBMH5.loginResult = result;
                    callback && callback(JSON.stringify(LBMH5.loginResult));
                } else {
                    ucenterLogin(function(param) {
                        callback && callback(JSON.stringify(param));
                    })
                }

            } else {
                param.loginType = parseInt(LBMH5.gameInfo.loginType);
                param.spId = LBMH5.gameInfo.spId;
                LBMH5.loginResult = param;
                callback && callback(JSON.stringify(LBMH5.loginResult));
            }
        }, LBMH5);
    }

    function myInit() {
        var location = _g.location;
   
        if (!LayaCommon.isWxGame && !LayaCommon.isLimixiu && location && (location.search != "" || location.hash.indexOf('?') > -1)) {//获取游戏启动地址的参数
            console.log("game start:" + location.href);
            var search = location.search || location.hash.substring(location.hash.indexOf("?"));
            var queryParameters = search.substring(1).replace(/\?/g,"&").split("&");
            for (var i = 0; i < queryParameters.length; i++) {
                if (queryParameters[i].toLowerCase().indexOf("spid=") == 0 ) {
                    LBMH5.basicInfo["spId"] = queryParameters[i].replace(/spId=/i, "");
                } else {
                    var pos = queryParameters[i].indexOf("=");
                    if (pos === -1)
                        LBMH5.queryParams[queryParameters[i]] = "";
                    else
                        LBMH5.queryParams[queryParameters[i].substring(0, pos)] = decodeURIComponent(queryParameters[i].substring(pos + 1).replace(/\+/gi," "));
                }
            }
            
        } else if (LBMH5.option.spId) {
            LBMH5.basicInfo["spId"] = LBMH5.option.spId;
        } else {
            LBMH5.basicInfo["spId"] = '';
        }

        getGameInfo(function (param) {
            if (param.result == 0) {
                getSPLogonKey(function (param) {
                    if (param.result == 0) {
                        var spName = LBMH5.gameInfo["spFname"] && LBMH5.gameInfo["spFname"].toLowerCase();
                        if (!spName || spName == "") {
                            LBMH5.loginResult = {result: -6, desc: "sp not configure"};
                            return;
                        }
                        var loadSPJS = function(names){
                            if(LayaCommon.isWxGame) {
                                names = LBMH5.option.spName || "wxGame";
                                var url = "./" + names + ".js";
                            } else if(LayaCommon.isLimixiu){
                                name = LBMH5.option.spName || "limixiu";
                                var url = "./" + names + ".js";
                            } else {
                                names = LBMH5.option.spName || names;
                                var date = new Date();
                                var time = date.getFullYear()+""+date.getMonth()+""+date.getDay()+""+date.getHours();
                                // url = "../sp/" + names +".js";
                                var url = LayaCommon.protocol + "//layamarket.layabox.com/sp/" + names + ".js?rand=" + time;
                            }

                            LayaCommon.loadScript(url, function(spJs) {
                                if(LayaCommon.isWxGame) {
                                    LBMH5.spSdk = spJs.module;
                                    LBMH5.gameInfo["spId"] =  getSpId();
                                } else if(LayaCommon.isLimixiu){
                                    LBMH5.spSdk = new SPSdk();
                                    LBMH5.gameInfo["spId"] =  getSpId();
                                } else {
                                    LBMH5.spSdk = new SPSdk();
                                    LBMH5.gameInfo["spId"] =  LBMH5.gameInfo["sp"];
                                }

                                var prot = LBMH5.spSdk.__proto__;

                                for(var key in prot) {
                                    if(!LBMH5.__proto__[key] && key !== "init")  {
                                        LBMH5[key] = LBMH5.spSdk[key].bind(LBMH5.spSdk)
                                    }
                                }

                                LBMH5.gameInfo["logonKeyInfo"] = LBMH5.logonKey;
                                LBMH5.gameInfo["access_token"] = LBMH5.basicInfo["access_token"];
                                
                                LBMH5.spSdk.init(LBMH5.gameInfo, function (param) {
                                    
                                    if (param.result == 0) {
                                        innerLogin();
                                    } else {
                                        LBMH5.loginResult = {result: -105, desc: "sp init failed[" + param.result + "]"};
                                    }
                                });
                            } , function () {
                                LBMH5.loginResult = {result: -105, desc: "sp load file failed"};
                                // loadSPJS("layabox");
                            });
                        };
                        loadSPJS(spName);
                    } else {
                        LBMH5.loginResult = param;
                    }
                });
            } else {
                LBMH5.loginResult = param;
            }
        });
    }

    function ucenterLogin(callback) {
        var user = {
            spuid : encodeURIComponent(LBMH5.userInfo["spuid"] || ""),
            sp : getSpId() || LBMH5.gameInfo["sp"] || "",
            nickname : encodeURIComponent(LBMH5.userInfo["nickName"] || LBMH5.userInfo["nickname"] || ""),
            photo : encodeURIComponent(LBMH5.userInfo["avatarUrl"] || ""),
            sptoken : LBMH5.userInfo["sessionKey"] || "",
            typeId : 2,
            language : "cn",
            gameId : LBMH5.gameInfo["openId"] || "",
            sex : LBMH5.userInfo["sex"] || "",
            headimg : LBMH5.userInfo["avatarUrl"] || "",
            other : JSON.stringify({from:LBMH5.userInfo.from,time:Date.now()}),
            SpFname : LBMH5.gameInfo["spFname"] || ""
        }

        
        // 获取登录，更新用户信息
        var url = LayaCommon.UCENTER_URL + "api_v2/reglogin?";
   
        for(var key in user) {
            url += key + "=" + user[key] + "&";
        }
        LayaCommon.getJson(url, function (param) {
            if (param.ret == 0) {
                // param.data.spFid = LBMH5.gameInfo["spId"];
                param.data.spFname = LBMH5.gameInfo["spFname"];
                LBMH5.userInfo["unionUserId"] = param.data.unionUserId = param.data.userId;
                param.data.accessToken = LBMH5.basicInfo["access_token"];

                if (LBMH5.userInfo["type"])
                    param.type = LBMH5.userInfo["type"];
                param.data.avatarUrl = param.data.headimg || "";
                param.data.nickName = param.data.nickname || "";
                param.data.isSubscribe = LBMH5.userInfo.isSubscribe;
                param.loginType = parseInt(LBMH5.gameInfo.loginType);
                param.spId = LBMH5.gameInfo.sp;

                param.result = param.ret;
                param.desc = param.msg;
                param.other = LBMH5.userInfo.other || {};
                delete  param.data.nickname;
                delete  param.data.headimg;
                delete  param.ret;
                delete  param.msg;
                console.log(param);
                LBMH5.loginResult = param;
                callback && callback(LBMH5.loginResult)
            } else {
                LBMH5.loginResult = param;
                callback && callback(LBMH5.loginResult)
            }
        });
    }

    // 获取游戏信息
    function getGameInfo(callback) {
        // 获取关联的游戏的信息和渠道信息
        var spId = getSpId();
        var url = LayaCommon.API_URL + "getReletedByGidAndSid?spid=" + spId + "&appid=" + getOpenId();
        LayaCommon.getJson(url, function (param) {
            if (param.ret == 0) {
                LBMH5.gameInfo = param.data;
                LBMH5.loginType = parseInt(LBMH5.gameInfo.loginType);
                LBMH5.gameInfo["queryParams"] = LBMH5.queryParams;
                callback && callback({"result": 0});
            } else {
                callback && callback({"result": param.ret, "desc":  param.msg});
            }
        }, function () {
            callback && callback({"result": -103, "desc": "get gameInfo error[getGameInfo]"});
        });
    }

    function getSPLogonKey(callback) {
        var url = LayaCommon.API_URL + "getLogonKey?sp=" + getSpId();
        LayaCommon.getJson(url, function (param) {
            if (param.ret == 0) {
                LBMH5.logonKey = param;
                callback && callback({"result": 0});
            } else if (param.ret == 112) {
                callback && callback({"result": -104, "desc": "token error[-4]"});
            } else {
                callback && callback({"result": param.ret, "desc": param.msg});
            }
        }, function (param) {
            callback && callback({"result": -104, "desc": "get spKey error[" + param.result + "]"});
        });
    }

    /**
     * 获取渠道Id
     */
    function getSpId() {
        if (LayaCommon.isWxGame) {
            // 微信小游戏
            if (LayaCommon.isIOS) {
                return 514;
            } else {
                return 515;
            }
        } else if(LayaCommon.isLimixiu) {
            if (LayaCommon.isIOS) {
                return 603;
            } else {
                return 604;
            }
        } else if (LBMH5.basicInfo["spId"]) {
            return LBMH5.basicInfo["spId"];
        } else {
            return 432;
        }
    }
    /**
     * 获取游戏openId
     */
    function getOpenId() {
        return LBMH5.option.openId;
    }

    
    _g.LayaBoxMarketH5 = LayaBoxMarketH5;
    return LayaBoxMarketH5;
});
