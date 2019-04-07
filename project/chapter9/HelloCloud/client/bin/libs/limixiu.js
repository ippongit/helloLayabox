var SPSdk = (function () {

    function SPSdk() {
        this.API_URL = LayaCommon.HOST_URL + "/market_api";
        // this.API_URL = "https://layamarket.masteropen.layabox.com";
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
        var _openId = this.getUserOpenId();
        this.userInfo = {
            openId : _openId
        };
        var _this = this;
        
        BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
            console.log(data);
            if (errCode === 0) {
                var openKey = data.openKey;
                _this.userInfo.openKey = openKey;
                console.log("openKey: ", openKey);
                getNickName(function(getNickResult){
                    _this.userInfo.nickName = getNickResult.data || "";
                    getAvatar(function(getAvatarResult){

                        _this.userInfo.avatarUrl = getAvatarResult.data || "";
                        var url = _this.API_URL + "/oauth/hooks/oauthLogin?game_id=" + _this.gameId + "&sp_id=" + _this.spId + "&open_id=" + _this.userInfo.openId + "&open_key=" + _this.userInfo.openKey;

                        LayaCommon.getJson(url, function(res){
                            if(res.ret) {
                                callback && callback({result:-2, desc : "鉴权失败"})
                            } else {
                                callback && callback({result:0, spuid : _this.userInfo.openId, nickName: _this.userInfo.nickName, avatarUrl : _this.userInfo.avatarUrl});
                            }
                        })
                        
                    })
                });
            } else {
                callback && callback({result:-2, desc:"DK授权失败, 请重试" + errCode});
            }
        });

        function getNickName(callback){
            BK.MQQ.Account.getNick(_openId,function(openId,nick){
                if(_openId === openId) {
                    callback && callback({result:0, data : nick});
                } else {
                    callback && callback({result:-2, desc:"getNickName openId is error"});
                }
            })
        }
        
        function getAvatar(callback) {
            BK.MQQ.Account.getHead(_openId, function(openId, BuffInfo){
                if(_openId === openId) {
                    var path = "GameRes://resource/avatar/"+_openId+".png";
                    var succ = BK.Image.saveImage(BuffInfo.buffer, BuffInfo.width, BuffInfo.height, path, "png");
                    if(succ) {
                        callback && callback({result:0, data: path});
                    } else {
                        callback && callback({result:-2});
                    }
                } else {
                    callback && callback({result: -2, desc:"getAvatar openId is error"})
                }
            });
        }
        
    }
    __proto.getUserOpenId = function () {
        return GameStatusInfo.openId;
    }
    //显示奖励式视频广告
    __proto.showRewardVideo = function (adUnitId, callback) {
        
    };

    // 获取自己的用户信息
    __proto.getUserInfo = function (callback) {
        callback && callback({result:0, data: this.userInfo});
    };


    // 分享
    __proto.share = function (param, callback) {
        // bk.QQ.shareToArk(0, param.title, param.image_url, true, param.share_url);
        var shareInfo = {
            summary:param.title,          //QQ聊天消息标题
            picUrl:param.imgUrl,               //QQ聊天消息图片
            extendInfo:JSON.stringify(param.ext),    //QQ聊天消息扩展字段
            localPicPath:savedPath,   //分享至空间、微信、朋友圈时需要的图。（选填，若无该字段，系统使用游戏对应的二维码）
            gameName:"游戏名"          //游戏名，暂用与生成二维码
        };
        
        BK.QQ.share(shareInfo, function (retCode, shareDest, isFirstShare) {
            if (retCode == 0) {
                if (shareDest == 0 /* QQ */) {
                    //聊天窗
                    BK.Script.log(3,0, "成功分享至QQ");
                }
                else if (shareDest == 1 /* QZone */) {
                    //空间
                    BK.Script.log(3,0, "成功分享至空间");
                }
                else if (shareDest == 2 /* WX */) {
                    //微信
                    BK.Script.log(3,0, "成功分享至微信");
                }
                else if (shareDest == 3 /* WXCircle */) {
                    // 朋友圈
                    BK.Script.log(3,0, "成功分享至朋友圈");
                }
                callback && callback({result:0, data : shareDest});
            }
            else if (retCode == 1) {
                callback && callback({result:-2})
            }
            else if (retCode == 2) {
                callback && callback({result:-1})
            }
        });
    };

    __proto.showRewardVideo = function(param, callback) {
        BK.Advertisement.fetchVideoAd(param, function (retCode, msg, handle) {
            if (retCode == 0) {
                updateTxt("拉取视频广告成功！");
                handle.setEventCallack(function (code, msg) {
                    callback && callback({result:3})
                }.bind(this), function (code, msg) {
                    callback && callback({result:0})
                }.bind(this), function (code, msg) {
                    callback && callback({result:-1})
                }.bind(this), function (code, msg) {
                    callback && callback({result:1});
                }.bind(this));
                //跳转至播放界面
                handle.jump();
            } else {
                callback && callback({result:-2})
            }
        }.bind(this));
    }
    return SPSdk;
})();
