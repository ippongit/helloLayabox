var SPSdk = (function () {

    function SPSdk() {
        this.API_URL = LayaCommon.HOST_URL + "market_api";
        // this.API_URL = "http://layamarket.devopen.layabox.com";
        this.rewardedVideoAd = null;
        this.ADObj = {};
        this.reportedGameDataCache = {};
    }

    var __proto = SPSdk.prototype;
    __proto.init = function (param, callback) {
        console.log("模版初始化：" + JSON.stringify(param));
        var m_this = this;
        m_this.queryParams = param.queryParams;
        m_this.gameId = param.openId;
        m_this.spId = param.spId;
        callback && callback({ "result": 0, "desc": "OK" });
    }

    __proto.login = function (param, callback) {
        this.loginCallback = callback;
        var m_this = this;
        wxLogin();
        var verifyNum = 3;

        function wxLogin() {
            wx.checkSession({
                success: function (loginData) {
                    //session 未过期，并且在本生命周期一直有效
                    console.log("checkSession ok");
                    // getUserInfo();
                    checkSession(function(token, userOpenId){
                        m_this.userOpenId = userOpenId;
                        m_this.loginCallback && m_this.loginCallback({result:0, spuid: m_this.userOpenId});
                    });
                },
                fail: function () {
                    sessionExpired();
                }
            });
        };

        function getToken(code, num) {
            num = num || 3
            var timer = null;
            var isCallback = false;
            wx.request({
                url: m_this.API_URL + "/oauth/hooks/oauthLogin",
                data: {
                    game_id: m_this.gameId,
                    sp_id: m_this.spId,
                    code: code
                },
                method: "POST",
                success: function (res) {
                    isCallback = true;
                    timer && clearTimeout(timer);
                    if (res.data.ret == 0 && res.data.data.market_token) {
                        localStorage.setItem("laya_minigame_token", res.data.data.market_token);
                        localStorage.setItem("laya_minigame_openid", res.data.data.userOpenId);
                        m_this.userOpenId = res.data.data.userOpenId;
                        callback && callback({ result: 0, spuid: m_this.userOpenId});
                        // getUserInfo();
                    } else {
                        callback && callback({ result: -2, desc: res });
                    }
                },
                fail: failCallback
            })
            if(window.LBMH5 && window.LBMH5.option && window.LBMH5.option.timeout !== void 0 && window.LBMH5.option.timeout !== 0) {
                timer = setTimeout(failCallback, window.LBMH5.option.timeout * 1000);
            }
            function failCallback() {
                if(!isCallback) {
                    isCallback = true;
                    timer && clearTimeout(timer);
                    if (--num > 0) {
                        getToken(code, num);
                    } else {
                        m_this.loginCallback && m_this.loginCallback({ result: -2, desc: "getOpenId request fail" });
                    }
                }
                
            }
        }

        function checkSession(callback) {
            var storageData = localStorage.getItem("laya_minigame_token");
            var storageUser = localStorage.getItem("laya_minigame_openid");
            if (storageData && storageUser) {
                m_this.market_token = storageData;
                // verify(userInfo, 3);
                callback && callback(m_this.market_token, storageUser);
            } else {
                sessionExpired()
                // wxLogin();
            }
        }

        function sessionExpired() {
            //登录态过期
            console.log("checkSession fail");
            wx.login({
                success: function (dat) {
                    //session 未过期，并且在本生命周期一直有效
                    console.log("login ok" + JSON.stringify(dat));
                    // dat.code
                    if (dat.code) {
                        getToken(dat.code, 3);
                    } else {
                        m_this.loginCallback && m_this.loginCallback({ result: -2, desc: "get code fail" });
                    }
                },
                fail: function (res) {
                    //登录失败
                    console.log("login fail");
                    m_this.loginCallback && m_this.loginCallback({ result: -2, desc: "login error" });
                }
            }); //重新登录
        };
    }
    __proto.getUserOpenId = function () {
        return this.userOpenId || '';
    }
    //显示奖励式视频广告
    __proto.showRewardVideo = function (adUnitId, callback) {
        var m_this = this;
        var adobj = m_this.ADObj[adUnitId];
        var _callback = callback;
        if (!adobj) {
            //创建广告
            adobj = createVideoAD(adUnitId);
        }
        //监听广告关闭
        adobj.onClose(function (status) {
            if ((status && status.isEnded) || status == undefined) {
                console.log("观看完成发送奖励");
                _callback && _callback({ result: 0, desc: "ok" });
            } else {
                console.log("取消");
                _callback && _callback({ resujt: -1, desc: "cancel" });
            }

            adobj.offClose();
            adobj.offError();
            adobj.offLoad();
        });
        //加载广告
        adobj.load()
            .then(function () {
                //广告加载成功显示广告
                adobj.show();
            })
            .catch(function (err) {
                //拉取广告失败
                console.log(err.errMsg);
                adobj.destory && adobj.destory();
                _callback && _callback({ result: -2, desc: err });
            });

        //创建视频广告
        function createVideoAD(adUnitId) {
            m_this.ADObj[adUnitId] = wx.createRewardedVideoAd({
                adUnitId: adUnitId
            });
            return m_this.ADObj[adUnitId];
        };
    };


    //显示横幅广告
    __proto.showADBanner = function (adUnitId, style, destroy, callback) {
        var m_this = this;
        destroy === void 0 && (destroy = false);
        var _callback = callback;
        var adobj = m_this.ADObj[adUnitId];
        if (!adobj) {
            adobj = m_this.createBannerAD(adUnitId, style);
        }
        if (destroy) {
            adobj.destory();
            adobj = m_this.createBannerAD(adUnitId, style);
        }

        adobj.onError(function (err) {
            console.log(err);
            _callback && _callback({ result: -2 });
        });
        adobj.onLoad(function () {
            console.log("banner 广告加载成功");
            adobj.show();
            _callback && _callback({ result: 0 });
        });



        //创建横幅广告
        createBannerAD = function (adUnitId, style) {

            m_this.ADObj[adUnitId] = wx.createBannerAd({
                adUnitId: adUnitId,
                style: style
            });
            return m_this.ADObj[adUnitId];

        };

    };

    //隐藏横幅广告
    __proto.hideADBanner = function (adUnitId, callback) {
        var adobj = this.ADObj[adUnitId];
        if (adobj) {
            adobj.offError();
            adobj.offLoad();
            adobj.hide();
            callback && callback({ result: 0 });
        } else {
            callback && callback({ result: -2 });
        }
    };


    //获取微信上报数据
    __proto.getGameData = function (_keyList, callback) {
        var _callback = callback;
        wx.getFriendCloudStorage({
            keyList: _keyList,
            success: function (res) {
                console.log(
                    "----------------getFriendUserGameData-------------ok-----------"
                );
                if (res.data) {
                    console.log(res.data);
                    _callback && _callback({ result: 0, data: res.data });
                }
            },
            fail: function (data) {
                console.log(
                    "------------getFriendUserGameData--------------fail-------"
                );
                console.log(data);
                _callback && _callback({ result: -2 });
            }
        });
    };

    // 获取自己的用户信息
    __proto.getUserInfo = function (callback) {
        var _callback = callback;
        var m_this  = this;

        wx.getUserInfo({
            success: function (userInfo) {
                verify(userInfo, function(data){
                    _callback && _callback(data);
                })
            },
            fail: function (userInfo) {
                console.log("getUserInfo fail:", userInfo);
                _callback && _callback({ result: -2, desc: userInfo });
            }
        })

        function verify(userInfo, callback,num) {
            num = num || 3
            wx.request({
                url: m_this.API_URL + "/oauth/hooks/verifyUserinfo",
                data: {
                    game_id: m_this.gameId,
                    sp_id: m_this.spId,
                    rawData: userInfo.rawData,
                    market_token: m_this.market_token,
                    signature: userInfo.signature
                },
                method: "POST",
                success: function (res) {
                    if (verifyNum--) {
                        if (res.data.ret) {
                            callback && callback({ result: -2, desc: JSON.stringify(res.data) });
                        } else {
                            var data = res.data.data;
                            m_this.userOpenId = data.spuid;
                            data.sex = userInfo.userInfo.gender;
                            data.result = 0;
                            data.desc = "ok";
                            callback && callback(data);
                        }
                    } else {
                        callback && callback({ result: -2, desc: "verifyUserinfo fail" })
                    }

                },
                fail: function () {
                    if (--num > 0) {
                        verify(userInfo, --num);
                    } else {
                        m_this.loginCallback && m_this.loginCallback({ result: -2, desc: "verifyUserInfo Request Fail" });
                    }

                }
            });
        }
    };

    //获取当前用户微信上报数据
    __proto.getSelfGameData = function (_keyList, callback) {
        var _callback = callback;
        wx.getUserCloudStorage({
            keyList: _keyList,
            success: function (res) {
                console.log(
                    "----------------getUserCloudStorage--------------ok----------"
                );
                var kvDataList = res.KVDataList;
                if (kvDataList.length) {
                    var obj = JSON.parse(kvDataList[0].value);
                    _callback && _callback({ result: 0, data: (obj.wxgame.value1) });
                } else {
                    _callback && _callback({ result: 0, data: -1 });
                }
            },
            fail: function (data) {
                console.log(
                    "------------getUserCloudStorage--------------fail-------"
                );
                console.log(data);
                _callback && _callback({ result: -2, desc: data });
            }
        });
    };

    //微信数据上报
    __proto.reportedGameData = function (key, value, callback) {
        var _callback = callback;
        var kvDataList = [];
        var _key = key + "";
        var _value = value;
        var singleData = this.reportedGameDataCache[key];
        if (!singleData) {
            singleData = {};
            singleData.wxgame = {};
            singleData.wxgame.value1 = value;
            singleData.wxgame.layaUserId = this.spuid;
            singleData.wxgame.update_time = Math.floor(Date.now() / 1000);
            this.reportedGameDataCache[key] = singleData;
        } else {
            singleData.wxgame.value1 = value;
            singleData.wxgame.update_time = Math.floor(Date.now() / 1000);
            singleData.wxgame.layaUserId = this.spuid;
            this.reportedGameDataCache[key] = singleData;
        }
        kvDataList.push({ key: key, value: JSON.stringify(singleData) });

        wx.setUserCloudStorage({
            KVDataList: kvDataList,
            success: function (e) {
                console.log("-----success:" + JSON.stringify(e));
                _callback && _callback({ result: 0 });
            },
            fail: function (e) {
                console.log("-----fail:" + JSON.stringify(e));
                _callback && _callback({ result: -2 });
            }
        });
    };

    //微信 主域向子域发消息
    __proto.postMessage = function (data) {
        wx.postMessage(data);
    };

    //微信 子域监听主域发消息
    __proto.onMessage = function (callback) {
        var _callback = callback;
        wx.onMessage(function (data) {
            _callback && _callback(data);
        });
    };

    // 分享
    __proto.share = function (param, callback) {
        var _callback = callback;

        param.share_param = [];
        for (var key in param.ext) {
            param.share_param.push(key + "=" + param.ext[key]);
        }
        param.share_param = param.share_param.join("&");
        param.image_url = param.imgUrl;
        if (param.canvas) {

            param.canvas.toTempFilePath({
                success: function (res) {
                    param.image_url = res.tempFilePath;
                    wxShare(param, _callback);
                }
            });
        } else {
            wxShare(param, _callback);
        }

    };

    //微信转发 调起
    function wxShare(cfg, callback) {
        var _callback = callback;
        var _cfg = cfg;
        wx.showShareMenu();
        wx.updateShareMenu({
            withShareTicket: true,
            success: function (data) {
                console.log("--Share----updateShareMenu------success----------");
                console.log("-----cfg:" + JSON.stringify(cfg));
                wx.shareAppMessage({
                    getGroupMsgTicket: true,
                    title: _cfg.title,
                    imageUrl: _cfg.image_url,
                    query: _cfg.share_param,
                    success: function (res) {
                        console.log("调起分享", res);
                        _callback && _callback({ result: 0 });
                    },
                    fail: function (res) {
                        console.log("分享失败", res);
                        _callback && _callback({ result: -2 });
                    }
                });
            },
            fail: function (data) {
                console.log(
                    "--Share----updateShareMenu------fail----------"
                );
                console.log(data);
                _callback && _callback({ result: -2 })
            }
        });
    };

    //微信默认转发配置
    __proto.initShareInfo = function (param, callback) {
        var _callback = callback;
        var _param = param;
        if (!param.imgUrl && param.imgsrc)
            param.imgUrl = param.imgsrc;

        if (!param.content && param.desc)
            param.content = param.desc;
        param.share_param = [];
        for (var key in param.ext) {
            param.share_param.push(key + "=" + param.ext[key]);
        }
        param.share_param = param.share_param.join("&");
        param.image_url = param.imgUrl;
        if (param.canvas) {

            param.canvas.toTempFilePath({
                success: function (res) {
                    param.image_url = res.tempFilePath;
                    initShare(_param, _callback);
                }
            });
        } else {
            initShare(_param, _callback);
        }
    };

    function initShare(cfg, callback) {
        var _cfg = cfg;
        var _callback = callback;
        wx.showShareMenu();
        wx.updateShareMenu({
            withShareTicket: true,
            success: function (data) {
                console.log("------updateShareMenu------success----------");
                console.log(data);
                wx.onShareAppMessage(function (obj) {
                    console.log("onShareAppMessage");
                    return {
                        getGroupMsgTicket: true,
                        title: _cfg.title,
                        imageUrl: _cfg.image_url,
                        query: _cfg.share_param,
                        success: function (res) {
                            console.log(res);
                            _callback && _callback({ result: 0 });
                        },
                        fail: function () {
                            _callback && _callback({ result: -2 });
                        }
                    };
                });
            },
            fail: function (data) {
                console.log("------updateShareMenu------fail----------");
                console.log(data);
                _callback && _callback({ result: -2, desc: data })
            }
        });
    }


    __proto.showGameClubButton = function (style) {
        this.GameClubButton = wx.createGameClubButton(style)
        this.GameClubButton.show();
    }

    __proto.hideGameClubButton = function () {
        this.GameClubButton.destory();
    }
    return SPSdk;
})();

module && (module.exports = new SPSdk());