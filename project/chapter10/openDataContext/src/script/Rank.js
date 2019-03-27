/**Rank.js */
export default class Rank extends ui.RankUI {
    constructor() {
        super();
    }
    onEnable() {
        this.list = this.getChildByName('list');
        var arr = [];
        this.list.array = arr;
    }

    /**
     *写入玩家数据
     */
    submitUserDate(bestScore) {
        console.log("开放域写入数据", bestScore);
        var self = this;
        //KVDataList代表排行数据,可以为多个,多个代表多个排行
        //key-排行类型,value-排行分数
        var KVDataList = new Array();
        //value 只能是字符串！！！
        KVDataList.push({
            key: "bestScore",
            value: bestScore.toString()
        });

        wx.setUserCloudStorage({
            KVDataList: KVDataList,
            success: function (res) {
                console.log('setUserCloudStorage', 'success', res)
                self.selectRanking();
            },
            fail: function (res) {
                console.log('setUserCloudStorage', 'fail')
            }
        });
    }

    /**
     * 拉取排行
     */
    selectRanking() {
        console.log("开始获取排行");
        //openIdList: ['selfOpenId']-代表获取个人数据
        //wx.getFriendCloudStorage获取好友数据(包括自己),所以用avatarUrl头像路径可分辨是否是自己
        //keyList-获取的排行类型,填入几个可以获得几个类别排行

        var self = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function (userRes) {
                //this.loadingLabel.active = false;
                console.log('拉取排行中的个人信息', userRes.data);
                //索引代表各个好友0为自己
                var userData = userRes.data[0];
                console.log("排行中的个人名字" + userData.nickName);
                //取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: [
                        'bestScore',
                    ],
                    success: function (res) {
                        console.log("wx.getFriendCloudStorage success", res);
                        var data = res.data;
                        data.sort(function (a, b) {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        var selfIndex = 0;
                        for (var i = 0; i < data.length; i++) {
                            var playerInfo = data[i];
                            //判断 data[i].nickname === userData,nickName 可能有相同昵称
                            if (data[i].avatarUrl == userData.avatarUrl) {
                                console.log('此ID为自己');
                                selfIndex = i;
                            }
                        }

                        for (var i = 0; i < data.length; i++) {
                            console.log('data[' + i + ']: ', data[i]);
                        }

                        self.setRankingDate(data, selfIndex);
                    },
                    fail: function (res) {
                        console.log("拉取好友信息失败", res);
                    },
                });
            },
            fail: function (res) {
                console.log("拉取个人信息失败")
            }
        });
    }

    /**
     * 设置排行界面显示数据
     */
    setRankingDate(usersData, selfIndex) {
        console.log("拿到data信息", usersData);
        console.log("长度", usersData.length);
        var arr = [];

        var data_length = usersData.length;
        if (data_length > 5) data_length = 5;//只显示前五名

        for (var i = 0; i < data_length; i++) {
            var user = usersData[i];
            //wxAPI中定义的nickname全部小写
            arr.push({ nickName: user.nickname, avatarUrl: user.avatarUrl, KVDataList: user.KVDataList });
        }

        console.log('数据准备完毕 \n', arr);
        //刷新排行榜
        this.update(arr);
    }

    update(arr) {
        if (arr === undefined) return;
        this.list.array = arr;
        this.list.renderHandler = new Laya.Handler(this, this.onRender);
    }
    
    onRender(cell, index) {
        //获取当前渲染条目的数据
        var data = this.list.array[index];
        console.log("个人信息", data);
        var ranking = cell.getChildByName("ranking");
        ranking.text = (index + 1);
        //根据子节点的名字name，获取子节点对象。         
        var name = cell.getChildByName("nickName");
        //label渲染列表文本（序号）
        name.text = data.nickName;
        var bestScore = cell.getChildByName("bestScore");
        bestScore.text = data.KVDataList[0].value;
        // var iconBG = cell.getChildByName("iconBG");
        var icon = cell.getChildByName("icon");
        //图片大小要与编辑器内一致,坐标为00,
        icon.loadImage(data.avatarUrl, 0, 0, 60, 60);
        console.log("排行数据=", index, '=刷新完成!~~');
    }
}