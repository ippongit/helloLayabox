/**MainScene */
export default class MainScene extends Laya.Scene {
    constructor() { super(); }
    onEnable() {
        //判断是否是在微信环境
        if (typeof wx === "undefined") return;

        this.btn_open.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡

            var bestScore = parseInt(Math.random() * 10000);
            //发送指令让子域显示排行榜
            this.rank.postMsg({
                type: "show",
                bestScore: bestScore
            });
        });

        this.btn_close.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡
            //发送指令让子域关闭排行榜
            this.rank.postMsg({
                type: "close"
            });
        });

        this.btn_share.on(Laya.Event.CLICK, this, function (e) {
            e.stopPropagation();//阻止冒泡

            var title = 'LayaBox游戏分享';
            //不是图集，单独加载
            var imageUrl = 'img/image.png';

            // 主动转发微信群
            if (typeof wx !== "undefined") {
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                })
            }
        });
    }
}